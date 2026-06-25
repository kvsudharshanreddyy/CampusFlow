"use client";

import { Bell, CheckCheck, BellOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";
import { useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { motion } from "framer-motion";

const typeColors: Record<string, string> = {
  system: "bg-blue-500",
  attendance: "bg-amber-500",
  task: "bg-violet-500",
  ai: "bg-green-500",
  placement: "bg-cyan-500",
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

interface NotificationsPanelProps {
  notifications?: Notification[];
  unreadCount?: number;
  isLoading: boolean;
}

export function NotificationsPanel({ notifications, unreadCount, isLoading }: NotificationsPanelProps) {
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Notifications
          {(unreadCount ?? 0) > 0 && (
            <Badge variant="destructive" className="text-xs">{unreadCount}</Badge>
          )}
        </CardTitle>
        {(unreadCount ?? 0) > 0 && (
          <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => markAllRead.mutate()}>
            <CheckCheck className="h-3 w-3" /> Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-1 max-h-72 overflow-y-auto pr-1">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-2">
              <Skeleton className="h-2 w-2 rounded-full mt-2 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))
        ) : notifications && notifications.length > 0 ? (
          notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => !n.is_read && markRead.mutate(n.id)}
              className={cn(
                "flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors",
                n.is_read ? "opacity-60" : "hover:bg-accent/50"
              )}
            >
              <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${typeColors[n.type] ?? "bg-muted-foreground"} ${n.is_read ? "opacity-40" : ""}`} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-xs font-medium", !n.is_read && "text-foreground")}>{n.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{formatRelative(n.created_at)}</p>
              </div>
              {!n.is_read && (
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              )}
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BellOff className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">All caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
