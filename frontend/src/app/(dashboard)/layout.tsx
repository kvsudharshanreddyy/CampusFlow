"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useUIStore } from "@/store/ui.store";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tasks": "Tasks",
  "/calendar": "Calendar",
  "/subjects": "Subjects",
  "/attendance": "Attendance",
  "/placement": "Placement Tracker",
  "/flashcards": "Flashcards",
  "/ai-chat": "AI Assistant",
  "/profile": "Profile",
  "/settings": "Settings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useUIStore();
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "CampusFlow";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        )}
      >
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
