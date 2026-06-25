"use client";

import { Menu, Bell, Search } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function Navbar({ title }: { title?: string }) {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleSidebar}
        className="lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Title */}
      <h1 className="text-sm font-semibold text-foreground hidden sm:block">
        {title}
      </h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search (desktop) */}
      <div className="hidden md:block w-56">
        <Input
          placeholder="Search..."
          className="h-8 text-xs bg-muted border-0 focus-visible:ring-1"
          icon={<Search className="h-3.5 w-3.5" />}
        />
      </div>

      {/* Mobile search */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={() => setSearchOpen(!searchOpen)}
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="relative"
        onClick={() => router.push("/notifications")}
      >
        <Bell className="h-4 w-4" />
        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />
      </Button>

      {/* Avatar / logout */}
      <button
        onClick={handleLogout}
        className="rounded-full transition-opacity hover:opacity-80"
        title="Click to logout"
      >
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-xs">
            {user?.email ? getInitials(user.email.split("@")[0]) : "CF"}
          </AvatarFallback>
        </Avatar>
      </button>
    </header>
  );
}
