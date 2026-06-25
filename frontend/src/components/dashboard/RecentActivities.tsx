"use client";

import { motion } from "framer-motion";
import { Activity, CheckSquare, Bell, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Task, Notification, CalendarEvent } from "@/types";

interface ActivityItem {
  id: string;
  type: "task" | "notification" | "event";
  title: string;
  detail?: string;
  time: string;
}

function buildActivities(
  tasks?: Task[],
  notifications?: Notification[],
  events?: CalendarEvent[]
): ActivityItem[] {
  const items: ActivityItem[] = [];

  (tasks ?? []).slice(0, 4).forEach(t => items.push({
    id: `task-${t.id}`,
    type: "task",
    title: t.title,
    detail: `Status: ${t.status}`,
    time: t.updated_at || t.created_at,
  }));

  (notifications ?? []).slice(0, 4).forEach(n => items.push({
    id: `notif-${n.id}`,
    type: "notification",
    title: n.title,
    detail: n.message,
    time: n.created_at,
  }));

  (events ?? []).slice(0, 3).forEach(e => items.push({
    id: `event-${e.id}`,
    type: "event",
    title: e.title,
    detail: e.event_type,
    time: e.created_at,
  }));

  return items
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8);
}

const typeIcon = {
  task: CheckSquare,
  notification: Bell,
  event: Calendar,
};

const typeColor = {
  task: "text-violet-500 bg-violet-500/10",
  notification: "text-blue-500 bg-blue-500/10",
  event: "text-green-500 bg-green-500/10",
};

function formatRelative(iso: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface RecentActivitiesProps {
  tasks?: Task[];
  notifications?: Notification[];
  events?: CalendarEvent[];
  isLoading: boolean;
}

export function RecentActivities({ tasks, notifications, events, isLoading }: RecentActivitiesProps) {
  const activities = buildActivities(tasks, notifications, events);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
              <Skeleton className="h-2.5 w-12" />
            </div>
          ))
        ) : activities.length > 0 ? (
          activities.map((act, i) => {
            const Icon = typeIcon[act.type];
            const colors = typeColor[act.type];
            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${colors}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{act.title}</p>
                  {act.detail && <p className="text-xs text-muted-foreground capitalize truncate">{act.detail}</p>}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{formatRelative(act.time)}</span>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
