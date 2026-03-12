import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "status is required" }, { status: 400 });
        }

        const updated = await prisma.task.update({
            where: { id: Number(id) },
            data: { status },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRoles = user.roles?.map((r: any) => r.role.roleName) || [];
        if (!userRoles.includes("Admin") && !userRoles.includes("Project Manager")) {
            return NextResponse.json({ error: "Forbidden: You don't have permission to delete tasks" }, { status: 403 });
        }

        const { id } = await params;

        await prisma.task.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
