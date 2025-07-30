import { connectDB } from "@/lib/db";
import Comment from "@/models/comment";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: {commentId: string}}) {
    const {commentId} = await params

    if(!commentId) {
        return NextResponse.json({error: "comment id is required"}, {status: 400})
    }
    try {
        await connectDB()
        const comment = await Comment.findById(commentId)
    
        if(!comment) {
            return NextResponse.json({error: "comment not found"}, {status: 404})
        }
    
        const user = await User.findById(comment.authorId).select("-password -__v")
    
        if(!user) {
            return NextResponse.json({error: "user not found"}, {status: 404})
        }
    
        return NextResponse.json(user, {status: 200})
        
    } catch (error) {
        return NextResponse.json(error, {status: 500})
}
} 