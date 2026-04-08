import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { username, email, password, roleName } = await req.json();
        if (!username || !email || !password) {
            const response = NextResponse.next()
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const userData: any = {
            username,
            email,
            passwordHash: hashedPassword,
        };

        if (roleName) {
            const role = await prisma.role.findFirst({ where: { roleName } });
            if (role) {
                userData.roles = {
                    create: {
                        roleId: role.id
                    }
                };
            }
        } else {
            const memberRole = await prisma.role.findUnique({ where: { roleName: "Member" } });
            if (memberRole) {
                userData.roles = {
                    create: {
                        roleId: memberRole.id
                    }
                };
            }
        }

        const user = await prisma.user.create({
            data: userData,
        })
        return NextResponse.json(
            { message: "User created", userId: user.id },
            { status: 201 }
        );

    }
    catch (err) {
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}