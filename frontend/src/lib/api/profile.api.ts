import api from "@/lib/axios";
import type { Profile } from "@/types";

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    const { data } = await api.get("/profile");
    return data.data;
  },
  updateProfile: async (payload: Partial<Profile>): Promise<Profile> => {
    const { data } = await api.put("/profile", payload);
    return data.data;
  },
};
