import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret";
export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: Number(decoded.userId) },
            select: {
                id: true,
                username: true,
                email: true,
                roles: true,
            },
        });

    return user;

    } catch (error) {
        console.error("Auth Error:", error);
        return null;
    }
}