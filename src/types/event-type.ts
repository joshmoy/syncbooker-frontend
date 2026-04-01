export interface EventType {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  color: string | null;
  faqs?: EventTypeFaq[] | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    username: string;
    displayPicture?: string | null;
    banner?: string | null;
  };
}

export interface EventTypeFaq {
  question: string;
  answer: string;
}

export interface CreateEventTypeRequest {
  title: string;
  durationMinutes: number;
  description?: string;
  color?: string;
  faqs?: EventTypeFaq[];
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

export interface GenerateBookingFaqRequest {
  title: string;
  description?: string;
  businessType?: string;
  audience?: string;
}

export interface UpdateEventTypeRequest {
  title?: string;
  description?: string;
  durationMinutes?: number;
  color?: string;
  faqs?: EventTypeFaq[];
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

export interface GenerateBookingFaqResponse {
  message: string;
  provider: "gemini" | "template";
  faqs: EventTypeFaq[];
}
