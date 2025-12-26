export interface EventType {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventTypeRequest {
  title: string;
  durationMinutes: number;
  description?: string;
  color?: string;
}

export interface UpdateEventTypeRequest {
  title?: string;
  description?: string;
  durationMinutes?: number;
  color?: string;
}

export interface EventTypeResponse {
  success: boolean;
  message: string;
  eventType: EventType;
}

export interface EventTypesResponse {
  success: boolean;
  eventTypes: EventType[];
}