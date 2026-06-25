"use client";

import { motion } from "framer-motion";
import { CheckSquare, Clock, ArrowRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import type { Task } from "@/types";
import { useUpdateTask } from "@/hooks/useTasks";

function getDueBadge(dueDate?: string): { label: string; variant: "destructive" | "warning" | "secondary" } {
  if (!dueDate) return { label: "No deadline", variant: "secondary" };
  const diff = new Date(dueDate).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "Overdue!", variant: "destructive" };
  if (days === 0) return { label: "Due today", variant: "destructive" };
  if (days === 1) return { label: "Due tomorrow", variant: "warning" };
  if (days <= 3) return { label: `Due in ${days}d`, variant: "warning" };
  return { label: `Due in ${days}d`, variant: "secondary" };
}

interface UpcomingDeadlinesProps {
  tasks?: Task[];
  isLoading: boolean;
}

export function UpcomingDeadlines({ tasks, isLoading }: UpcomingDeadlinesProps) {
  const updateTask = useUpdateTask();

  const handleComplete = (id: string) => {
    updateTask.mutate({ id, updates: { status: "completed" } });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Upcoming Deadlines
        </CardTitle>
        <Link href="/tasks">
          <Button variant="ghost" size="icon-sm">
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))
        ) : tasks && tasks.length > 0 ? (
          tasks.map((task, i) => {
            const due = getDueBadge(task.due_date);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <button
                  onClick={() => handleComplete(task.id)}
                  className="h-5 w-5 rounded border-2 border-border hover:border-primary hover:bg-primary/10 transition-colors shrink-0 flex items-center justify-center"
                  title="Mark complete"
                >
                  {updateTask.isPending ? (
                    <div className="h-2.5 w-2.5 rounded-sm bg-muted" />
                  ) : null}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  {(task as any).subjects && (
                    <p className="text-xs text-muted-foreground">{(task as any).subjects.code}</p>
                  )}
                </div>
                <Badge variant={due.variant} className="text-xs shrink-0">{due.label}</Badge>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckSquare className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">All caught up!</p>
            <p className="text-xs text-muted-foreground/60">No upcoming deadlines</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
