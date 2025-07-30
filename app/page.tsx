"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useTheme } from "next-themes";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "@/features/userSlice";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"
import { current } from "@reduxjs/toolkit";
import { useSession } from "next-auth/react";



const featuredPosts = [
  {
    id: 1,
    title: "The Future of Blogging",
    excerpt: "AI, Web3, and the evolution of content creation...",
    author: "Jane Doe",
    tags: ["AI", "Future", "Tech"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
  },
  {
    id: 2,
    title: "Mastering TypeScript",
    excerpt: "From zero to hero in TypeScript for React devs...",
    author: "John Smith",
    tags: ["TypeScript", "React"],
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500",
  },
  {
    id: 3,
    title: "Minimalist UI Design",
    excerpt: "Why less is more in modern web interfaces...",
    author: "Alex Ray",
    tags: ["UI", "Design"],
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=500",
  },
];

export function HydrateUser() {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      dispatch(setUser(session.user));
    } else if (status === "unauthenticated") {
      dispatch(clearUser());
    }
  }, [status, session, dispatch]);

  return null;
}


export default function HomePage() {



  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, []);


  if (!mounted) {
    return (
      <h1>Wait a second</h1>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight"
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            BlabberPost
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Share your thoughts, discover amazing stories, and connect with
          writers worldwide.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex justify-center gap-4"
        >
          
            <Button asChild size="lg" className="cursor-pointer gap-2 dark:bg-white bg-gray-800 text-white dark:text-gray-800 hover:text-gray-800 border-1 dark:hover:text-white dark:hover:bg-gray-800">
            <Link href={"/write"} passHref className="flex gap-2 justify-center text-center items-center">
              Start Writing <ArrowRight size={20} />
            </Link>
            </Button>
          <Link href={"/explore"}>
            <Button variant="outline" size="lg" className="cursor-pointer hover:text-white hover:bg-gray-800">
              Explore Blogs
            </Button>
          </Link>
        </motion.div>
      </section>


      {/* Featured Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-purple-500" />
          <h3 className="text-3xl font-bold">Trending Now</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden group cursor-pointer border-none shadow-xl">
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardContent className="p-4">
                  <h4 className="text-xl font-semibold mb-2">{post.title}</h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">By {post.author}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
            <Button size="lg" variant="outline" className="cursor-pointer bg-white text-purple-600 dark:text-pink-700 dark:hover:text-pink-50">
              Create Your First Post
            </Button>
          </Link>
        </motion.div>
      </section>


    </div>
  );
}


