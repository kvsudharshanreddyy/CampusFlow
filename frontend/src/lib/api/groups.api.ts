import api from "@/lib/axios";

export interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  created_by?: string;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export const groupsApi = {
  getAll: async (): Promise<StudyGroup[]> => {
    const { data } = await api.get("/groups");
    return data.data;
  },
  create: async (name: string, description?: string): Promise<StudyGroup> => {
    const { data } = await api.post("/groups", { name, description });
    return data.data;
  },
  join: async (id: string): Promise<void> => {
    await api.post(`/groups/${id}/join`);
  },
  leave: async (id: string): Promise<void> => {
    await api.delete(`/groups/${id}/leave`);
  },
  getMembers: async (id: string): Promise<GroupMember[]> => {
    const { data } = await api.get(`/groups/${id}/members`);
    return data.data;
  },
};
