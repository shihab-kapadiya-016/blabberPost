import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request :NextRequest) {
    try {
        const {username , email , password , avatarUrl} = await request.json()

        if(!username || !email || !password) {
            return NextResponse.json({
                error:"All fields are required"
            }, {status: 400})
        }

        await connectDB()

        const existingUser = await User.findOne({
            $or: [{email}, {username}]
        })

        if(existingUser) {
            return NextResponse.json({
                error:"User with this username or email already exists"
            }, {status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            username,
            email,
            password: hashedPassword,
            avatarUrl
        })

        return NextResponse.json({
            message: "User registered successfully"
        }, {status: 200})


    } catch (error) {
        return NextResponse.json({
                error:"Error occured in registeration API : " + error,
            }, {status: 400})
    }
}