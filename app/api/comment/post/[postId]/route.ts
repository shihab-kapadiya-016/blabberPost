
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import Comment from "@/models/comment";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { postId: string } }
) {
    const { postId } = await params;
    const session = await getServerSession(authOptions);
    const { content } = await request.json();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
    }

    if (!Types.ObjectId.isValid(postId)) {
        return NextResponse.json({ error: "Invalid postId format" }, { status: 400 });
    }

    try {
        await connectDB();

        const comment = await Comment.create({
        content,
        postId: new Types.ObjectId(postId),
        authorId: new Types.ObjectId(session.user.id),
        });

        return NextResponse.json(
        { message: "Comment posted successfully", comment },
        { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    {params}: {params: {postId: string}}) 
    {
        const {postId} = params;

        if(!postId) {
            return NextResponse.json({
                error: "postId is required"
            }, {status: 401})
        }

        try {
            await connectDB()
            const comments = await Comment.find({postId: postId}).sort({createdAt: - 1 })
    
            if(!comments) {
                return NextResponse.json({
                    error: "no comments"
                }, {status: 401})
            }
    
            return NextResponse.json(comments, {status: 200})
        } catch (error) {
            return NextResponse.json({
                    error
                }, {status: 500})
        }
    }