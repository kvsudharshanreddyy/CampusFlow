"use client";

import { CheckCircle2, XCircle, Clock, Zap, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { AutomationLog } from "@/types";
import { motion } from "framer-motion";

const statusConfig = {
  success: { icon: CheckCircle2, color: "text-green-500", badge: "success" as const },
  failed: { icon: XCircle, color: "text-rose-500", badge: "destructive" as const },
  pending: { icon: Clock, color: "text-amber-500", badge: "warning" as const },
};

interface AutomationStatusProps {
  logs?: AutomationLog[];
  stats?: Record<string, number>;
  isLoading: boolean;
}

export function AutomationStatus({ logs, stats, isLoading }: AutomationStatusProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Automation Status
          {stats && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">{stats.success ?? 0} ok</span>
              {(stats.failed ?? 0) > 0 && (
                <span className="text-rose-500 font-medium">· {stats.failed} failed</span>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))
        ) : logs && logs.length > 0 ? (
          logs.slice(0, 6).map((log, i) => {
            const conf = statusConfig[log.status] ?? statusConfig.pending;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <conf.icon className={`h-4 w-4 shrink-0 ${conf.color}`} />
                <p className="text-xs flex-1 font-medium truncate">{log.workflow_name}</p>
                <Badge variant={conf.badge} className="text-xs">{log.status}</Badge>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <RefreshCw className="h-7 w-7 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No automation runs yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
