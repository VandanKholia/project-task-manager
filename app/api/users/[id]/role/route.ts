import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRoles = currentUser.roles?.map((r: any) => r.role.roleName) || [];
        if (!userRoles.includes("Admin")) {
            return NextResponse.json({ error: "Forbidden: Only Admins can edit roles" }, { status: 403 });
        }

        const { roleId } = await req.json();
        const { id } = await params;
        const userId = parseInt(id, 10);

        if (!roleId || isNaN(userId)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // Delete existing roles
        await prisma.userRole.deleteMany({
            where: { userId }
        });

        // Add new role
        await prisma.userRole.create({
            data: {
                userId,
                roleId: Number(roleId)
            }
        });

        return NextResponse.json({ message: "Role updated successfully" });
    } catch (error) {
        console.error("Error updating role:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
