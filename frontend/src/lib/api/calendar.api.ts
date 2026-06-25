import api from "@/lib/axios";
import type { CalendarEvent } from "@/types";

export const calendarApi = {
  getAll: async (from?: string, to?: string): Promise<CalendarEvent[]> => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const { data } = await api.get(`/calendar-events?${params.toString()}`);
    return data.data;
  },

  getToday: async (): Promise<CalendarEvent[]> => {
    const { data } = await api.get("/calendar-events/today");
    return data.data;
  },

  getUpcoming: async (days = 7): Promise<CalendarEvent[]> => {
    const { data } = await api.get(`/calendar-events/upcoming?days=${days}`);
    return data.data;
  },

  create: async (event: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    const { data } = await api.post("/calendar-events", event);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/calendar-events/${id}`);
  },
};
