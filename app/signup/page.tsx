"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  UserPlus,
  X,
  XCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UploadFile from "@/Components/uploadFile";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const schema = z.object({
  username: z.string().min(3, "Username must be ≥3 chars"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be ≥6 chars"),
  bio: z.string().max(160).optional(),
});

type FormData = z.infer<typeof schema>;

const RegisterPage = () => {
  const router = useRouter();

  const [showPwd, setShowPwd] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image");
      e.target.value = "";
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedFile) return toast.error("Please select a file");

    try {
      setLoading(true);

      const imageKitAuthRes = await axios.get("/api/imagekit-auth");
      const { token, expire, publicKey, signature } = imageKitAuthRes.data;

      const imageKitFileUploadRes = await UploadFile(selectedFile, {
        token,
        expire,
        publicKey,
        signature,
      });
      const avatarUrl = imageKitFileUploadRes?.url;

      const sanitizedUsername = data.username.replace(/\s+/g, "_");


      const response = await axios.post("/api/auth/signup", {
        ...data,
        username: sanitizedUsername,
        avatarUrl,
      });

      toast.success("Account created successfully!", {
        description: "You're account is created. Please Login . 🎉",
        icon: <CheckCircle2 className="text-green-600" />,
        className: "bg-green-100 text-green-800 border border-green-300",
      });

      router.push("/signin");
    } catch (error: any) {
      console.error(error);
      toast.error("Sign up failed.", {
        description:
          error?.response?.data?.error ||
          error?.message ||
          "Please try again",
        icon: <XCircle className="text-red-600" />,
        className: "bg-red-100 text-red-800 border border-red-300",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center dark:text-neutral-100 bg-gray p-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl">
          <CardHeader className="text-center space-y-1 pt-8">
            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Join BlabberPost
            </CardTitle>
            <CardDescription className="text-sm">
              Create an account and start sharing your voice
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Profile Picture</Label>
                <div className="flex flex-col items-center gap-4">
                  {/* Avatar Preview */}
                  <div className="relative">
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full"
                          onClick={removeImage}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                        <Upload size={20} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File Input */}
                  <div className="w-full">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="h-12 py-3 file:mr-3 file:rounded  file:border-none file:bg-primary file:px-3 file:py-1.5  file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90 c"
                    />
                  </div>
                </div>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  placeholder="johndoe"
                  className="h-10 rounded"
                />
                {errors.username && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Bio Field */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="bio"
                  {...register("bio", {
                    maxLength: {
                      value: 160,
                      message: "Bio must be less than 160 characters",
                    },
                  })}
                  rows={3}
                  maxLength={160}
                  placeholder="Tell the world who you are..."
                  className="resize-none min-h-[80px] rounded"
                />
                {errors.bio && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                  placeholder="you@example.com"
                  className="h-10 rounded"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    placeholder="••••••••"
                    className="h-10 pr-10 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-10 gap-2 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-6">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold underline hover:text-purple-500"
              >
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
};

export default RegisterPage;
