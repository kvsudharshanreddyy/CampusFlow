"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, SortAsc, SortDesc, Plus, ChevronLeft, ChevronRight,
  CheckCircle2, Clock, AlertCircle, Trash2, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useSubjects } from "@/hooks/useAppData";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

const SORT_OPTIONS = [
  { label: "Created", value: "created_at" },
  { label: "Due Date", value: "due_date" },
  { label: "Title", value: "title" },
];

const statusConfig = {
  pending: { icon: Clock, color: "text-amber-500", badge: "warning" as const },
  "in-progress": { icon: AlertCircle, color: "text-blue-500", badge: "default" as const },
  completed: { icon: CheckCircle2, color: "text-green-500", badge: "success" as const },
};

interface CreateTaskForm {
  title: string;
  due_date?: string;
  subject_id?: string;
}

export function TaskManager() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const LIMIT = 8;

  const { data, isLoading, isFetching } = useTasks({ status, search, sortBy, sortDir, page, limit: LIMIT });
  const { data: subjects } = useSubjects();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTaskForm>();

  const tasks = data?.data ?? [];
  const meta = data?.meta;

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
    setPage(1);
  };

  const onSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const onStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const onSubmit = async (form: CreateTaskForm) => {
    await createTask.mutateAsync({ title: form.title, due_date: form.due_date, subject_id: form.subject_id });
    reset();
    setShowCreate(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2">
            Task Manager
            {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
            {meta && <span className="text-xs font-normal text-muted-foreground ml-1">{meta.total} tasks</span>}
          </CardTitle>
          <Button size="sm" className="gap-1.5" onClick={() => setShowCreate(!showCreate)}>
            <Plus className="h-3.5 w-3.5" /> Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Create Task Form */}
        {showCreate && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3"
          >
            <Input
              placeholder="Task title *"
              className="h-8 text-sm"
              {...register("title", { required: true })}
            />
            <div className="flex gap-2">
              <Input type="datetime-local" className="h-8 text-xs flex-1" {...register("due_date")} />
              <select
                className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs flex-1 focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("subject_id")}
              >
                <option value="">No subject</option>
                {(subjects ?? []).map((s: any) => (
                  <option key={s.id} value={s.id}>{s.code}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={createTask.isPending} className="flex-1 gap-1">
                {createTask.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Create
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </motion.form>
        )}

        {/* Toolbar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search tasks..."
              className="h-8 w-full rounded-lg border border-border bg-muted pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 shrink-0">
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onStatusChange(opt.value)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                  status === opt.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 shrink-0">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => toggleSort(opt.value)}
                className={cn(
                  "px-2 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1",
                  sortBy === opt.value ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {opt.label}
                {sortBy === opt.value && (
                  sortDir === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Task table */}
        <div className="space-y-1.5">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            ))
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No tasks found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {search ? "Try a different search term" : "Create a task to get started"}
              </p>
            </div>
          ) : (
            tasks.map((task, i) => {
              const conf = statusConfig[task.status];
              const StatusIcon = conf.icon;
              const dueDate = task.due_date ? new Date(task.due_date) : null;
              const isOverdue = dueDate && dueDate < new Date() && task.status !== "completed";

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/20 hover:bg-accent/30 transition-all group"
                >
                  <StatusIcon className={cn("h-4 w-4 shrink-0", conf.color)} />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", task.status === "completed" && "line-through text-muted-foreground")}>
                      {task.title}
                    </p>
                    {(task as any).subjects && (
                      <span className="text-xs text-muted-foreground">{(task as any).subjects.code}</span>
                    )}
                  </div>
                  {dueDate && (
                    <span className={cn("text-xs shrink-0", isOverdue ? "text-rose-500" : "text-muted-foreground")}>
                      {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {isOverdue && " (overdue)"}
                    </span>
                  )}
                  <Badge variant={conf.badge} className="text-xs shrink-0 capitalize hidden sm:inline-flex">
                    {task.status}
                  </Badge>

                  {/* Status cycle button */}
                  <select
                    value={task.status}
                    onChange={e => updateTask.mutate({ id: task.id, updates: { status: e.target.value as Task["status"] } })}
                    className="text-xs bg-transparent border border-border rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    onClick={() => deleteTask.mutate(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Page {meta.page} of {meta.totalPages} · {meta.total} tasks
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={meta.page <= 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "h-7 w-7 rounded text-xs font-medium transition-all",
                      meta.page === pageNum ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={meta.page >= meta.totalPages}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
