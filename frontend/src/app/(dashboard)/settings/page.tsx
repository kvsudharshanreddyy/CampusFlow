"use client";

import { motion } from "framer-motion";
import { Bell, Shield, Palette, Link2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const settingSections = [
  {
    title: "Appearance",
    icon: Palette,
    items: [
      {
        label: "Theme",
        description: "Choose between light, dark, or system theme",
        control: <ThemeToggle />,
      },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Task Reminders", description: "Get notified before tasks are due", control: <Toggle defaultChecked /> },
      { label: "Attendance Alerts", description: "Alert when attendance drops below threshold", control: <Toggle defaultChecked /> },
      { label: "WhatsApp Notifications", description: "Receive updates via WhatsApp", control: <Toggle /> },
    ],
  },
  {
    title: "Integrations",
    icon: Link2,
    items: [
      { label: "Google Calendar", description: "Sync your events with Google Calendar", control: <Button variant="outline" size="sm">Connect</Button> },
      { label: "WhatsApp Business", description: "Enable WhatsApp automation", control: <Button variant="outline" size="sm">Connect</Button> },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    items: [
      { label: "Change Password", description: "Update your account password", control: <Button variant="outline" size="sm">Update</Button> },
      { label: "Two-Factor Auth", description: "Add an extra layer of security", control: <Button variant="outline" size="sm">Enable</Button> },
    ],
  },
];

function Toggle({ defaultChecked = false }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
    </label>
  );
}

export default function SettingsPage() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <div className="p-5 lg:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences</p>
      </div>

      {settingSections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <section.icon className="h-4 w-4 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                  {item.control}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="border-destructive/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-destructive">
              <Trash2 className="h-4 w-4" /> Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium">Sign Out</p>
                <p className="text-xs text-muted-foreground">Sign out from your current session</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>Sign Out</Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-destructive">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
