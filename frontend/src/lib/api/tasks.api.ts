import api from "@/lib/axios";
import type { Task, PaginatedResponse } from "@/types";

export interface TaskFilters {
  status?: string;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const tasksApi = {
  getAll: async (filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== "all") params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortDir) params.set("sortDir", filters.sortDir);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));

    const { data } = await api.get(`/tasks?${params.toString()}`);
    return { data: data.data, meta: data.meta };
  },

  getUpcoming: async (): Promise<Task[]> => {
    const { data } = await api.get("/tasks/upcoming");
    return data.data;
  },

  create: async (task: Partial<Task>): Promise<Task> => {
    const { data } = await api.post("/tasks", task);
    return data.data;
  },

  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const { data } = await api.patch(`/tasks/${id}`, updates);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
