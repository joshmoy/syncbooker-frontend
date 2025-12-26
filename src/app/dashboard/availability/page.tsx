"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import {
  useAvailabilities,
  useDeleteAvailability,
  useBatchCreateAvailability,
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

export default function AvailabilityPage() {
  const { data: availabilities, isLoading } = useAvailabilities();
  const deleteAvailability = useDeleteAvailability();
  const batchCreate = useBatchCreateAvailability();

  const [availability, setAvailability] = useState<DayAvailability[]>(
    daysOfWeek.map((day) => ({
      day: day.name,
      dayOfWeek: day.value,
      enabled: false,
      slots: [{ start: "09:00", end: "17:00" }],
    }))
  );

  // Load availabilities from API
  useEffect(() => {
    if (availabilities && availabilities.length > 0) {
      const dayMap = new Map<number, DayAvailability>();

      // Initialize all days
      daysOfWeek.forEach((day) => {
        dayMap.set(day.value, {
          day: day.name,
          dayOfWeek: day.value,
          enabled: false,
          slots: [],
        });
      });

      // Group availabilities by day
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

      // Convert to array in day order
      const updatedAvailability = daysOfWeek.map((day) => {
        const dayData = dayMap.get(day.value)!;
        // If no slots, add default
        if (dayData.enabled && dayData.slots.length === 0) {
          dayData.slots = [{ start: "09:00", end: "17:00" }];
        }
        return dayData;
      });

      setAvailability(updatedAvailability);
    }
  }, [availabilities]);

  const handleToggle = (index: number) => {
    const newAvailability = [...availability];
    newAvailability[index].enabled = !newAvailability[index].enabled;
    
    // If enabling and no slots, add default
    if (newAvailability[index].enabled && newAvailability[index].slots.length === 0) {
      newAvailability[index].slots = [{ start: "09:00", end: "17:00" }];
    }
    
    setAvailability(newAvailability);
  };

  const handleTimeChange = (
    dayIndex: number,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].slots[slotIndex][field] = value;
    setAvailability(newAvailability);
  };

  const handleSave = async () => {
    // First, delete all existing availabilities
    if (availabilities) {
      await Promise.all(
        availabilities.map((avail) => deleteAvailability.mutateAsync(avail.id))
      );
    }

    // Then create new ones based on current state
    const newSlots = availability
      .filter((day) => day.enabled)
      .flatMap((day) =>
        day.slots.map((slot) => ({
          dayOfWeek: day.dayOfWeek,
          startTime: formatTimeForAPI(slot.start),
          endTime: formatTimeForAPI(slot.end),
          timezone: "UTC",
        }))
      );

    if (newSlots.length > 0) {
      batchCreate.mutate(newSlots);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="body-sm text-muted-foreground">
              Loading availability...
            </p>
          </div>
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
                  className="flex items-center gap-4 rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={dayData.enabled}
                      onCheckedChange={() => handleToggle(dayIndex)}
                    />
                    <Label className="w-24 label-md">{dayData.day}</Label>
                  </div>

                  {dayData.enabled && (
                    <div className="flex flex-1 flex-col gap-2">
                      {dayData.slots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center gap-4"
                        >
                          <Select
                            value={slot.start}
                            onValueChange={(value) =>
                              handleTimeChange(dayIndex, slotIndex, "start", value)
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
                        </div>
                      ))}
                    </div>
                  )}

                  {!dayData.enabled && (
                    <span className="body-sm text-muted-foreground">
                      Unavailable
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={batchCreate.isPending || deleteAvailability.isPending}
              >
                {batchCreate.isPending || deleteAvailability.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}