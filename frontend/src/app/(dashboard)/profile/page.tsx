"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, FileText, Camera, Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { toast } from "sonner";
import { useState } from "react";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { first_name: "", last_name: "", phone_number: "", bio: "" },
  });

  const onSubmit = async (data: ProfileInput) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Profile updated successfully!");
    setSaving(false);
  };

  return (
    <div className="p-5 lg:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-5 flex items-center gap-5">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl font-bold">
                  {user?.email ? getInitials(user.email.split("@")[0]) : "CF"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-base font-semibold">{user?.email?.split("@")[0] ?? "Student"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-primary mt-1 capitalize">{user?.role} Account</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  icon={<User className="h-4 w-4" />}
                  error={errors.first_name?.message}
                  {...register("first_name")}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  icon={<User className="h-4 w-4" />}
                  error={errors.last_name?.message}
                  {...register("last_name")}
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={user?.email ?? ""}
                disabled
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Phone Number"
                placeholder="+91 98765 43210"
                icon={<Phone className="h-4 w-4" />}
                {...register("phone_number")}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  {...register("bio")}
                />
                {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
              </div>
              <Button type="submit" disabled={saving || !isDirty} className="gap-2 w-full sm:w-auto">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
