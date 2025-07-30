import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import Blog from "@/models/blog";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if(!session || !session?.user) {
        return NextResponse.json({
            error: "Unauthorized request"
        }, {status: 401})
    }

    try {
        await connectDB()
        
        const blog = await Blog.find({authorId: session.user.id})
    
        if(!blog) {
            return NextResponse.json({
                error: "blog not found"
            }, {status: 401})
        }
    
        return NextResponse.json(blog, {status: 200})
    
    } catch (error) {
        console.log(error)
        return NextResponse.json({
                error: "unexpected error occured"
            }, {status: 500})
    }
}