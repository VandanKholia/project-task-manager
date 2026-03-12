import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/projects/[id]/members — list project members
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

        const members = await prisma.projectMember.findMany({
            where: { projectId: Number(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });

        const formatted = members.map((m) => ({
            id: m.user.id,
            name: m.user.username,
            email: m.user.email,
            role: m.role,
            initials: m.user.username.substring(0, 2).toUpperCase(),
            memberId: m.id,
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Error fetching project members:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/projects/[id]/members — add a member to the project
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRoles = user.roles?.map((r: any) => r.role.roleName) || [];
        if (!userRoles.includes("Admin") && !userRoles.includes("Project Manager")) {
            return NextResponse.json({ error: "Forbidden: You don't have permission to manage project members" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { userId, role } = body;

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        const member = await prisma.projectMember.create({
            data: {
                projectId: Number(id),
                userId: Number(userId),
                role: role || "Member",
            },
            include: {
                user: {
                    select: { id: true, username: true, email: true },
                },
            },
        });

        return NextResponse.json({
            id: member.user.id,
            name: member.user.username,
            email: member.user.email,
            role: member.role,
            initials: member.user.username.substring(0, 2).toUpperCase(),
            memberId: member.id,
        });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json({ error: "User is already a member" }, { status: 409 });
        }
        console.error("Error adding project member:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE /api/projects/[id]/members — remove a member from the project
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRoles = user.roles?.map((r: any) => r.role.roleName) || [];
        if (!userRoles.includes("Admin") && !userRoles.includes("Project Manager")) {
            return NextResponse.json({ error: "Forbidden: You don't have permission to remove project members" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { userId } = body;

        await prisma.projectMember.deleteMany({
            where: {
                projectId: Number(id),
                userId: Number(userId),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing project member:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
