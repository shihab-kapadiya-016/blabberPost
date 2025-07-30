import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if(!session || !session?.user) {
        return NextResponse.json({
            error: "Unauthorized request"
        }, {status: 401})
    } 

    const userId = session.user.id

    try {
        await connectDB()
        
        const user = await User.findById(userId).select("-password -__v")

        if(!user) {
            return NextResponse.json({
            error: "user not found"
        }, {status: 404})
        }

        return NextResponse.json({
            user
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            error
        }, {status: 500})
    }
}