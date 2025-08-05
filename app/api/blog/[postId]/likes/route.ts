import { connectDB } from "@/lib/db";
import Blog, { IBlog } from "@/models/blog";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // make sure this is your configured auth
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = await params;

  const session = await getServerSession(authOptions); // 🛠️ include authOptions if needed

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
  }

  if (!postId || !Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ error: "Invalid or missing postId" }, { status: 400 });
  }

  try {
    await connectDB();

    const post: IBlog | null = await Blog.findById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userId = new Types.ObjectId(session.user.id);
    const hasLiked = post.likes.some((like) => like.equals(userId));

    if (hasLiked) {
      post.likes = post.likes.filter((like) => !like.equals(userId));
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return NextResponse.json(
      { message: "Like toggled successfully", likes: post.likes.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
