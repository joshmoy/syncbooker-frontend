"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAvailableSlots } from "@/hooks/use-bookings";
import { useRescheduleBooking } from "@/hooks/use-bookings";
import { format, isSameDay } from "date-fns";
import type { Booking } from "@/types/booking";

interface RescheduleDialogProps {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RescheduleDialog({
  booking,
  open,
  onOpenChange,
}: RescheduleDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { data: allSlots, isLoading: slotsLoading } = useAvailableSlots(
    booking.eventTypeId
  );
  const reschedule = useRescheduleBooking();

  const availableDates = useMemo(() => {
    if (!allSlots) return new Set<string>();
    return new Set(
      allSlots.map((s) => format(new Date(s.startTime), "yyyy-MM-dd"))
    );
  }, [allSlots]);

  const slotsForDate = useMemo(() => {
    if (!date || !allSlots) return [];
    return allSlots.filter((s) => isSameDay(new Date(s.startTime), date));
  }, [date, allSlots]);

  const handleConfirm = () => {
    if (!selectedSlot) return;
    reschedule.mutate(
      { id: booking.id, startTime: selectedSlot },
      {
        onSuccess: () => {
          onOpenChange(false);
          setDate(undefined);
          setSelectedSlot(null);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reschedule Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="body-sm text-muted-foreground">
            Select a new date and time for{" "}
            <strong>{booking.inviteeName}</strong>&apos;s booking.
          </p>

          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setSelectedSlot(null);
            }}
            disabled={(d) => {
              if (d < new Date(new Date().setHours(0, 0, 0, 0))) return true;
              return !availableDates.has(format(d, "yyyy-MM-dd"));
            }}
            className="rounded-md border border-border mx-auto"
          />

          {date && (
            <div>
              <p className="label-md mb-2">Available times</p>
              {slotsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : slotsForDate.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {slotsForDate.map((slot) => (
                    <Button
                      key={slot.startTime}
                      variant={selectedSlot === slot.startTime ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSlot(slot.startTime)}
                    >
                      {format(new Date(slot.startTime), "h:mm a")}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="body-sm text-muted-foreground text-center py-4">
                  No available times for this date
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedSlot || reschedule.isPending}
          >
            {reschedule.isPending ? "Rescheduling..." : "Confirm Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
