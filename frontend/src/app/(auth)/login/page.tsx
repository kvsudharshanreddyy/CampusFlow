"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useState } from "react";
import api from "@/lib/axios";
import type { ApiResponse, User } from "@/types";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<{ user: User; token: string }>>(
        "/auth/login",
        data
      );
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel (decorative) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-primary items-center justify-center p-12">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-2.5 mb-8">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">CampusFlow</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-4 leading-tight">
            The AI-powered platform for high-achieving students
          </h2>
          <p className="text-white/80 text-base leading-relaxed">
            Manage tasks, track attendance, prepare for placements, and chat with your AI tutor — all in one place.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: "Tasks completed", value: "2.4M+" },
              { label: "Active students", value: "10K+" },
              { label: "AI conversations", value: "500K+" },
              { label: "Companies tracked", value: "1K+" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-white/70 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="h-6 w-6 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">CampusFlow</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link href="/register">
              <Button variant="ghost" size="sm">Create account</Button>
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to your CampusFlow account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign in <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
