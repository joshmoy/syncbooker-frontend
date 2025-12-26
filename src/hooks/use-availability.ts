import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { availabilityService } from "@/lib/availability";
import type {
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
} from "@/types/availability";

// Query keys
export const availabilityKeys = {
  all: ["availability"] as const,
  lists: () => [...availabilityKeys.all, "list"] as const,
  list: () => [...availabilityKeys.lists()] as const,
};

/**
 * Hook to fetch all availability slots
 */
export function useAvailabilities() {
  return useQuery({
    queryKey: availabilityKeys.list(),
    queryFn: () => availabilityService.getAllAvailabilities(),
  });
}

/**
 * Hook to create a new availability slot
 */
export function useCreateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAvailabilityRequest) =>
      availabilityService.createAvailability(data),
    onSuccess: (response) => {
      // Invalidate and refetch availability list
      queryClient.invalidateQueries({ queryKey: availabilityKeys.list() });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create availability. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to update an availability slot
 */
export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAvailabilityRequest;
    }) => availabilityService.updateAvailability(id, data),
    onSuccess: () => {
      // Invalidate availability list
      queryClient.invalidateQueries({ queryKey: availabilityKeys.list() });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update availability. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to delete an availability slot
 */
export function useDeleteAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => availabilityService.deleteAvailability(id),
    onSuccess: () => {
      // Invalidate availability list
      queryClient.invalidateQueries({ queryKey: availabilityKeys.list() });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete availability. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to batch create multiple availability slots
 */
export function useBatchCreateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slots: CreateAvailabilityRequest[]) =>
      availabilityService.batchCreateAvailability(slots),
    onSuccess: () => {
      // Invalidate and refetch availability list
      queryClient.invalidateQueries({ queryKey: availabilityKeys.list() });
      toast.success("Availability updated successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update availability. Please try again.";
      toast.error(message);
    },
  });
}