"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Loader2, Save, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { first_name: "", last_name: "", phone_number: "", bio: "" },
  });

  // Load backend profile data into the form once available
  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone_number: profile.phone_number || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileInput) => {
    await updateProfile.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="p-5 lg:p-6 max-w-2xl mx-auto flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">Profile Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Manage your personal university profile information</p>
      </div>

      {/* Avatar Display */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-bold">
                  {profile?.first_name ? getInitials(`${profile.first_name} ${profile.last_name || ""}`) : (user?.email ? getInitials(user.email.split("@")[0]) : "CF")}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <p className="text-sm font-bold">
                {profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}` : (user?.email?.split("@")[0] ?? "Student")}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="text-[10px] text-primary mt-1 capitalize font-semibold">{user?.role} Account</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Form */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">First Name</span>
                  <Input
                    placeholder="First Name"
                    {...register("first_name")}
                  />
                  {errors.first_name && <p className="text-[10px] text-destructive">{errors.first_name.message}</p>}
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Last Name</span>
                  <Input
                    placeholder="Last Name"
                    {...register("last_name")}
                  />
                  {errors.last_name && <p className="text-[10px] text-destructive">{errors.last_name.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Email (read-only)</span>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className="h-9 w-full rounded-lg border border-border bg-muted pl-8 pr-3 text-xs text-muted-foreground cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Phone Number</span>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    placeholder="+91 98765 43210"
                    className="h-9 w-full rounded-lg border border-border bg-transparent pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register("phone_number")}
                  />
                </div>
                {errors.phone_number && <p className="text-[10px] text-destructive">{errors.phone_number.message}</p>}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Bio</span>
                <textarea
                  placeholder="Tell us about your interests, major or graduation class..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  {...register("bio")}
                />
                {errors.bio && <p className="text-[10px] text-destructive">{errors.bio.message}</p>}
              </div>

              <Button type="submit" disabled={updateProfile.isPending || !isDirty} className="gap-1.5 w-full sm:w-auto text-xs h-8">
                {updateProfile.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
