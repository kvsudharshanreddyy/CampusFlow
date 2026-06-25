"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { AttendanceCard } from "@/components/dashboard/AttendanceCard";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { AutomationStatus } from "@/components/dashboard/AutomationStatus";
import { AITip } from "@/components/dashboard/AITip";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { TaskManager } from "@/components/dashboard/TaskManager";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const StudyChart = dynamic(
  () => import("@/components/dashboard/StudyChart").then((mod) => mod.StudyChart),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />,
    ssr: false,
  }
);

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useTodayEvents, useAttendanceSummary, useAutomationLogs } from "@/hooks/useAppData";
import { useUpcomingTasks } from "@/hooks/useTasks";
import { useNotifications } from "@/hooks/useNotifications";
import { useAIHistory } from "@/hooks/useAIHistory";

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Queries
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: todayEvents, isLoading: todayEventsLoading } = useTodayEvents();
  const { data: upcomingTasks, isLoading: upcomingTasksLoading } = useUpcomingTasks();
  const { data: attendanceSummary, isLoading: attendanceLoading } = useAttendanceSummary();
  const { data: notifications, isLoading: notificationsLoading } = useNotifications(false);
  const { data: automationLogs, isLoading: automationLoading } = useAutomationLogs();
  const { data: aiHistory, isLoading: aiLoading } = useAIHistory(10);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const username = user?.email?.split("@")[0] ?? "Student";

  // Calculate average attendance
  const avgAttendance = stats?.attendance?.average_percentage ?? 0;

  // Grab latest AI response for a tip if available
  const latestAiResponse = aiHistory && aiHistory.length > 0 ? aiHistory[0].response : undefined;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {greeting()}, {username} 👋
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Here is your dynamic CampusFlow dashboard snapshot.
          </p>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <StatsRow stats={stats} isLoading={statsLoading} />

      {/* Quick Access Actions */}
      <QuickActions />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column (col-span-3) - Main analysis/work content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Study hours / AI Chat Activity Chart */}
          <StudyChart
            aiHistory={aiHistory}
            tasks={stats?.upcoming_tasks}
            isLoading={aiLoading || statsLoading}
          />

          {/* Full Task Manager */}
          <TaskManager />
        </div>

        {/* Right column (col-span-2) - Schedule / Side panel metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <TodaySchedule events={todayEvents} isLoading={todayEventsLoading} />

          {/* Upcoming Deadlines */}
          <UpcomingDeadlines tasks={upcomingTasks} isLoading={upcomingTasksLoading} />

          {/* Attendance Breakdown */}
          <AttendanceCard
            summary={attendanceSummary}
            avgPercentage={avgAttendance}
            isLoading={attendanceLoading || statsLoading}
          />

          {/* Notifications Panel */}
          <NotificationsPanel
            notifications={notifications?.data}
            unreadCount={stats?.unread_notifications}
            isLoading={notificationsLoading || statsLoading}
          />

          {/* Automation Logs */}
          <AutomationStatus
            logs={automationLogs?.data}
            stats={automationLogs?.meta?.stats}
            isLoading={automationLoading}
          />

          {/* AI Advisor Prompt */}
          <AITip latestPrompt={latestAiResponse} />
        </div>
      </div>

      {/* Activity Logs Feed */}
      <RecentActivities
        tasks={upcomingTasks}
        notifications={notifications?.data}
        events={todayEvents}
        isLoading={upcomingTasksLoading || notificationsLoading || todayEventsLoading}
      />
    </div>
  );
}
