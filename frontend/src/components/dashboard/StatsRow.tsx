"use client";

import { motion } from "framer-motion";
import { CheckSquare, ClipboardList, TrendingUp, Calendar } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@/types";

interface StatsRowProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export function StatsRow({ stats, isLoading }: StatsRowProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    );
  }

  const tasksDue = stats?.tasks.pending ?? 0;
  const inProgress = stats?.tasks["in-progress"] ?? 0;
  const attendance = stats?.attendance.average_percentage ?? 0;
  const todayEvents = stats?.today_events_count ?? 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Tasks Due"
        value={tasksDue}
        change={inProgress > 0 ? `${inProgress} in progress` : "Nothing in progress"}
        trend={tasksDue > 5 ? "up" : "neutral"}
        icon={CheckSquare}
        color="violet"
        delay={0}
      />
      <StatCard
        label="Attendance"
        value={`${attendance}%`}
        change={attendance >= 75 ? "Above threshold" : "⚠️ Below threshold"}
        trend={attendance >= 75 ? "up" : "down"}
        icon={ClipboardList}
        color={attendance >= 75 ? "green" : "rose"}
        delay={0.08}
      />
      <StatCard
        label="Today's Events"
        value={todayEvents}
        change={todayEvents === 0 ? "Free day!" : "Scheduled"}
        trend="neutral"
        icon={Calendar}
        color="amber"
        delay={0.16}
      />
      <StatCard
        label="Completed Tasks"
        value={stats?.tasks.completed ?? 0}
        change={`${stats?.tasks.total ?? 0} total`}
        trend="up"
        icon={TrendingUp}
        color="blue"
        delay={0.24}
      />
    </div>
  );
}
