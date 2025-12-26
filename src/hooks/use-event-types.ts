import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { eventTypesService } from "@/lib/event-types";
import type {
  CreateEventTypeRequest,
  UpdateEventTypeRequest,
} from "@/types/event-type";

// Query keys
export const eventTypeKeys = {
  all: ["eventTypes"] as const,
  lists: () => [...eventTypeKeys.all, "list"] as const,
  list: () => [...eventTypeKeys.lists()] as const,
  details: () => [...eventTypeKeys.all, "detail"] as const,
  detail: (id: string) => [...eventTypeKeys.details(), id] as const,
};

/**
 * Hook to fetch all event types
 */
export function useEventTypes() {
  return useQuery({
    queryKey: eventTypeKeys.list(),
    queryFn: () => eventTypesService.getAllEventTypes(),
  });
}

/**
 * Hook to fetch a single event type
 */
export function useEventType(id: string) {
  return useQuery({
    queryKey: eventTypeKeys.detail(id),
    queryFn: () => eventTypesService.getEventTypeById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new event type
 */
export function useCreateEventType() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventTypeRequest) =>
      eventTypesService.createEventType(data),
    onSuccess: (response) => {
      // Invalidate and refetch event types list
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.list() });
      toast.success(response.message || "Event type created successfully!");
      router.push("/dashboard/events");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create event type. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to update an event type
 */
export function useUpdateEventType(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEventTypeRequest) =>
      eventTypesService.updateEventType(id, data),
    onSuccess: (response) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.list() });
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.detail(id) });
      toast.success(response.message || "Event type updated successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update event type. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to delete an event type
 */
export function useDeleteEventType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventTypesService.deleteEventType(id),
    onSuccess: (response) => {
      // Invalidate event types list
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.list() });
      toast.success(response.message || "Event type deleted successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete event type. Please try again.";
      toast.error(message);
    },
  });
}