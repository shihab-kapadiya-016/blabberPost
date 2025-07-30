// /app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Eye, MessageSquare, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { IUser } from "@/models/user";
import Link from "next/link";
import { IBlog } from "@/models/blog";
import { IComment } from "@/models/comment";

export const handleDelete = async (id: string, setBlogs: Function) => {
        
        try {
            const response = await axios.delete(`/api/blog/${id}`)

            if(response.status === 200) {
                setBlogs((prev:IBlog[]) => prev.filter((blog) => blog._id !== id) )
            }

        } catch (error) {
            console.error("error while deleting post: ", error)
        }
    }




export default function DashboardPage() {
    const [user, setUser ] = useState<IUser>()
    const router = useRouter();
    const [blogs, setBlogs] = useState<IBlog[]>([])
    const [comments , setComments ] = useState<IComment[]>([])
    const [totalLikes, setTotalLikes] = useState<number>(0)


    const fetchUser = async () => {
        const response = await axios.get("/api/auth/me")
        setUser(response.data.user)
    }

    const fetchBlogs = async () => {
        const response = await axios.get('/api/blog/get-post-of-user')
        const blogsData = response.data
        setBlogs(blogsData)

        blogsData.forEach((post: IBlog) => fetchComments(post._id))
    }

    const fetchComments  = async (postId: string) => {
        const response = await axios.get(`/api/comment/post/${postId}`)

        const commentsData = response.data

        setComments(commentsData.filter((c: IComment ) => c.parentId === null))
    }

    useEffect(() => {
        const total = blogs.reduce((acc, blog) => acc + blog.likes.length, 0);
        setTotalLikes(total);
}, [blogs]);

    useEffect(() => {
        fetchUser()
        fetchBlogs()
    }, [])

    return (
        <main className="min-h-screen  dark:text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Sidebar */}
            <motion.aside
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            >
            <Card className="border-0 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl shadow-2xl rounded-2xl">
                <CardHeader className="items-center">
                <Avatar className="w-24 h-24 ring-4 ring-purple-500">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback>
                    {user?.email}
                    </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-3 text-xl">
                    {user?.username}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    {user?.email}
                </p>
                </CardHeader>

                <CardContent className="space-y-3">
                <div className="flex justify-around text-center">
                    <div>
                    <p className="text-2xl font-bold text-purple-600">{blogs.length}</p>
                    <p className="text-xs text-muted-foreground">Posts</p>
                    </div>
                    <div>
                    <p className="text-2xl font-bold text-purple-600">{totalLikes}</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                    </div>
                </div>

                <Button className="w-full gap-2">
                    <Link href={"/write"} className="w-full gap-2 flex justify-center align-center">
                        <Plus size={16} /> Write New Post
                    </Link>
                    
                </Button>
                </CardContent>
            </Card>
            </motion.aside>

            {/* Posts Feed */}
            <motion.section
            className="lg:col-span-3 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            >
            <h1 className="text-3xl font-bold tracking-tight">Your Posts</h1>
            
            {blogs.map((post) => 
            {
            return (
                <Card
                    key={post._id}
                    className="border-0 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden"
                    >
                    <div className="flex flex-col sm:flex-row">
                        {/* Link wraps only this section */}
                        <Link href={`/explore/${post._id}`} className="sm:flex w-full">
                        <img
                            src={post.coverImageUrl}
                            alt={post.title}
                            className="w-full sm:w-56 h-40 sm:h-auto object-cover"
                        />
                        <div className="flex-1 p-5 space-y-2">
                            <CardTitle className="text-xl hover:underline">{post.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="outline">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </Badge>
                            <span className="flex items-center gap-1">
                                <Heart size={14} /> {post.likes.length}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageSquare size={14} /> {comments.length}
                            </span>
                            </div>
                        </div>
                        </Link>

                        {/* Separator & Buttons */}
                        <div className="flex flex-col justify-between p-4 mt-9">
                        <div className="flex gap-2">
                            <Link href={`/edit/${post._id}`}>
                            <Button variant="ghost" size="sm">
                            Edit
                            </Button>
                            </Link>
                            <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDelete(post?._id, setBlogs)}
                            >
                            Delete
                            </Button>
                        </div>
                        </div>
                    </div>
                    </Card>
            )})}
            </motion.section>
        </div>
        </main>
    );
}