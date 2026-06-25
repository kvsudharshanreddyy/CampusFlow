"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  Briefcase,
  Layers,
  Bot,
  AlertTriangle,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalendarEvents, useCreateCalendarEvent, useDeleteCalendarEvent } from "@/hooks/useAppData";
import { useForm } from "react-hook-form";
import type { CalendarEvent } from "@/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const typeColor: Record<string, string> = {
  exam: "bg-rose-500",
  deadline: "bg-amber-500",
  placement: "bg-blue-500",
  class: "bg-green-500",
  general: "bg-muted-foreground",
};

interface CreateEventForm {
  title: string;
  description?: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  event_type: string;
}

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[] | null>(null);

  const startOfMonth = new Date(year, month, 1).toISOString();
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  // Fetch real events from database
  const { data: events = [], isLoading } = useCalendarEvents(startOfMonth, endOfMonth);
  const createEvent = useCreateCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();

  const { register, handleSubmit, reset } = useForm<CreateEventForm>();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.start_time.startsWith(formattedDate));
  };

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const onSubmit = async (form: CreateEventForm) => {
    const startTimeISO = new Date(`${form.start_date}T${form.start_time}`).toISOString();
    const endTimeISO = new Date(`${form.end_date}T${form.end_time}`).toISOString();

    await createEvent.mutateAsync({
      title: form.title,
      description: form.description || "",
      start_time: startTimeISO,
      end_time: endTimeISO,
      event_type: form.event_type,
    });

    reset();
    setShowAdd(false);
  };

  const handleDelete = async (id: string) => {
    await deleteEvent.mutateAsync(id);
    if (selectedDayEvents) {
      setSelectedDayEvents((prevEvents) => prevEvents?.filter((e) => e.id !== id) || null);
    }
  };

  const handleDayClick = (day: number) => {
    const dayEvents = getEventsForDay(day);
    setSelectedDayEvents(dayEvents);
  };

  // 4 upcoming events from now
  const upcomingEvents = events
    .filter((e) => new Date(e.start_time) >= new Date())
    .slice(0, 5)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <CalIcon className="h-5 w-5 text-primary" />
            Calendar
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Your dynamic schedules and events hub</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowAdd(true)}>
          <Plus className="h-3.5 w-3.5" /> Add Event
        </Button>
      </div>

      {/* Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Core */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
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
            <CardContent className="pt-3">
              {isLoading ? (
                <div className="space-y-4 py-8">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-48 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {DAYS.map((d) => (
                      <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
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
                          whileHover={{ scale: 1.03 }}
                          onClick={() => handleDayClick(day)}
                          className={`relative rounded-lg p-1.5 min-h-[64px] cursor-pointer border transition-colors flex flex-col justify-between ${
                            isToday
                              ? "bg-primary/5 border-primary/40"
                              : "border-transparent hover:bg-accent/40 hover:border-border"
                          }`}
                        >
                          <span className={`text-xs font-semibold ${isToday ? "text-primary font-bold" : "text-foreground"}`}>
                            {day}
                          </span>
                          <div className="mt-1 space-y-0.5 max-h-8 overflow-hidden">
                            {dayEvents.slice(0, 3).map((ev) => (
                              <div
                                key={ev.id}
                                className={`h-1.5 rounded-full w-full ${typeColor[ev.event_type] || typeColor.general}`}
                                title={ev.title}
                              />
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-6 pt-3 border-t border-border flex-wrap text-[11px]">
                    {Object.entries(typeColor).map(([type, color]) => (
                      <div key={type} className="flex items-center gap-1.5">
                        <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                        <span className="text-muted-foreground capitalize">{type}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right side: Day Events Detail + Upcoming list */}
        <div className="space-y-6">
          {/* Day details */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Day Schedule</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 max-h-60 overflow-y-auto">
              {selectedDayEvents ? (
                selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map((ev) => (
                    <div key={ev.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted border border-border group">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate">{ev.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(ev.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(ev.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(ev.id)}
                        className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-6 text-center">No events for this day</p>
                )
              ) : (
                <p className="text-xs text-muted-foreground py-6 text-center">Select a day to inspect schedule</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Upcoming Agenda</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-border hover:bg-accent/30 transition-all">
                    <div className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${typeColor[ev.event_type] || typeColor.general}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{ev.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(ev.start_time).toLocaleDateString([], { month: "short", day: "numeric" })} · {new Date(ev.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1 capitalize shrink-0">
                      {ev.event_type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-8 text-center">No upcoming events</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border border-border rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-bold text-sm">Add Calendar Event</h3>
                <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Title *</span>
                  <Input placeholder="Event title" {...register("title", { required: true })} />
                </div>

                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Description</span>
                  <Input placeholder="Brief description" {...register("description")} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Start Date</span>
                    <Input type="date" {...register("start_date", { required: true })} />
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Start Time</span>
                    <Input type="time" {...register("start_time", { required: true })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">End Date</span>
                    <Input type="date" {...register("end_date", { required: true })} />
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">End Time</span>
                    <Input type="time" {...register("end_time", { required: true })} />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Event Type</span>
                  <select
                    className="w-full h-9 rounded-lg border border-input bg-transparent px-3 focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register("event_type", { required: true })}
                  >
                    <option value="general">General</option>
                    <option value="class">Class</option>
                    <option value="exam">Exam</option>
                    <option value="deadline">Deadline</option>
                    <option value="placement">Placement</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={createEvent.isPending}>
                    Create Event
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
                    Cancel
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
