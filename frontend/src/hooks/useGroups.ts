"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsApi } from "@/lib/api/groups.api";
import { toast } from "sonner";

export function useStudyGroups() {
  return useQuery({
    queryKey: ["groups", "list"],
    queryFn: groupsApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      groupsApi.create(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Study group created successfully!");
    },
    onError: () => toast.error("Failed to create study group"),
  });
}

export function useJoinStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => groupsApi.join(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Joined study group!");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to join group";
      toast.error(msg);
    },
  });
}

export function useLeaveStudyGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => groupsApi.leave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Left study group");
    },
    onError: () => toast.error("Failed to leave study group"),
  });
}

export function useGroupMembers(groupId: string) {
  return useQuery({
    queryKey: ["groups", "members", groupId],
    queryFn: () => groupsApi.getMembers(groupId),
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000,
  });
}
