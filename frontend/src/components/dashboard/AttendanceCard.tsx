"use client";

import { motion } from "framer-motion";
import { ClipboardList, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import type { AttendanceSummary } from "@/types";

interface AttendanceCardProps {
  summary?: AttendanceSummary[];
  avgPercentage?: number;
  isLoading: boolean;
}

export function AttendanceCard({ summary, avgPercentage, isLoading }: AttendanceCardProps) {
  const threshold = 75;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          Attendance
        </CardTitle>
        <Link href="/attendance">
          <Button variant="ghost" size="icon-sm">
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : summary && summary.length > 0 ? (
          <div className="space-y-3">
            {/* Overall badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Overall</span>
              <div className="flex items-center gap-1.5">
                {(avgPercentage ?? 0) >= threshold ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                )}
                <span className={`text-lg font-bold ${(avgPercentage ?? 0) >= threshold ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {avgPercentage ?? 0}%
                </span>
              </div>
            </div>

            {/* Per subject */}
            {summary.slice(0, 4).map((s, i) => (
              <motion.div
                key={s.subject_id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium truncate max-w-[100px]">{s.code}</span>
                  <span className={s.percentage >= threshold ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"}>
                    {s.percentage}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.percentage}%` }}
                    transition={{ delay: i * 0.07 + 0.2, duration: 0.5 }}
                    className={`h-full rounded-full ${s.percentage >= threshold ? "bg-green-500" : "bg-rose-500"}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ClipboardList className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No attendance data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
