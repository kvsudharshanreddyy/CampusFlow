"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "@/lib/api/ai.api";

export function useAIHistory(limit = 20) {
  return useQuery({
    queryKey: ["ai", "history", limit],
    queryFn: () => aiApi.getHistory(limit),
    staleTime: 60 * 1000,
  });
}

export function useSaveAIHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ prompt, response, context }: { prompt: string; response: string; context?: any }) =>
      aiApi.saveHistory(prompt, response, context),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "history"] });
    },
  });
}
