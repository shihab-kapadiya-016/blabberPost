"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ImagePlus, X, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import UploadFile from "@/Components/uploadFile";
import { toast } from "sonner";

const schema = z.object({
    title: z.string().min(3, "Title ≥3 chars"),
    content: z.string().min(20, "Content ≥20 chars"),
    tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function WritePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    // Redirect if not authenticated
    if (status === "loading") return null;

    const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);

        if (!coverFile) {
            alert("Please select the file for cover image")
            setLoading(false)
            return

        }

        const imageKitAuthRes = await axios.get("/api/imagekit-auth")

        const { token, expire, signature, publicKey } = imageKitAuthRes.data

        const imageKitFileRes = await UploadFile(coverFile, { token, expire, signature, publicKey })

        const coverImageUrl = imageKitFileRes?.url

        const parsedTags = data.tags ? data.tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0) : []

        const res = await axios.post("/api/blog", {
            title: data.title,
            content: data.content,
            tags: parsedTags,
            coverImageUrl
        });

        if (res.status === 200) {
            toast.success("Post published!", {
                icon: "📝",
                duration: 4000,
                style: {
                    borderRadius: "8px",
                    background: "#1e1e1e",
                    color: "#fff",
                },
            });
            router.push("/dashboard");
        } else {
            const { message } = await res.data.eror();
            alert(message || "Error creating postr");
            toast.error(message || "error creating post" , {
                duration: 4000,
                style: {
                    borderRadius: "8px",
                    background: "#1e1e1e",
                    color: "red",
                },
            })
        }
        setLoading(false);

    };

    return (
        <main className="min-h-screen dark:bg-background dark:text-neutral-100 p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto"
            >
                <Card className="border-0 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl shadow-2xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Create New Post
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Cover Image */}
                            <div>
                                <Label>Cover Image</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCover}
                                    className="mt-1"
                                />
                                {coverPreview && (
                                    <div className="relative mt-2">
                                        <img
                                            src={coverPreview}
                                            alt="cover"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 w-7 h-7"
                                            onClick={() => {
                                                setCoverPreview(null);
                                                setCoverFile(null);
                                            }}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <Label>Title</Label>
                                <Input placeholder="Post title" {...register("title")} className="mt-2 rounded" />
                                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                            </div>

                            {/* Content */}
                            <div>
                                <Label>Content</Label>
                                <Textarea
                                    rows={10}
                                    placeholder="Write your article here..."
                                    {...register("content")}
                                    className="mt-2 rounded"
                                />
                                {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
                            </div>

                            {/* Tags */}
                            <div>
                                <Label>Tags (comma separated)</Label>
                                <Input placeholder="nextjs, webdev, design" {...register("tags")} className="mt-2 rounded" />
                            </div>

                            <Separator />

                            <Button type="submit" disabled={loading} className="w-full gap-2 bg-gray-700 dark:bg-white hover:bg-gray-600 text-gray-200 dark:text-gray-800 dark:hover:bg-gray-300">
                                {loading ? "Publishing…" : <><Send size={16} /> Publish Post</>}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </main>
    );
}