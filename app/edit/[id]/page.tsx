// app/posts/[id]/edit/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { Funnel_Sans } from "next/font/google";

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams()
    const postId = params?.id as string;

    const [post, setPost] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null)
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");


    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/api/blog/${postId}`);
                const data = await res.data;
                setPost(data);
                setFile(data.coverImageUrl)
                setTags(data.tags || [])
                setFilePreview((data.coverImageUrl))
            } catch (err) {
                setError("Failed to load post. " + err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setFile(file)
            setFilePreview(URL.createObjectURL(file))

        } else {
            setFile(post?.coverImageUrl)
            setFilePreview(URL.createObjectURL(post?.coverImageUrl))
        }
    }

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleSubmit = async () => {
        setUpdating(true);

        try {
            const response = await axios.get(`/api/blog/${postId}`)
            router.push(`/explore/postId`)

        } catch (error) {
            setError("error while updating user " + error)
        } finally {
            setUpdating(false)
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-center text-muted-foreground">
                <Loader2 className="animate-spin w-6 h-6 inline-block mr-2" />
                Loading post...
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-2xl mx-auto mt-10">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && <p className="text-destructive text-sm">{error}</p>}
                    <Input
                        name="title"
                        placeholder="Post Title"
                        value={post?.title || ""}
                        onChange={handleChange}
                    />
                    {filePreview && (
                        <img
                            src={filePreview}
                            alt="Current cover"
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                    )}

                    <Input
                        type="file"
                        name="coverImage"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <Textarea
                        name="content"
                        placeholder="Post Content"
                        value={post?.content || ""}
                        onChange={handleChange}
                        rows={8}
                    />

                    <div>
                        <div className="flex flex-wrap gap-2 mt-2 mb-2">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-muted px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        className="text-destructive ml-1 text-xs"
                                        onClick={() => removeTag(tag)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <Input
                            type="text"
                            value={tagInput}
                            placeholder="Type and press Enter Tags"
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                        />
                    </div>

                    <Button onClick={handleSubmit} disabled={updating}>
                        {updating ? (
                            <>
                                <Loader2 className="animate-spin w-4 h-4 mr-2" /> Saving...
                            </>
                        ) : (
                            "Update Post"
                        )}
                    </Button>



                </CardContent>
            </Card>
        </div>
    );
}
