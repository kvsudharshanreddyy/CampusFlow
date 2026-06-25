"use client";
import { useQuery } from "@tanstack/react-query";
import { attendanceApi } from "@/lib/api/attendance.api";
import { calendarApi } from "@/lib/api/calendar.api";
import { automationApi } from "@/lib/api/automation.api";
import { subjectsApi } from "@/lib/api/subjects.api";

export function useAttendanceSummary() {
  return useQuery({
    queryKey: ["attendance", "summary"],
    queryFn: attendanceApi.getSummary,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTodayEvents() {
  return useQuery({
    queryKey: ["calendar", "today"],
    queryFn: calendarApi.getToday,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpcomingEvents(days = 7) {
  return useQuery({
    queryKey: ["calendar", "upcoming", days],
    queryFn: () => calendarApi.getUpcoming(days),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCalendarEvents(from?: string, to?: string) {
  return useQuery({
    queryKey: ["calendar", "events", from, to],
    queryFn: () => calendarApi.getAll(from, to),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAutomationLogs() {
  return useQuery({
    queryKey: ["automation", "logs"],
    queryFn: automationApi.getLogs,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: subjectsApi.getAll,
    staleTime: 10 * 60 * 1000,
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CalendarEvent } from "@/types";

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: Partial<CalendarEvent>) => calendarApi.create(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Event added to calendar!");
    },
    onError: () => toast.error("Failed to add event"),
  });
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => calendarApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Event deleted from calendar");
    },
    onError: () => toast.error("Failed to delete event"),
  });
}
