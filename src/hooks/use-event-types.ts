import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { eventTypesService } from "@/lib/event-types";
import type {
  GenerateBookingCopyRequest,
  GenerateBookingFaqRequest,
  GenerateEventTypeIdeasRequest,
  CreateEventTypeRequest,
  UpdateEventTypeRequest,
} from "@/types/event-type";

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

function getErrorMessage(error: AxiosError<ApiErrorResponse>) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

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
 * Hook to fetch a single event type (protected)
 */
export function useEventType(id: string) {
  return useQuery({
    queryKey: eventTypeKeys.detail(id),
    queryFn: () => eventTypesService.getEventTypeById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch a single event type (public - no auth required)
 */
export function usePublicEventType(id: string) {
  return useQuery({
    queryKey: [...eventTypeKeys.all, "public", id] as const,
    queryFn: () => eventTypesService.getPublicEventType(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new event type
 */
export function useCreateEventType(redirectTo: string | null = "/dashboard/events") {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventTypeRequest) =>
      eventTypesService.createEventType(data),
    onSuccess: (response) => {
      // Invalidate and refetch event types list
      queryClient.invalidateQueries({ queryKey: eventTypeKeys.list() });
      toast.success(response.message || "Event type created successfully!");
      if (redirectTo) {
        router.push(redirectTo);
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(getErrorMessage(error) || "Failed to create event type. Please try again.");
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
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(getErrorMessage(error) || "Failed to update event type. Please try again.");
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
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(getErrorMessage(error) || "Failed to delete event type. Please try again.");
    },
  });
}

/**
 * Hook to generate booking page copy suggestions
 */
export function useGenerateBookingCopy() {
  return useMutation({
    mutationFn: (data: GenerateBookingCopyRequest) =>
      eventTypesService.generateBookingCopy(data),
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(getErrorMessage(error) || "Failed to generate booking copy. Please try again.");
    },
  });
}

/**
 * Hook to generate booking page FAQ suggestions
 */
export function useGenerateBookingFaqs() {
  return useMutation({
    mutationFn: (data: GenerateBookingFaqRequest) =>
      eventTypesService.generateBookingFaqs(data),
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(getErrorMessage(error) || "Failed to generate booking FAQs. Please try again.");
    },
  });
}

/**
 * Hook to generate event type ideas from a prompt
 */
export function useGenerateEventTypeIdeas() {
  return useMutation({
    mutationFn: (data: GenerateEventTypeIdeasRequest) =>
      eventTypesService.generateEventTypeIdeas(data),
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(getErrorMessage(error) || "Failed to generate event ideas. Please try again.");
    },
  });
}
