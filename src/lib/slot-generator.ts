import {
  addMinutes,
  isSameDay,
  startOfDay,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
} from "date-fns";

export interface TimeSlot {
  startTime: string; // ISO string
  endTime: string; // ISO string
}

/**
 * Generate all available slots for a day based on backend's sample slots
 * Backend returns one slot per day showing the start of availability
 * We use this to infer the availability window and generate all slots
 */
export function generateSlotsFromBackendResponse(
  backendSlots: TimeSlot[],
  selectedDate: Date,
  durationMinutes: number,
  existingBookings: TimeSlot[] = []
): TimeSlot[] {
  // Filter backend slots for the selected date
  const daySampleSlot = backendSlots.find((slot) =>
    isSameDay(new Date(slot.startTime), selectedDate)
  );

  if (!daySampleSlot) {
    return []; // No availability for this date
  }

  // Extract the availability window from the backend slot
  // Assume if backend returns 9:00-9:15, availability starts at 9:00
  const availabilityStart = new Date(daySampleSlot.startTime);
  const startHour = getHours(availabilityStart);
  const startMinute = getMinutes(availabilityStart);

  // Assume availability ends at 5:00 PM (17:00) by default
  // You can make this configurable if backend provides end time
  const endHour = 17;
  const endMinute = 0;

  // Create start and end times for the selected date
  let currentSlotStart = new Date(selectedDate);
  currentSlotStart = setHours(currentSlotStart, startHour);
  currentSlotStart = setMinutes(currentSlotStart, startMinute);
  currentSlotStart.setSeconds(0);
  currentSlotStart.setMilliseconds(0);

  const windowEnd = new Date(selectedDate);
  windowEnd.setHours(endHour, endMinute, 0, 0);

  const generatedSlots: TimeSlot[] = [];

  // Generate all slots within the window
  while (currentSlotStart < windowEnd) {
    const slotEnd = addMinutes(currentSlotStart, durationMinutes);

    // Check if slot fits within availability window
    if (slotEnd <= windowEnd) {
      // Check if slot doesn't overlap with existing bookings
      const isAvailable = !existingBookings.some((booking) => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);

        // Check for any overlap
        return currentSlotStart < bookingEnd && slotEnd > bookingStart;
      });

      if (isAvailable) {
        generatedSlots.push({
          startTime: currentSlotStart.toISOString(),
          endTime: slotEnd.toISOString(),
        });
      }
    }

    // Move to next slot
    currentSlotStart = addMinutes(currentSlotStart, durationMinutes);
  }

  return generatedSlots;
}

/**
 * Get unique dates from backend slots
 */
export function getAvailableDatesFromSlots(slots: TimeSlot[]): Date[] {
  const uniqueDates = new Map<string, Date>();

  slots.forEach((slot) => {
    const date = new Date(slot.startTime);
    const dateKey = startOfDay(date).toISOString();
    if (!uniqueDates.has(dateKey)) {
      uniqueDates.set(dateKey, startOfDay(date));
    }
  });

  return Array.from(uniqueDates.values());
}