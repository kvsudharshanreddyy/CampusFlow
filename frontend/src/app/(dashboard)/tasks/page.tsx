"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CheckSquare, Clock, CheckCircle2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Task } from "@/types";

const mockTasks: Task[] = [
  { id: "1", user_id: "u1", title: "CS101 Assignment 3 — Data Structures", subject_id: "CS101", description: "Implement a binary search tree with insert, delete, and traversal operations.", status: "pending", due_date: "2026-06-28T18:00:00Z", created_at: "", updated_at: "" },
  { id: "2", user_id: "u1", title: "Calculus Problem Set — Chapter 7", subject_id: "MA201", description: "Complete exercises 7.1 through 7.15.", status: "in-progress", due_date: "2026-06-29T18:00:00Z", created_at: "", updated_at: "" },
  { id: "3", user_id: "u1", title: "AI Lab Report — Neural Networks", subject_id: "AI301", description: "Write a 1500-word report on backpropagation.", status: "completed", due_date: "2026-06-25T18:00:00Z", created_at: "", updated_at: "" },
  { id: "4", user_id: "u1", title: "Database ER Diagram", subject_id: "DB201", description: "Design ER diagram for the library management system.", status: "pending", due_date: "2026-07-01T18:00:00Z", created_at: "", updated_at: "" },
  { id: "5", user_id: "u1", title: "Resume Update — Summer Internship", subject_id: undefined, description: "Add recent project and update skills section.", status: "in-progress", due_date: "2026-06-27T18:00:00Z", created_at: "", updated_at: "" },
];

const filters = ["all", "pending", "in-progress", "completed"] as const;
type Filter = typeof filters[number];

const statusIcon = {
  pending: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
  "in-progress": <CheckSquare className="h-3.5 w-3.5 text-amber-500" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
};

const statusBadge: Record<Task["status"], "secondary" | "warning" | "success"> = {
  pending: "secondary",
  "in-progress": "warning",
  completed: "success",
};

export default function TasksPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = mockTasks.filter((t) => {
    const matchStatus = filter === "all" || t.status === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: mockTasks.length,
    pending: mockTasks.filter((t) => t.status === "pending").length,
    "in-progress": mockTasks.filter((t) => t.status === "in-progress").length,
    completed: mockTasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="p-5 lg:p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{counts.pending} pending · {counts["in-progress"]} in progress</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Task
        </Button>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 capitalize ${
                filter === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f} <span className="ml-1 text-muted-foreground/70">{counts[f]}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 sm:max-w-xs">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-xs bg-muted border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <CheckSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tasks found</p>
          </div>
        ) : (
          filtered.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:border-primary/30 transition-colors cursor-pointer group">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="mt-0.5">{statusIcon[task.status]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {task.title}
                      </p>
                      <Badge variant={statusBadge[task.status]} className="shrink-0 text-xs capitalize">
                        {task.status}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {task.subject_id && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{task.subject_id}</span>
                      )}
                      {task.due_date && (
                        <span className="text-xs text-muted-foreground">
                          Due {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
