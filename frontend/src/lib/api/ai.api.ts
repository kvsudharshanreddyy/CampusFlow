import api from "@/lib/axios";
import type { AiHistory } from "@/types";

export const aiApi = {
  getHistory: async (limit = 20): Promise<AiHistory[]> => {
    const { data } = await api.get(`/ai/history?limit=${limit}`);
    return data.data;
  },
  saveHistory: async (prompt: string, response: string, context?: any): Promise<AiHistory> => {
    const { data } = await api.post("/ai/history", { prompt, response, context });
    return data.data;
  },
};
