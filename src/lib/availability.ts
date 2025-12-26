import apiInstance from "./api";
import axios from "axios";
import {
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  Availability,
  AvailabilityResponse,
  AvailabilitiesResponse,
} from "@/types/availability";

/**
 * Availability service for managing availability operations
 */
export const availabilityService = {
  /**
   * PUBLIC: Get availability for a specific user (by event type)
   * Note: This uses the slots endpoint which may return availability data
   */
  async getPublicAvailability(eventTypeId: string): Promise<Availability[]> {
    try {
      const baseURL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      
      // Try to get availability data
      const response = await axios.get<any>(
        `${baseURL}/public/event-type/${eventTypeId}/slots`
      );
      
      // Check if response has availabilities
      if (response.data && response.data.availabilities) {
        return response.data.availabilities;
      }
      
      // If not, return empty array (no availability data from backend)
      return [];
    } catch (error) {
      console.error("Failed to fetch public availability:", error);
      return []; // Return empty array instead of throwing
    }
  },
  /**
   * Create a new availability slot
   */
  async createAvailability(
    data: CreateAvailabilityRequest
  ): Promise<AvailabilityResponse> {
    const response = await apiInstance.post<AvailabilityResponse>(
      "/availability",
      data
    );
    return response.data;
  },

  /**
   * Get all availability slots for the current user
   */
  async getAllAvailabilities(): Promise<Availability[]> {
    const response = await apiInstance.get<AvailabilitiesResponse>(
      "/availability"
    );
    return response.data.availabilities;
  },

  /**
   * Update an existing availability slot
   */
  async updateAvailability(
    id: string,
    data: UpdateAvailabilityRequest
  ): Promise<AvailabilityResponse> {
    const response = await apiInstance.put<AvailabilityResponse>(
      `/availability/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete an availability slot
   */
  async deleteAvailability(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiInstance.delete<{
      success: boolean;
      message: string;
    }>(`/availability/${id}`);
    return response.data;
  },

  /**
   * Batch create multiple availability slots (for setting up full week)
   */
  async batchCreateAvailability(
    slots: CreateAvailabilityRequest[]
  ): Promise<Availability[]> {
    const promises = slots.map((slot) => this.createAvailability(slot));
    const results = await Promise.all(promises);
    return results.map((result) => result.availability);
  },
};