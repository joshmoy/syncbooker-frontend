import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingsService } from "@/lib/bookings";
import type {
  CreateBookingRequest,
  UpdateBookingRequest,
} from "@/types/booking";

// Query keys
export const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
  list: () => [...bookingKeys.lists()] as const,
  details: () => [...bookingKeys.all, "detail"] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
  availableSlots: (eventTypeId: string, startDate?: string, endDate?: string) =>
    [...bookingKeys.all, "slots", eventTypeId, startDate, endDate] as const,
  publicBookings: (eventTypeId: string) =>
    [...bookingKeys.all, "public", eventTypeId] as const,
};

/**
 * Hook to fetch user's bookings (protected)
 */
export function useBookings() {
  return useQuery({
    queryKey: bookingKeys.list(),
    queryFn: () => bookingsService.getUserBookings(),
    staleTime: 0,
    refetchOnMount: true,
  });
}

/**
 * Hook to fetch a single booking (protected)
 */
export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingsService.getBookingById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch available slots (public)
 */
export function useAvailableSlots(
  eventTypeId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: bookingKeys.availableSlots(eventTypeId, startDate, endDate),
    queryFn: () =>
      bookingsService.getAvailableSlots(eventTypeId, startDate, endDate),
    enabled: !!eventTypeId,
  });
}

/**
 * Hook to fetch public bookings for an event type
 */
export function usePublicBookings(eventTypeId: string) {
  return useQuery({
    queryKey: bookingKeys.publicBookings(eventTypeId),
    queryFn: () => bookingsService.getPublicBookings(eventTypeId),
    enabled: !!eventTypeId,
  });
}

/**
 * Hook to create a public booking
 */
export function useCreatePublicBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) =>
      bookingsService.createPublicBooking(data),
    onSuccess: (booking) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: bookingKeys.availableSlots(booking.eventTypeId),
      });
      queryClient.invalidateQueries({
        queryKey: bookingKeys.publicBookings(booking.eventTypeId),
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create booking. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to update a booking (protected)
 */
export function useUpdateBooking(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBookingRequest) =>
      bookingsService.updateBooking(id, data),
    onSuccess: (booking) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
      toast.success("Booking updated successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update booking. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to delete a booking (protected)
 */
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsService.deleteBooking(id),
    onSuccess: () => {
      // Invalidate bookings list
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      toast.success("Booking cancelled successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to cancel booking. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to approve a booking (protected)
 */
export function useApproveBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsService.approveBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      toast.success("Booking approved successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to approve booking.";
      toast.error(message);
    },
  });
}

/**
 * Hook to reject a booking (protected)
 */
export function useRejectBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsService.rejectBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() });
      toast.success("Booking rejected.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to reject booking.";
      toast.error(message);
    },
  });
}