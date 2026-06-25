"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CheckSquare, Calendar, BookOpen, Users,
  Briefcase, Layers, Bot, Settings, User, X, GraduationCap,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Subjects", href: "/subjects", icon: BookOpen },
  { label: "Attendance", href: "/attendance", icon: ClipboardList },
  { label: "Study Groups", href: "/groups", icon: Users },
  { label: "Placement", href: "/placement", icon: Briefcase },
  { label: "Flashcards", href: "/flashcards", icon: Layers },
  { label: "AI Chat", href: "/ai-chat", icon: Bot },
];

const bottomItems = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { user } = useAuthStore();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col",
          "bg-sidebar border-r border-sidebar-border",
          "lg:relative lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-sidebar-foreground">
              CampusFlow
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-sidebar-accent text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-sidebar-accent text-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
                      )}
                    />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom nav */}
        <div className="border-t border-sidebar-border p-2">
          <ul className="space-y-0.5 mb-2">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-sidebar-accent text-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* User pill */}
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 bg-sidebar-accent/50">
            <Avatar className="h-7 w-7">
              <AvatarImage src={undefined} />
              <AvatarFallback className="text-xs">
                {user?.email ? getInitials(user.email.split("@")[0]) : "CF"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-sidebar-foreground">
                {user?.email?.split("@")[0] ?? "Student"}
              </p>
              <p className="truncate text-xs text-muted-foreground capitalize">
                {user?.role ?? "student"}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
