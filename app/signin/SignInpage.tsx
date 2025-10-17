"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Chrome, CheckCircle2, XCircle } from "lucide-react";
import { json, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import axios from "axios";
import { setUser } from "@/features/userSlice";
import { toast } from "sonner";

const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const dispatch = useDispatch()


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);

        const res = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        if (res?.status === 200) {
            const userRes = await axios.get(`/api/auth/me`)
            const userData = userRes.data.user
            dispatch(setUser(userData))
            localStorage.setItem("currentUser", JSON.stringify(userData))
            toast.success("Signed in successfully!", {
                description: "Welcome back!",
                icon: <CheckCircle2 className="text-green-600" />,
                className: "bg-green-100 text-green-800 border border-green-300",
            });
            router.push(callbackUrl);
        } else {
            console.log(res?.error)
            

            toast.error("Sign in failed.", {
                description: "Please check your credentials.",
                icon: <XCircle className="text-red-600" />,
                className: "bg-red-100 text-red-800 border border-red-300",
            });
        }
        setLoading(false);
    }

    return (
        <main className="min-h-screen flex items-center justify-center dark:bg-background dark:text-neutral-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-background backdrop-blur-xl rounded-2xl">
                    <CardHeader className="text-center space-y-1 pt-8">
                        <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Welcome back
                        </CardTitle>
                        <CardDescription>Sign in to continue to BlabberPost</CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 pb-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email */}
                            <div>
                                <Label className="text-sm font-medium">Email</Label>
                                <Input type="email" placeholder="you@site.com" {...register("email")} />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Label className="text-sm font-medium">Password</Label>
                                <Input
                                    type={showPwd ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-3 top-9 text-neutral-500 dark:text-neutral-400"
                                >
                                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                            </div>

                            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "Signing in…" : <><LogIn size={18} className="mr-2" />Sign in</>}
                            </Button>
                        </form>



                        <p className="text-center text-sm text-muted-foreground mt-6">
                            No account yet?{" "}
                            <Link href="/signup" className="font-semibold underline hover:text-purple-500">
                                Sign up
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </main>
    );
}