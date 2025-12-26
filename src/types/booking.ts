export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  eventTypeId: string;
  inviteeName: string;
  inviteeEmail: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  eventType?: {
    id: string;
    title: string;
    durationMinutes: number;
  };
}

export interface AvailableSlot {
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
}

export interface CreateBookingRequest {
  eventTypeId: string;
  inviteeName: string;
  inviteeEmail: string;
  startTime: string; // ISO 8601
  notes?: string;
}

export interface UpdateBookingRequest {
  status?: BookingStatus;
  notes?: string;
}

export interface AvailableSlotsResponse {
  slots: AvailableSlot[];
}

export interface BookingsResponse {
  bookings: Booking[];
}

export interface BookingResponse {
  booking: Booking;
}