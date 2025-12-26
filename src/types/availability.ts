export interface Availability {
  id: string;
  userId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string; // HH:mm:ss format
  endTime: string; // HH:mm:ss format
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityRequest {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  timezone?: string;
}

export interface UpdateAvailabilityRequest {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  timezone?: string;
}

export interface AvailabilityResponse {
  success: boolean;
  message: string;
  availability: Availability;
}

export interface AvailabilitiesResponse {
  success: boolean;
  availabilities: Availability[];
}

// Helper type for UI state
export interface DayAvailability {
  day: string;
  dayOfWeek: number;
  enabled: boolean;
  slots: Array<{
    id?: string;
    start: string; // HH:mm format for UI
    end: string; // HH:mm format for UI
  }>;
}