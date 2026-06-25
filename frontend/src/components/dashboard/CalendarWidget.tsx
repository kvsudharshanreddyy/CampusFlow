"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CalendarEvent } from "@/types";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const typeColor: Record<string, string> = {
  exam: "bg-rose-500",
  deadline: "bg-amber-500",
  placement: "bg-blue-500",
  class: "bg-green-500",
  general: "bg-muted-foreground",
};

interface CalendarWidgetProps {
  events?: CalendarEvent[];
  isLoading: boolean;
}

export function CalendarWidget({ events, isLoading }: CalendarWidgetProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const getEventsForDay = (day: number) => {
    if (!events) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.start_time?.startsWith(dateStr));
  };

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{MONTHS[month]} {year}</CardTitle>
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon-sm" onClick={prev}><ChevronLeft className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon-sm" onClick={next}><ChevronRight className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-lg" />
        ) : (
          <>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {DAYS.map((d, i) => (
                <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDay }, (_, i) => <div key={`b${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                return (
                  <div
                    key={day}
                    className={`relative flex flex-col items-center rounded-md p-1 text-xs transition-colors cursor-pointer hover:bg-accent/50 ${isToday ? "bg-primary/10 font-bold text-primary" : ""}`}
                  >
                    <span>{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayEvents.slice(0, 2).map((ev, j) => (
                          <div key={j} className={`h-1 w-1 rounded-full ${typeColor[ev.event_type] ?? "bg-muted-foreground"}`} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
