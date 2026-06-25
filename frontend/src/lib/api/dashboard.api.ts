import api from "@/lib/axios";
import type { DashboardStats } from "@/types";

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get("/dashboard/stats");
    return data.data;
  },
};
