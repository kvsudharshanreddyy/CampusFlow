"use client";

import { motion } from "framer-motion";
import {
  CheckSquare, Calendar, ClipboardList, Briefcase,
  TrendingUp, Bot, Plus, ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const studyData = [
  { day: "Mon", hours: 3 },
  { day: "Tue", hours: 5 },
  { day: "Wed", hours: 2 },
  { day: "Thu", hours: 6 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 7 },
  { day: "Sun", hours: 3 },
];

const recentTasks = [
  { title: "CS101 Assignment 3", subject: "CS101", due: "Tomorrow", status: "pending" },
  { title: "Calculus Problem Set", subject: "MA201", due: "In 3 days", status: "in-progress" },
  { title: "AI Lab Report", subject: "AI301", due: "Next week", status: "completed" },
  { title: "Database Design ER Diagram", subject: "DB201", due: "In 5 days", status: "pending" },
];

const upcomingEvents = [
  { title: "CS101 Mid-sem Exam", date: "Jun 28", type: "exam" },
  { title: "Project Submission", date: "Jun 30", type: "deadline" },
  { title: "Campus Placement Drive", date: "Jul 2", type: "placement" },
];

const statusColors: Record<string, "success" | "warning" | "secondary" | "default"> = {
  completed: "success",
  "in-progress": "warning",
  pending: "secondary",
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-5 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {greeting()}, {user?.email?.split("@")[0] ?? "Student"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s your academic snapshot for today
          </p>
        </div>
        <Link href="/tasks">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New Task
          </Button>
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tasks Due" value="12" change="+3 this week" trend="up" icon={CheckSquare} color="violet" delay={0} />
        <StatCard label="Attendance" value="87%" change="Above threshold" trend="up" icon={ClipboardList} color="green" delay={0.08} />
        <StatCard label="Study Streak" value="14d" change="Personal best!" trend="up" icon={TrendingUp} color="amber" delay={0.16} />
        <StatCard label="Applications" value="5" change="2 in review" trend="neutral" icon={Briefcase} color="blue" delay={0.24} />
      </div>

      {/* Charts + Tasks */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Study hours chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardHeader>
              <CardTitle>Study Hours This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={studyData}>
                  <defs>
                    <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.22 270)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="oklch(0.65 0.22 270)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="oklch(0.65 0.22 270)"
                    strokeWidth={2}
                    fill="url(#studyGrad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming events */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Upcoming</CardTitle>
              <Link href="/calendar">
                <Button variant="ghost" size="icon-sm">
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.title}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                >
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ev.title}</p>
                    <p className="text-xs text-muted-foreground">{ev.date}</p>
                  </div>
                  <Badge variant={ev.type === "exam" ? "destructive" : ev.type === "placement" ? "default" : "warning"} className="shrink-0 text-xs">
                    {ev.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Tasks</CardTitle>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentTasks.map((task, i) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <CheckSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.subject} · Due {task.due}</p>
                  </div>
                  <Badge variant={statusColors[task.status]}>{task.status}</Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Chat CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Study Assistant is ready</p>
              <p className="text-xs text-muted-foreground">Ask anything about your subjects, deadlines, or exam prep</p>
            </div>
          </div>
          <Link href="/ai-chat">
            <Button size="sm" className="shrink-0 gap-1.5">
              Chat now <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
