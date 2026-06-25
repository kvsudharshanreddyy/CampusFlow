"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, BookOpen, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { CalendarEvent } from "@/types";

const eventTypeConfig: Record<string, { color: string; badge: "default" | "destructive" | "warning" | "success" | "secondary" }> = {
  exam: { color: "text-rose-500", badge: "destructive" },
  class: { color: "text-green-500", badge: "success" },
  deadline: { color: "text-amber-500", badge: "warning" },
  placement: { color: "text-blue-500", badge: "default" },
  general: { color: "text-muted-foreground", badge: "secondary" },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

interface TodayScheduleProps {
  events?: CalendarEvent[];
  isLoading: boolean;
}

export function TodaySchedule({ events, isLoading }: TodayScheduleProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Today&apos;s Schedule
          {events && events.length > 0 && (
            <Badge className="ml-auto text-xs">{events.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-1 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : events && events.length > 0 ? (
          events.map((event, i) => {
            const config = eventTypeConfig[event.event_type] ?? eventTypeConfig.general;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className={`w-1 h-full min-h-[36px] rounded-full bg-current ${config.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" />
                    {formatTime(event.start_time)} – {formatTime(event.end_time)}
                  </p>
                </div>
                <Badge variant={config.badge} className="text-xs capitalize shrink-0">
                  {event.event_type}
                </Badge>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No events today</p>
            <p className="text-xs text-muted-foreground/60">Enjoy your free day!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
