import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const requiredRoles = ["Admin", "Project Manager", "Member"];

        for (const roleName of requiredRoles) {
            await prisma.role.upsert({
                where: { roleName },
                update: {},
                create: { roleName }
            });
        }

        const roles = await prisma.role.findMany({
            orderBy: { id: 'asc' }
        });

        return NextResponse.json(roles);
    } catch (error) {
        console.error("Error fetching/creating roles:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
