"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { placementApi } from "@/lib/api/placement.api";
import { toast } from "sonner";
import type { PlacementEntry } from "@/types";

export function usePlacementApplications() {
  return useQuery({
    queryKey: ["placement", "applications"],
    queryFn: placementApi.getApplications,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlacementCompanies() {
  return useQuery({
    queryKey: ["placement", "companies"],
    queryFn: placementApi.getCompanies,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreatePlacementApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PlacementEntry>) => placementApi.createApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placement"] });
      toast.success("Job application tracked!");
    },
    onError: () => toast.error("Failed to add job application"),
  });
}

export function useUpdatePlacementApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PlacementEntry> }) =>
      placementApi.updateApplication(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placement"] });
      toast.success("Application status updated!");
    },
    onError: () => toast.error("Failed to update status"),
  });
}

export function useDeletePlacementApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => placementApi.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["placement"] });
      toast.success("Job application deleted");
    },
    onError: () => toast.error("Failed to delete application"),
  });
}
