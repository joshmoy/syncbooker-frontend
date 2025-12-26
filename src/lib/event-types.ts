import apiInstance from "./api";
import axios from "axios";
import {
  CreateEventTypeRequest,
  UpdateEventTypeRequest,
  EventType,
  EventTypeResponse,
  EventTypesResponse,
} from "@/types/event-type";

/**
 * Event Types service for managing event type operations
 */
export const eventTypesService = {
  /**
   * PUBLIC: Get event type by ID (no auth required)
   */
  async getPublicEventType(id: string): Promise<EventType> {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const response = await axios.get<EventTypeResponse>(
      `${baseURL}/public/event-type/${id}`
    );
    return response.data.eventType;
  },
  /**
   * Create a new event type
   */
  async createEventType(
    data: CreateEventTypeRequest
  ): Promise<EventTypeResponse> {
    const response = await apiInstance.post<EventTypeResponse>(
      "/event-types",
      data
    );
    return response.data;
  },

  /**
   * Get all event types for the current user
   */
  async getAllEventTypes(): Promise<EventType[]> {
    const response = await apiInstance.get<EventTypesResponse>(
      "/event-types"
    );
    return response.data.eventTypes;
  },

  /**
   * Get a single event type by ID
   */
  async getEventTypeById(id: string): Promise<EventType> {
    const response = await apiInstance.get<EventTypeResponse>(
      `/event-types/${id}`
    );
    return response.data.eventType;
  },

  /**
   * Update an existing event type
   */
  async updateEventType(
    id: string,
    data: UpdateEventTypeRequest
  ): Promise<EventTypeResponse> {
    const response = await apiInstance.put<EventTypeResponse>(
      `/event-types/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete an event type
   */
  async deleteEventType(id: string): Promise<{ success: boolean; message: string }> {
    const response = await apiInstance.delete<{ success: boolean; message: string }>(
      `/event-types/${id}`
    );
    return response.data;
  },
};
