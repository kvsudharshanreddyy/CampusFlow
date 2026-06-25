"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, Lock, ArrowRight, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useState } from "react";
import api from "@/lib/axios";
import type { ApiResponse, User as UserType } from "@/types";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      await api.post<ApiResponse<UserType>>("/auth/register", {
        email: data.email,
        password: data.password,
      });
      // Auto-login after register
      const loginRes = await api.post<ApiResponse<{ user: UserType; token: string }>>(
        "/auth/login",
        { email: data.email, password: data.password }
      );
      setAuth(loginRes.data.data.user, loginRes.data.data.token);
      toast.success("Account created! Welcome to CampusFlow 🎓");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 border-r border-border">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="h-8 w-8 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-xl font-bold">CampusFlow</span>
          </div>
          <h2 className="text-3xl font-extrabold leading-tight">
            Start your AI-powered academic journey today
          </h2>
          <div className="space-y-4 mt-8">
            {[
              "✅ Free to start, no credit card required",
              "🤖 AI tutor available 24/7",
              "📅 Google Calendar sync built-in",
              "💼 Track placements from one dashboard",
              "📊 Real-time attendance analytics",
            ].map((item) => (
              <p key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="h-6 w-6 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">CampusFlow</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Join CampusFlow — it&apos;s free to start
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@university.edu"
                icon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register("password")}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <Button type="submit" className="w-full gap-2 mt-2" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Create account <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
