import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import Blog from "@/models/blog";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB()
    
        const blogs = await Blog.find({}).sort({createdAt: - 1})
    
        if(!blogs) {
            return NextResponse.json({
                error: "error while fetching posts"
            }, {status: 500})
        }
    
        return NextResponse.json(blogs, {status: 200})

    } catch (error) {
            return NextResponse.json({
            error
        }, {status: 500})
    }
}



export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if(!session || !session?.user) {
            return NextResponse.json({
            error: "an error occured while getting session, Please Login"
        }, {status: 400})
    }

    const {title , content , coverImageUrl , tags} = await request.json()

    if(!title || !content || !coverImageUrl) {
        return NextResponse.json({
            error: "title content and coverImage is required"
        }, {status: 401})
    }

    try {
        await connectDB()

        const blog = await Blog.create({
            title,
            content,
            coverImageUrl,
            tags: tags || [],
            authorId: session.user.id,
            published: true
        })

        if(!blog) {
            return NextResponse.json({
            error: "error occured while creating blog"
        }, {status: 503})
        }

        return NextResponse.json({
            message: "blog posted successfully",
            blog
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            error: "error occured while posting blog"
        }, {status: 500})
    }

}