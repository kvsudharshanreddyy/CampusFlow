import api from "@/lib/axios";
import type { PlacementEntry, Company } from "@/types";

export const placementApi = {
  getApplications: async (): Promise<PlacementEntry[]> => {
    const { data } = await api.get("/placement");
    return data.data;
  },
  getCompanies: async (): Promise<Company[]> => {
    const { data } = await api.get("/placement/companies");
    return data.data;
  },
  createApplication: async (payload: Partial<PlacementEntry>): Promise<PlacementEntry> => {
    const { data } = await api.post("/placement", payload);
    return data.data;
  },
  updateApplication: async (id: string, updates: Partial<PlacementEntry>): Promise<PlacementEntry> => {
    const { data } = await api.patch(`/placement/${id}`, updates);
    return data.data;
  },
  deleteApplication: async (id: string): Promise<void> => {
    await api.delete(`/placement/${id}`);
  },
};
