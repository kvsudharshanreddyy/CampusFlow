import api from "@/lib/axios";
import type { AutomationLog } from "@/types";

export const automationApi = {
  getLogs: async (): Promise<{ data: AutomationLog[]; meta: { stats: Record<string, number> } }> => {
    const { data } = await api.get("/automation-logs");
    return { data: data.data, meta: data.meta };
  },
};
