import api from "@/lib/axios";
import type { AttendanceSummary } from "@/types";

export const attendanceApi = {
  getAll: async () => {
    const { data } = await api.get("/attendance");
    return data.data;
  },

  getSummary: async (): Promise<AttendanceSummary[]> => {
    const { data } = await api.get("/attendance/summary");
    return data.data;
  },

  create: async (record: { subject_id: string; date: string; status: string }) => {
    const { data } = await api.post("/attendance", record);
    return data.data;
  },
};
