"use client";

import { motion } from "framer-motion";
import { ClipboardList, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAttendanceSummary } from "@/hooks/useAppData";

function getStatus(pct: number, threshold: number) {
  if (pct >= threshold + 10) return { label: "Safe", variant: "success" as const, icon: CheckCircle, color: "text-green-500" };
  if (pct >= threshold) return { label: "OK", variant: "warning" as const, icon: Clock, color: "text-amber-500" };
  return { label: "At Risk", variant: "destructive" as const, icon: AlertTriangle, color: "text-rose-500" };
}

export default function AttendancePage() {
  const { data: subjects = [], isLoading } = useAttendanceSummary();
  const threshold = 75;

  const atRiskSubjects = subjects.filter((s) => s.percentage < threshold);

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Attendance Manager
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">Track your class attendance and keep grades secure</p>
      </div>

      {/* Attendance Risk Alerter Warning Banner */}
      {atRiskSubjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3.5"
        >
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5 animate-bounce" />
          <div>
            <h3 className="text-xs font-bold text-destructive">Attendance Warning</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              Your attendance in <span className="font-semibold text-foreground">{atRiskSubjects.map((s) => s.code).join(", ")}</span> is currently below the mandatory {threshold}% threshold. Please attend the upcoming sessions to prevent academic registration locks.
            </p>
          </div>
        </motion.div>
      )}

      {/* Cards List */}
      <div className="grid gap-4 sm:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-lg" />
          ))
        ) : subjects.length === 0 ? (
          <div className="sm:col-span-2 text-center py-12">
            <ClipboardList className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-medium">No attendance records registered</p>
          </div>
        ) : (
          subjects.map((s, i) => {
            const pct = Math.round(s.percentage);
            const status = getStatus(pct, threshold);
            const StatusIcon = status.icon;

            // Forecast calculations
            const neededClasses = Math.ceil((threshold / 100 * s.total - s.present) / (1 - threshold / 100));
            const safeSkipClasses = Math.floor((s.present - (threshold / 100 * s.total)) / (threshold / 100));

            return (
              <motion.div
                key={s.subject_id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="hover:shadow-md transition-shadow border-border">
                  <CardHeader className="pb-3 border-b border-border/45">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-xs font-bold truncate">{s.name}</CardTitle>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{s.code}</p>
                      </div>
                      <Badge variant={status.variant} className="gap-1 text-[10px] py-0 px-1.5 font-semibold shrink-0">
                        <StatusIcon className="h-2.5 w-2.5" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-3.5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-foreground">{pct}%</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{s.present} / {s.total} classes</p>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Threshold: {threshold}%</p>
                    </div>

                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.08 + 0.3, duration: 0.6, ease: "easeOut" }}
                        className={`h-full rounded-full ${pct >= threshold ? "bg-green-500" : "bg-rose-500"}`}
                      />
                    </div>

                    {pct < threshold ? (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 leading-normal">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        Attend {neededClasses > 0 ? neededClasses : 1} consecutive classes to reach {threshold}% threshold.
                      </p>
                    ) : (
                      <p className="text-[11px] text-green-600 dark:text-green-400 flex items-center gap-1 leading-normal">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                        You can safely skip {safeSkipClasses > 0 ? safeSkipClasses : 0} future classes.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
