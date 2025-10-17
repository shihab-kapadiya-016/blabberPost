"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import axios from "axios";

type User = {
    _id: string;
    username: string;
    email: string;
    password: string;
    avatarUrl: string;
    bio: string;
    createdAt: Date
}


type Post = {
  _id: string;
  title: string;
  excerpt: string;
  authorId: string;
  tags: string[];
  coverImageUrl: string;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postAuthors, setPostAuthors] = useState<User[]>([])

  useEffect(() => {
  const fetchPostsAndAuthors = async () => {
    try {
      const res = await axios.get("/api/blog");
      const blogs = res.data;
      setPosts(blogs);

      // Fetch authors for each blog
      const authors = await Promise.all(
        blogs.map(async (post: any) => {
          const res = await axios.get(`/api/blog/${post._id}/user`);
          return res.data.user; // assuming your author endpoint returns { user: ... }
        })
      );

      setPostAuthors(authors);
    } catch (error) {
      console.error("Error fetching posts or authors:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPostsAndAuthors();
}, []);

  if (loading) {
    return <h1 className="text-center mt-20">Loading posts...</h1>;
  }


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
       <section className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6">Latest Blogs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, idx) => {
            const author = postAuthors.find((user) => user._id === post.authorId)
            return (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/explore/${post._id}`}>
                <Card className="overflow-hidden group cursor-pointer border-none shadow-xl">
                  <div className="relative">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="text-xl font-semibold mb-2">{post.title}</h4>
                    <div className="flex gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        By {author?.username || author?.email}...
                      </p>
                      <ArrowRight size={20} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )})}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BookOpen size={64} className="mx-auto mb-4" />
          <h3 className="text-4xl font-bold mb-4">Ready to Share Your Story?</h3>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Join thousands of writers and readers on BlabberPost.
          </p>
          <Link href={"/write"}>
            <Button size="lg" variant="outline">
              Create Your First Post
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );  
}
