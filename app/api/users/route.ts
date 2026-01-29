import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                roles: {
                    include: {
                        role: true
                    }
                },
                createdAt: true
            },
            orderBy: { createdAt: "desc" },
        });

        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.roles.length > 0 ? user.roles.map(r => r.role.roleName).join(", ") : "Member", // Default to Member if no role
            status: "Active", // Hardcoded for now 
            initials: user.username.substring(0, 2).toUpperCase(),
            createdAt: user.createdAt
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
