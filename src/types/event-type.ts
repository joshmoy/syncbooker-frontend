export interface EventType {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    username: string;
    displayPicture?: string | null;
    banner?: string | null;
  };
}

export interface CreateEventTypeRequest {
  title: string;
  durationMinutes: number;
  description?: string;
  color?: string;
}

export type BookingCopyTone =
  | "professional"
  | "friendly"
  | "consultative"
  | "sales"
  | "supportive";

export interface GenerateBookingCopyRequest {
  title: string;
  durationMinutes?: number;
  audience?: string;
  goal?: string;
  tone?: BookingCopyTone;
  additionalContext?: string;
  existingDescription?: string;
}

export interface BookingCopySuggestion {
  label: string;
  title: string;
  description: string;
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

export interface GenerateBookingCopyResponse {
  message: string;
  provider: "gemini" | "template";
  suggestions: BookingCopySuggestion[];
}
