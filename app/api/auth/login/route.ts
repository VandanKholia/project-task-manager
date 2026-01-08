import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		if (!password || !email) {
			return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
		}
		const user = await prisma.user.findUnique({
            where: {email},
        })
        if(!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

		const isValidPassword = await bcrypt.compare(password, user.passwordHash || "");
		if (!isValidPassword) {
			return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
		}

        const token = signToken({
            userId: user.id,
            email: user.email,
        })

         const res = NextResponse.json({ message: "Login successful" });
         
         res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, 
            path: "/",
        });
		
        return res;
        
	} catch (err) {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}