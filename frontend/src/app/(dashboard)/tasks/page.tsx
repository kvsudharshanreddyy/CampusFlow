"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckSquare, Clock, CheckCircle2, Filter, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useForm } from "react-hook-form";
import type { Task } from "@/types";

const filters = ["all", "pending", "in-progress", "completed"] as const;
type Filter = typeof filters[number];

const statusIcon = {
  pending: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
  "in-progress": <CheckSquare className="h-3.5 w-3.5 text-amber-500" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />,
};

const statusBadge: Record<Task["status"], "secondary" | "warning" | "success"> = {
  pending: "secondary",
  "in-progress": "warning",
  completed: "success",
};

interface CreateTaskForm {
  title: string;
  description: string;
  due_date: string;
}

export default function TasksPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const { data: tasksResponse, isLoading } = useTasks();
  const tasks = tasksResponse?.data || [];
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const { register, handleSubmit, reset } = useForm<CreateTaskForm>();

  const filtered = tasks.filter((t) => {
    const matchStatus = filter === "all" || t.status === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const onSubmit = async (form: CreateTaskForm) => {
    await createTask.mutateAsync({
      title: form.title,
      description: form.description,
      due_date: new Date(form.due_date).toISOString(),
    });
    reset();
    setShowAdd(false);
  };

  return (
    <div className="p-5 lg:p-6 space-y-5 max-w-4xl mx-auto relative">
      {/* Background Gradient Orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-violet-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{counts.pending} pending · {counts["in-progress"]} in progress</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-1.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-105 border-0">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center backdrop-blur-md bg-background/40 p-2 rounded-xl border border-border/50">
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 capitalize ${
                filter === f
                  ? "bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-foreground shadow-sm border border-violet-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {f} <span className="ml-1 text-muted-foreground/70 bg-background/50 px-1.5 rounded-full">{counts[f]}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 sm:max-w-xs ml-auto">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 text-sm bg-muted/30 border-border/50 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl bg-muted/40 backdrop-blur-sm" />
          ))
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground backdrop-blur-md bg-background/30 rounded-2xl border border-border/30">
            <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-30 text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
            <p className="text-base font-medium">No tasks found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Add a new task to get started.</p>
          </div>
        ) : (
          filtered.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
            >
              <Card className="hover:border-violet-500/50 transition-all duration-300 cursor-pointer group bg-background/40 backdrop-blur-xl border-border/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] hover:-translate-y-1">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-lg bg-background/50 border border-border/50 group-hover:border-violet-500/30 transition-colors">
                    {statusIcon[task.status]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-bold ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground group-hover:text-violet-100 transition-colors"}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <select
                          value={task.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateTask.mutate({ id: task.id, updates: { status: e.target.value as any } })}
                          className="text-xs bg-background/50 border border-border/50 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500/50 backdrop-blur-sm cursor-pointer hover:border-violet-500/30 transition-colors"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); deleteTask.mutate(task.id); }}
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/20 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      {task.due_date && (
                        <Badge variant="outline" className="text-[10px] bg-background/50 backdrop-blur-sm border-border/50 text-muted-foreground py-0">
                          Due {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAdd(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-background/80 backdrop-blur-2xl border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-[0_0_50px_rgba(139,92,246,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 rounded-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
                <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">Create New Task</h3>
                <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-white/5 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title *</label>
                  <Input 
                    placeholder="e.g. Database Assignment" 
                    className="bg-black/20 border-white/10 focus-visible:ring-violet-500/50"
                    {...register("title", { required: true })} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
                  <Input 
                    placeholder="Details about the task..." 
                    className="bg-black/20 border-white/10 focus-visible:ring-violet-500/50"
                    {...register("description")} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due Date *</label>
                  <Input 
                    type="datetime-local" 
                    className="bg-black/20 border-white/10 focus-visible:ring-violet-500/50 [color-scheme:dark]"
                    {...register("due_date", { required: true })} 
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 hover:scale-[1.02] border-0"
                    disabled={createTask.isPending}
                  >
                    {createTask.isPending ? "Creating..." : "Save Task"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
