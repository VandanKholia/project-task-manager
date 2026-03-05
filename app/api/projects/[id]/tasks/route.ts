import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/projects/[id]/tasks  — all tasks belonging to a project
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const tasks = await prisma.task.findMany({
            where: {
                list: {
                    projectId: Number(id),
                },
            },
            include: {
                assignedTo: {
                    select: { id: true, username: true, email: true },
                },
                list: {
                    select: { listName: true, projectId: true },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        const formatted = tasks.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            priority: t.priority,
            status: t.status,           // "Pending" | "InProgress" | "Completed"
            dueDate: t.dueDate,
            assignedTo: t.assignedTo
                ? {
                    id: t.assignedTo.id,
                    username: t.assignedTo.username,
                    initials: t.assignedTo.username.substring(0, 2).toUpperCase(),
                }
                : null,
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Error fetching project tasks:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH /api/projects/[id]/tasks  — update task status (for kanban drag)
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { taskId, status } = body;

        if (!taskId || !status) {
            return NextResponse.json({ error: "taskId and status are required" }, { status: 400 });
        }

        const updated = await prisma.task.update({
            where: { id: Number(taskId) },
            data: { status },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating task status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
