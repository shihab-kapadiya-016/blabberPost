import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import Comment from "@/models/comment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, {params}: {params: {commentId: string}}) {
    const { commentId } = params

    if(!commentId) {
        return NextResponse.json(
            {error: "comment Id is required"}, {status: 400}
        )
    }

    try {
        await connectDB()

        await Comment.findByIdAndDelete(commentId)

        return NextResponse.json({
            message: "Comment deleted successfully"
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({
            error
        }, {status: 500})
    }
}

export async function  PATCH(request: NextRequest, {params} : {params: {commentId: string}}) {
    const { commentId } = params
    const {content} = await request.json()

    if(!commentId) {
        return NextResponse.json(
            {error: "comment Id is required"}, {status: 400}
        )
    }

    try {
        await connectDB()

        const comment = await Comment.findById(commentId)
        
        if(!comment) {
            return NextResponse.json(
            {error: "comment not found"}, {status: 404}
        )
        }

        if(content) comment.content = content
        comment.save()

        
    } catch (error) {
        return NextResponse.json({
            error
        }, {status: 500})
    }
}

export async function POST(request: NextRequest, {params} : {params: {commentId: string}}) {
    const { commentId } = params
    const {content} = await request.json()
    const session = await getServerSession(authOptions)

    if(!commentId) {
        return NextResponse.json(
            {error: "comment Id is required"}, {status: 400}
        )
    }

    if(!session || !session?.user) {
        return NextResponse.json({
            error: "Unauthorized request"
        }, {status: 401})
    }

    try {
        await connectDB()

        const comment = await Comment.findById(commentId)

        if(!comment) {
            return NextResponse.json({
            error: "comment not found"
        }, {status: 404})
        }

        const reply = await Comment.create({
            content,
            postId: comment.postId,
            authorId: session.user.id,
            parentId: commentId
        })

        if(!reply) {
            return NextResponse.json({
            error: "error when replying to comment"
        }, {status: 500})
        }

        return NextResponse.json({
            msg: "replies to comment successfully",
            reply
        }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            error
        }, {status: 500})
    }
}

export async function GET(request: NextRequest, {params}: {params: {commentId: string}}) {
    const { commentId } = await params

    if(!commentId) {
        return NextResponse.json(
            {error: "comment Id is required"}, {status: 400}
        )
    }

    try {
        await connectDB()

        const replies = await Comment.find({parentId: commentId}).sort({createdAt: - 1})

        if(!replies) {
            return NextResponse.json(
            {error: "error fetching replies"}, {status: 500}
        )
        }

        return NextResponse.json(replies , {status: 200})
    } catch (error) {
        return NextResponse.json(
            {error}, {status: 400}
        )
    }
}