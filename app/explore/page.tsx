"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Heart, MessageSquare, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IBlog } from "@/models/blog";
import axios from "axios";
import Link from "next/link";
import { IUser } from "@/models/user";
import ExploreSkeleton from "@/Components/skeletons/ExploreSkeleton";



export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [authors, setAuthors] = useState<IUser[]>([])
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true);

  const filteredBlogs = blogs.filter((post) => {
    const matchesTag = activeTag ? post.tags?.includes(activeTag) : true;
    const matchesSearch = search
      ? post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      : true;

    return matchesTag && matchesSearch;
  });


  const fetchBlogs = async () => {
    const response = await axios.get("/api/blog")
    const blogsData = response.data
    setBlogs(blogsData)

    const allTags = blogsData.flatMap((blog: IBlog) => blog.tags || []);
    const uniqueTags: string[] = Array.from(new Set(allTags));
    setFilterTags(uniqueTags)
    return blogsData
  }

  const fetchAuthors = async (blogs: IBlog[]) => {
    if (!blogs || blogs.length === 0) return;


    try {
      const responses = await Promise.all(
        blogs.map((blog: IBlog) => axios.get(`/api/blog/${blog._id}/user`))
      );

      const users: IUser[] = responses.map((res) => res.data.user)
      setAuthors(users)
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    const load = async () => {
      const fetchedBlogs = await fetchBlogs(); // updates state
      await fetchAuthors(fetchedBlogs);
      setLoading(false) // uses updated blogs
    };

    load();
  }, []);

  return (
    <main className="min-h-screen dark:bg-background dark:text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {loading ? <ExploreSkeleton /> :
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 items-center"
            >
              <h1 className="text-3xl font-bold tracking-tight">Explore Posts</h1>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <Input
                  placeholder="Search posts...(e.g, Javascript, React, MongoDB)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {filterTags && filterTags.length > 0 && filterTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  className="cursor-pointer select-none text-sm"
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {activeTag && (
              <Button
                onClick={() => setActiveTag("")}
                variant="outline"
                size="sm"
                className="ml-1 mt-2 flex items-center gap-1"
              >
                <X size={14} /> Clear Tag Filter
              </Button>
            )}

            {/* Blog Cards Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >

              {filteredBlogs.map((post) => {
                const author = authors.find((a) => a._id === post.authorId);

                return (
                  <Link href={`/explore/${post._id}`} key={post._id}>
                    <Card
                      className="transition-transform duration-300 hover:scale-[1.015] hover:shadow-2xl border-0 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden flex flex-col"
                    >
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full aspect-[16/9] object-cover"
                      />
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {post.content}
                        </p>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <div className="flex flex-wrap gap-2 overflow-hidden">
                          {post.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs truncate max-w-[120px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={author?.avatarUrl} />
                            <AvatarFallback>{author?.username?.[0] || "A"}</AvatarFallback>
                          </Avatar>
                          <span>{author?.username || "Anonymous"}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Heart size={14} /> {post?.likes?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={14} /> {0}
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </motion.div>
          </>}
      </div>
    </main>

  );
}