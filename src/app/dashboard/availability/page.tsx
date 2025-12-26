"use client";

import { useState } from "react";
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
import { toast } from "sonner";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState(
    daysOfWeek.map((day) => ({
      day,
      enabled: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
        day
      ),
      start: "09:00",
      end: "17:00",
    }))
  );

  const handleToggle = (index: number) => {
    const newAvailability = [...availability];
    newAvailability[index].enabled = !newAvailability[index].enabled;
    setAvailability(newAvailability);
  };

  const handleTimeChange = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const newAvailability = [...availability];
    newAvailability[index][field] = value;
    setAvailability(newAvailability);
  };

  const handleSave = () => {
    toast.success("Availability updated successfully!");
  };

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
              {availability.map((slot, index) => (
                <div
                  key={slot.day}
                  className="flex items-center gap-4 rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={slot.enabled}
                      onCheckedChange={() => handleToggle(index)}
                    />
                    <Label className="w-24 label-md">{slot.day}</Label>
                  </div>

                  {slot.enabled && (
                    <div className="flex flex-1 items-center gap-4">
                      <Select
                        value={slot.start}
                        onValueChange={(value) =>
                          handleTimeChange(index, "start", value)
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
                          handleTimeChange(index, "end", value)
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
                  )}

                  {!slot.enabled && (
                    <span className="body-sm text-muted-foreground">
                      Unavailable
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}