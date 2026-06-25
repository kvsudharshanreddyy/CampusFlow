"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  BellOff,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Sparkles,
  Info,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";

const typeMeta: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  system: { label: "System", bg: "bg-blue-500/10", text: "text-blue-500", icon: Info },
  attendance: { label: "Attendance", bg: "bg-amber-500/10", text: "text-amber-500", icon: Clock },
  task: { label: "Task", bg: "bg-violet-500/10", text: "text-violet-500", icon: CheckCircle2 },
  ai: { label: "AI Tip", bg: "bg-green-500/10", text: "text-green-500", icon: Sparkles },
  placement: { label: "Placement", bg: "bg-cyan-500/10", text: "text-cyan-500", icon: Briefcase },
};

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const { data: response, isLoading } = useNotifications(false);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const notifications = response?.data || [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = notifications.filter((n) => {
    const matchesTab = activeTab === "all" || !n.is_read;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || n.type === selectedType;
    return matchesTab && matchesSearch && matchesType;
  });

  return (
    <main className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Stay updated with school schedules, study groups, placement alerts, and AI insights
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 self-start sm:self-auto text-xs"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-2 border-b border-border pb-1 md:border-b-0 md:pb-0">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-xs px-3 h-8 rounded-none border-b-2 font-medium transition-all",
              activeTab === "all"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab("all")}
          >
            All Notifications
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-xs px-3 h-8 rounded-none border-b-2 font-medium transition-all gap-1.5",
              activeTab === "unread"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTab("unread")}
          >
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-4 px-1 text-[9px] min-w-[16px] flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px] md:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-muted/50 border-border"
            />
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <Button
              variant={selectedType === null ? "secondary" : "outline"}
              size="sm"
              className="h-8 text-[11px] px-2.5 rounded-full shrink-0"
              onClick={() => setSelectedType(null)}
            >
              All Types
            </Button>
            {Object.entries(typeMeta).map(([type, meta]) => {
              const count = notifications.filter((n) => n.type === type && !n.is_read).length;
              return (
                <Button
                  key={type}
                  variant={selectedType === type ? "secondary" : "outline"}
                  size="sm"
                  className="h-8 text-[11px] px-2.5 rounded-full gap-1.5 shrink-0"
                  onClick={() => setSelectedType(type)}
                >
                  <meta.icon className={cn("h-3 w-3", meta.text)} />
                  <span>{meta.label}</span>
                  {count > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-border">
              <CardContent className="p-4 flex gap-4">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-2 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl bg-card">
            <BellOff className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-semibold text-xs text-foreground">No notifications found</h3>
            <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1">
              {searchQuery || selectedType
                ? "No notifications match your current search queries or type filters."
                : "You are all caught up! Academic schedules, messages, and AI updates will appear here."}
            </p>
            {(searchQuery || selectedType) && (
              <Button
                variant="link"
                size="sm"
                className="text-xs text-primary mt-2"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType(null);
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {filteredNotifications.map((n, i) => {
                const meta = typeMeta[n.type] || {
                  label: "Update",
                  bg: "bg-muted",
                  text: "text-muted-foreground",
                  icon: Bell,
                };
                const Icon = meta.icon;

                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.15, delay: Math.min(i * 0.03, 0.35) }}
                  >
                    <Card
                      className={cn(
                        "transition-all duration-200 border-border group hover:border-border-accent relative overflow-hidden",
                        !n.is_read ? "bg-accent/15 border-l-2 border-l-primary" : "bg-card/75"
                      )}
                    >
                      <CardContent className="p-4 flex gap-3.5 items-start justify-between">
                        <div className="flex gap-3.5 items-start min-w-0">
                          {/* Type Icon Badge */}
                          <div className={cn("p-2 rounded-lg shrink-0", meta.bg)}>
                            <Icon className={cn("h-4 w-4", meta.text)} />
                          </div>

                          {/* Info */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <h4 className={cn("text-xs font-semibold leading-none", !n.is_read ? "text-foreground" : "text-muted-foreground")}>
                                {n.title}
                              </h4>
                              {!n.is_read && (
                                <Badge className="text-[8px] h-3.5 px-1 font-mono uppercase bg-primary text-primary-foreground tracking-wider shrink-0">
                                  NEW
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {n.message}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 pt-0.5 font-mono">
                              <span>{meta.label}</span>
                              <span>•</span>
                              <span>{formatRelative(n.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="shrink-0 flex items-center ml-2">
                          {!n.is_read ? (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Mark as read"
                              className="text-muted-foreground hover:text-foreground hover:bg-accent h-7 w-7 rounded-full"
                              onClick={() => markRead.mutate(n.id)}
                              disabled={markRead.isPending}
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                            </Button>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/40 font-mono select-none px-2">Read</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
