
import { connectDB } from "@/lib/db";
import Blog from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { postId: string } }
) {
    const { postId } = await params

    if(!postId) {
        return NextResponse.json({
            error: "postId not found"
        }, {status: 404})
    } 

    try {
        await connectDB()

        const deleted = await Blog.findByIdAndDelete(postId);

        if (!deleted) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }
        
        return NextResponse.json({
            message: "post deleted successfully"
        }, {status: 200})

        
    } catch (error) {
        return NextResponse.json({
            error: "error in Delete API"
        }, {status: 500})
    }
}


export async function GET(
    request: NextRequest, 
    context: {params : {postId: string}}) 
    {
        const {postId} = await context.params

        if(!postId) {
            return NextResponse.json({
                error: "postId not found"
            }, {status: 404})
        }
        
        try {
            await connectDB()

            const blog = await Blog.findById(postId)
            
            if(!blog) {
                return NextResponse.json({
                error: "blog not found"
            }, {status: 404})
            }

            return NextResponse.json(blog, {status: 200, statusText: "OK"})

        } catch (error) {
            return NextResponse.json({
            error: error
        }, {status: 500})
        }
    }


export async function PATCH(request: NextRequest, 
    { params }: {params : {postId: string}}) {
        const {postId} = await params

        if(!postId) {
            return NextResponse.json({
                error: "postId not found"
            }, {status: 404})
        }

        try {
            await connectDB()

            const {title , content , tags , coverImageUrl} = await request.json()

            const blog = await Blog.findById(postId)
                

            if(!blog) {
                return NextResponse.json({
                error: "post not found"
            }, {status: 404})
            }

            if (title) blog.title = title;
            if (content) blog.content = content;
            if (tags) blog.tags = tags;
            if (coverImageUrl) blog.coverImageUrl = coverImageUrl;

            await blog.save()

            return NextResponse.json({message: "updated successfully"}, {status: 200})

        } catch (error) {
            console.error(error);

            return NextResponse.json({
            error: "error in PATCH post API"
        }, {status: 500})
        }
    }
