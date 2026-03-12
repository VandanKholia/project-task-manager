import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const assignedToMe = searchParams.get("assignedToMe") === "true";

        const whereClause: any = {};
        if (assignedToMe) {
            whereClause.assignedToId = user.id;
        }

        const tasks = await prisma.task.findMany({
            where: whereClause,
            include: {
                list: {
                    include: {
                        project: {
                            select: { projectName: true }
                        }
                    }
                },
                assignedTo: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formattedTasks = tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate,
            project: task.list.project.projectName,
            assignedTo: task.assignedTo
        }));

        return NextResponse.json(formattedTasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRoles = user.roles?.map((r: any) => r.role.roleName) || [];
        if (!userRoles.includes("Admin") && !userRoles.includes("Project Manager")) {
            return NextResponse.json({ error: "Forbidden: You don't have permission to create tasks" }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, priority, status, dueDate, projectId, assignedToId } = body;

        if (!title || !projectId || !status || !priority) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        let taskList = await prisma.taskList.findFirst({
            where: { projectId: Number(projectId) },
        });

        if (!taskList) {
            taskList = await prisma.taskList.create({
                data: {
                    listName: "General",
                    projectId: Number(projectId),
                },
            });
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
                listId: taskList.id,
                assignedToId: (assignedToId && assignedToId !== "0" && assignedToId !== "") ? Number(assignedToId) : null,
            },
        });

        return NextResponse.json(newTask);
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
