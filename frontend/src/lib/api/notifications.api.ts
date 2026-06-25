import api from "@/lib/axios";
import type { Notification } from "@/types";

export interface NotificationsResponse {
  data: Notification[];
  meta: { unread_count: number };
}

export const notificationsApi = {
  getAll: async (unreadOnly = false): Promise<NotificationsResponse> => {
    const { data } = await api.get(`/notifications?unread_only=${unreadOnly}`);
    return { data: data.data, meta: data.meta };
  },

  markRead: async (id: string): Promise<Notification> => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data.data;
  },

  markAllRead: async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  },
};
