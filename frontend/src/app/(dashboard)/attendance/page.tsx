"use client";

import { motion } from "framer-motion";
import { ClipboardList, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const subjects = [
  { name: "Introduction to CS", code: "CS101", present: 38, total: 42, threshold: 75 },
  { name: "Advanced Calculus", code: "MA201", present: 28, total: 36, threshold: 75 },
  { name: "AI & Machine Learning", code: "AI301", present: 22, total: 24, threshold: 75 },
  { name: "Database Systems", code: "DB201", present: 14, total: 20, threshold: 75 },
];

function getStatus(pct: number, threshold: number) {
  if (pct >= threshold + 10) return { label: "Safe", variant: "success" as const, icon: CheckCircle, color: "text-green-500" };
  if (pct >= threshold) return { label: "OK", variant: "warning" as const, icon: Clock, color: "text-amber-500" };
  return { label: "At Risk", variant: "destructive" as const, icon: AlertTriangle, color: "text-rose-500" };
}

export default function AttendancePage() {
  return (
    <div className="p-5 lg:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">Attendance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track attendance across all subjects</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {subjects.map((s, i) => {
          const pct = Math.round((s.present / s.total) * 100);
          const status = getStatus(pct, s.threshold);
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={s.code}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm">{s.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.code}</p>
                    </div>
                    <Badge variant={status.variant} className="gap-1">
                      <StatusIcon className="h-2.5 w-2.5" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold">{pct}%</p>
                      <p className="text-xs text-muted-foreground">{s.present}/{s.total} classes</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Min. {s.threshold}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.08 + 0.3, duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full ${pct >= s.threshold ? "bg-green-500" : "bg-rose-500"}`}
                    />
                  </div>
                  {pct < s.threshold && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Attend {Math.ceil((s.threshold / 100 * s.total - s.present) / (1 - s.threshold / 100))} more classes to reach {s.threshold}%
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
