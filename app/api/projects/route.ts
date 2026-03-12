import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        members: {
          include: {
            user: { select: { id: true, username: true } },
          },
        },
        taskLists: {
          include: {
            tasks: { select: { id: true, status: true } },
          },
        },
      },
    });

    const formatted = projects.map((p) => {
      const allTasks = p.taskLists.flatMap((l) => l.tasks);
      const completedTasks = allTasks.filter((t) => t.status === "Completed").length;
      const totalTasks = allTasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: p.id,
        projectName: p.projectName,
        description: p.description,
        createdAt: p.createdAt,
        totalTasks,
        completedTasks,
        progress,
        memberCount: p.members.length,
        members: p.members.map((m) => ({
          id: m.user.id,
          initials: m.user.username.substring(0, 2).toUpperCase(),
          name: m.user.username,
        })),
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRoles = user.roles?.map((r: any) => r.role.roleName) || [];
    if (!userRoles.includes("Admin") && !userRoles.includes("Project Manager")) {
      return NextResponse.json({ error: "Forbidden: You don't have permission to create projects" }, { status: 403 });
    }

    const json = await request.json();
    const { projectName, description } = json;

    if (!projectName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        projectName,
        description,
        createdById: user.id
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
