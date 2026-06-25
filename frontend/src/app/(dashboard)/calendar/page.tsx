"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const events = [
  { date: "2026-06-28", title: "CS101 Mid-sem Exam", type: "exam" },
  { date: "2026-06-30", title: "Project Submission Deadline", type: "deadline" },
  { date: "2026-07-02", title: "Campus Placement Drive", type: "placement" },
  { date: "2026-06-25", title: "AI Lab", type: "class" },
  { date: "2026-06-26", title: "Calculus Tutorial", type: "class" },
];

const typeColor: Record<string, string> = {
  exam: "bg-rose-500",
  deadline: "bg-amber-500",
  placement: "bg-blue-500",
  class: "bg-green-500",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const prev = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).slice(0, 4);

  return (
    <div className="p-5 lg:p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your schedule at a glance</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Event
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">
                  {MONTHS[month]} {year}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={prev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={next}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {blanks.map((b) => <div key={`b${b}`} />)}
                {days.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                  return (
                    <motion.div
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      className={`relative rounded-lg p-1.5 min-h-[52px] cursor-pointer transition-colors ${
                        isToday ? "bg-primary/10 border border-primary/30" : "hover:bg-accent/50"
                      }`}
                    >
                      <span className={`text-xs font-medium ${isToday ? "text-primary font-bold" : "text-foreground"}`}>
                        {day}
                      </span>
                      <div className="mt-0.5 space-y-0.5">
                        {dayEvents.slice(0, 2).map((ev) => (
                          <div
                            key={ev.title}
                            className={`${typeColor[ev.type]} h-1 rounded-full w-full`}
                            title={ev.title}
                          />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border flex-wrap">
                {Object.entries(typeColor).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${color}`} />
                    <span className="text-xs text-muted-foreground capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {upcomingEvents.map((ev) => (
                <div key={ev.title} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${typeColor[ev.type]}`} />
                  <div>
                    <p className="text-xs font-medium">{ev.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs capitalize">{ev.type}</Badge>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">No upcoming events</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
