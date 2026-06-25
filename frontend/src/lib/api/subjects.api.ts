import api from "@/lib/axios";

export const subjectsApi = {
  getAll: async () => {
    const { data } = await api.get("/subjects");
    return data.data;
  },
};
