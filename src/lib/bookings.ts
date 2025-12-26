import apiInstance from "./api";
import axios from "axios";
import {
  CreateBookingRequest,
  UpdateBookingRequest,
  Booking,
  AvailableSlot,
  AvailableSlotsResponse,
  BookingsResponse,
  BookingResponse,
} from "@/types/booking";

/**
 * Bookings service for managing booking operations
 */
export const bookingsService = {
  /**
   * PUBLIC: Get available slots for an event type
   */
  async getAvailableSlots(
    eventTypeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AvailableSlot[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const queryString = params.toString();
    const url = `/public/event-type/${eventTypeId}/slots${queryString ? `?${queryString}` : ""}`;

    // Use axios directly without auth token for public endpoint
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const response = await axios.get<AvailableSlotsResponse>(`${baseURL}${url}`);
    return response.data.slots;
  },

  /**
   * PUBLIC: Get public bookings for an event type
   */
  async getPublicBookings(eventTypeId: string): Promise<Booking[]> {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const response = await axios.get<BookingsResponse>(
      `${baseURL}/public/event-type/${eventTypeId}/bookings`
    );
    return response.data.bookings;
  },

  /**
   * PUBLIC: Create a new booking (no auth required)
   */
  async createPublicBooking(data: CreateBookingRequest): Promise<Booking> {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const response = await axios.post<BookingResponse>(
      `${baseURL}/public/book`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.booking;
  },

  /**
   * PROTECTED: Get all bookings for the current user's event types
   */
  async getUserBookings(): Promise<Booking[]> {
    const response = await apiInstance.get<BookingsResponse>("/bookings");
    return response.data.bookings;
  },

  /**
   * PROTECTED: Get a specific booking by ID
   */
  async getBookingById(id: string): Promise<Booking> {
    const response = await apiInstance.get<BookingResponse>(`/bookings/${id}`);
    return response.data.booking;
  },

  /**
   * PROTECTED: Update a booking
   */
  async updateBooking(
    id: string,
    data: UpdateBookingRequest
  ): Promise<Booking> {
    const response = await apiInstance.put<BookingResponse>(
      `/bookings/${id}`,
      data
    );
    return response.data.booking;
  },

  /**
   * PROTECTED: Delete a booking
   */
  async deleteBooking(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiInstance.delete<{
      success: boolean;
      message: string;
    }>(`/bookings/${id}`);
    return response.data;
  },
};