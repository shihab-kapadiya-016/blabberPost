import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/blog";
import User from "@/models/user";

export async function GET(
  request: NextRequest,
  context: { params: { postId: string } }
) {
  const { postId } = await context.params;

  if (!postId) {
    return NextResponse.json({ error: "postId not found" }, { status: 404 });
  }

  try {
    await connectDB();

    const blog = await Blog.findById(postId);

    if (!blog) {
      return NextResponse.json({ error: "blog not found" }, { status: 404 });
    }

    const user = await User.findById(blog.authorId)
      .select("-password -__v")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error); // Log server error
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
