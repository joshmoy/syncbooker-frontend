"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useAvailabilities,
  useReplaceAvailabilities,
} from "@/hooks/use-availability";
import type { DayAvailability } from "@/types/availability";

const daysOfWeek = [
  { name: "Sunday", value: 0 },
  { name: "Monday", value: 1 },
  { name: "Tuesday", value: 2 },
  { name: "Wednesday", value: 3 },
  { name: "Thursday", value: 4 },
  { name: "Friday", value: 5 },
  { name: "Saturday", value: 6 },
];

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

// Helper to convert HH:mm:ss to HH:mm
const formatTimeForUI = (time: string): string => {
  return time.substring(0, 5); // Takes HH:mm from HH:mm:ss
};

// Helper to convert HH:mm to HH:mm:ss
const formatTimeForAPI = (time: string): string => {
  return `${time}:00`;
};

// Helper to convert time string to minutes for comparison
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Validate that start time is before end time
const validateTimeSlot = (start: string, end: string): boolean => {
  return timeToMinutes(start) < timeToMinutes(end);
};

// Check if two time slots overlap
const doSlotsOverlap = (
  slot1: { start: string; end: string },
  slot2: { start: string; end: string }
): boolean => {
  const start1 = timeToMinutes(slot1.start);
  const end1 = timeToMinutes(slot1.end);
  const start2 = timeToMinutes(slot2.start);
  const end2 = timeToMinutes(slot2.end);

  return start1 < end2 && start2 < end1;
};

// Validate all slots for a day (no overlaps, valid times)
const validateDaySlots = (
  slots: Array<{ start: string; end: string }>
): { valid: boolean; error?: string } => {
  // Check each slot is valid
  for (const slot of slots) {
    if (!validateTimeSlot(slot.start, slot.end)) {
      return {
        valid: false,
        error: `Invalid time slot: end time (${slot.end}) must be after start time (${slot.start})`,
      };
    }
  }

  // Check for overlaps
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (doSlotsOverlap(slots[i], slots[j])) {
        return {
          valid: false,
          error: `Time slots overlap: ${slots[i].start}-${slots[i].end} and ${slots[j].start}-${slots[j].end}`,
        };
      }
    }
  }

  return { valid: true };
};

export default function AvailabilityPage() {
  const { data: availabilities, isLoading } = useAvailabilities();
  const replaceAvailabilities = useReplaceAvailabilities();

  // Local edits — null means the user hasn't changed anything yet
  const [edits, setEdits] = useState<DayAvailability[] | null>(null);

  // Derived from server data; used when there are no local edits
  const serverAvailability = useMemo<DayAvailability[]>(() => {
    if (!availabilities || availabilities.length === 0) {
      return daysOfWeek.map((day) => ({
        day: day.name,
        dayOfWeek: day.value,
        enabled: false,
        slots: [{ start: "09:00", end: "17:00" }],
      }));
    }

    const dayMap = new Map<number, DayAvailability>();
    daysOfWeek.forEach((day) => {
      dayMap.set(day.value, {
        day: day.name,
        dayOfWeek: day.value,
        enabled: false,
        slots: [],
      });
    });

    availabilities.forEach((avail) => {
      const day = dayMap.get(avail.dayOfWeek);
      if (day) {
        day.enabled = true;
        day.slots.push({
          id: avail.id,
          start: formatTimeForUI(avail.startTime),
          end: formatTimeForUI(avail.endTime),
        });
      }
    });

    return daysOfWeek.map((day) => {
      const dayData = dayMap.get(day.value)!;
      if (dayData.enabled && dayData.slots.length === 0) {
        dayData.slots = [{ start: "09:00", end: "17:00" }];
      }
      return dayData;
    });
  }, [availabilities]);

  const availability = edits ?? serverAvailability;
  const setAvailability = (next: DayAvailability[]) => setEdits(next);

  const handleToggle = (index: number) => {
    const next = structuredClone(availability);
    next[index].enabled = !next[index].enabled;

    if (next[index].enabled && next[index].slots.length === 0) {
      next[index].slots = [{ start: "09:00", end: "17:00" }];
    }

    setAvailability(next);
  };

  const handleTimeChange = (
    dayIndex: number,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    const next = structuredClone(availability);
    next[dayIndex].slots[slotIndex][field] = value;
    setAvailability(next);
  };

  const handleAddSlot = (dayIndex: number) => {
    const next = structuredClone(availability);
    const currentSlots = next[dayIndex].slots;

    let newStart = "14:00";
    let newEnd = "17:00";

    if (currentSlots.length > 0) {
      const lastSlot = currentSlots[currentSlots.length - 1];
      const lastEndMinutes = timeToMinutes(lastSlot.end);

      const newStartMinutes = lastEndMinutes + 60;
      if (newStartMinutes < 24 * 60) {
        const hours = Math.floor(newStartMinutes / 60);
        const minutes = newStartMinutes % 60;
        newStart = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

        const newEndMinutes = newStartMinutes + 180;
        if (newEndMinutes < 24 * 60) {
          const endHours = Math.floor(newEndMinutes / 60);
          const endMinutes = newEndMinutes % 60;
          newEnd = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
        }
      }
    }

    next[dayIndex].slots.push({ start: newStart, end: newEnd });
    setAvailability(next);
  };

  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    const next = structuredClone(availability);
    next[dayIndex].slots.splice(slotIndex, 1);

    if (next[dayIndex].slots.length === 0) {
      next[dayIndex].enabled = false;
    }

    setAvailability(next);
  };

  const handleSave = () => {
    for (const day of availability) {
      if (day.enabled && day.slots.length > 0) {
        const validation = validateDaySlots(day.slots);
        if (!validation.valid) {
          toast.error(`${day.day}: ${validation.error}`);
          return;
        }
      }
    }

    const slots = availability
      .filter((day) => day.enabled)
      .flatMap((day) =>
        day.slots.map((slot) => ({
          dayOfWeek: day.dayOfWeek,
          startTime: formatTimeForAPI(slot.start),
          endTime: formatTimeForAPI(slot.end),
          timezone: "UTC",
        }))
      );

    replaceAvailabilities.mutate(slots, {
      onSuccess: () => setEdits(null),
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-72 mt-2" />
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-10 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="heading-lg">Availability</h1>
          <p className="body-md mt-2 text-muted-foreground">
            Set your weekly availability for bookings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="heading-sm">Weekly Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availability.map((dayData, dayIndex) => (
                <div
                  key={dayData.day}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={dayData.enabled}
                        onCheckedChange={() => handleToggle(dayIndex)}
                      />
                      <Label className="w-24 label-md">{dayData.day}</Label>
                    </div>

                    {dayData.enabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSlot(dayIndex)}
                        className="ml-auto"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Time Slot
                      </Button>
                    )}
                  </div>

                  {dayData.enabled && (
                    <div className="space-y-2 pl-11">
                      {dayData.slots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center gap-3"
                        >
                          <Select
                            value={slot.start}
                            onValueChange={(value) =>
                              handleTimeChange(
                                dayIndex,
                                slotIndex,
                                "start",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <span className="text-muted-foreground">to</span>

                          <Select
                            value={slot.end}
                            onValueChange={(value) =>
                              handleTimeChange(dayIndex, slotIndex, "end", value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {dayData.slots.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSlot(dayIndex, slotIndex)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}

                          {!validateTimeSlot(slot.start, slot.end) && (
                            <span className="body-sm text-destructive ml-2">
                              Invalid time range
                            </span>
                          )}
                        </div>
                      ))}

                      {/* Show overlap warning */}
                      {dayData.slots.length > 1 &&
                        !validateDaySlots(dayData.slots).valid && (
                          <div className="text-destructive body-sm mt-2 flex items-center gap-2">
                            <span>{validateDaySlots(dayData.slots).error}</span>
                          </div>
                        )}
                    </div>
                  )}

                  {!dayData.enabled && (
                    <div className="pl-11">
                      <span className="body-sm text-muted-foreground">
                        Unavailable
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={replaceAvailabilities.isPending}
              >
                {replaceAvailabilities.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
