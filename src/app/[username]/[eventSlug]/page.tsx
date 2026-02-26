"use client";

import { useState, useEffect, use, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePublicEventType } from "@/hooks/use-event-types";
import { useAvailableSlots, usePublicBookings, useCreatePublicBooking } from "@/hooks/use-bookings";
import { format, startOfDay, endOfDay, isSameDay } from "date-fns";
import { generateSlotsFromBackendResponse } from "@/lib/slot-generator";

export default function BookingPage({
  params,
}: {
  params: Promise<{ username: string; eventSlug: string }>;
}) {
  const { eventSlug } = use(params);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "details" | "confirmed">("select");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const { data: eventType, isLoading: eventLoading } = usePublicEventType(eventSlug);
  const createBooking = useCreatePublicBooking();

  // Fetch backend slots (these show one slot per day as samples)
  const {
    data: backendSlots,
    isLoading: slotsLoading,
    error: slotsError,
  } = useAvailableSlots(eventSlug);

  // Fetch existing bookings to filter out booked slots
  const { data: existingBookings } = usePublicBookings(eventSlug);

  // Generate all slots for the selected date based on backend response
  const slots = useMemo(() => {
    if (!date || !eventType || !backendSlots) {
      return [];
    }

    // Filter bookings for the selected date
    const dateBookings =
      existingBookings?.filter((booking) => isSameDay(new Date(booking.startTime), date)) || [];

    // Generate all slots from backend's sample slots
    return generateSlotsFromBackendResponse(
      backendSlots,
      date,
      eventType.durationMinutes,
      dateBookings,
    );
  }, [date, eventType, backendSlots, existingBookings]);

  const handleConfirm = () => {
    if (!selectedTime || !eventType) return;

    createBooking.mutate(
      {
        eventTypeId: eventType.id,
        inviteeName: name,
        inviteeEmail: email,
        startTime: selectedTime,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setStep("confirmed");
        },
      },
    );
  };

  // Format slot time for display
  const formatSlotTime = (isoString: string) => {
    return format(new Date(isoString), "h:mm a");
  };

  if (eventLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="body-sm text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!eventType) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="heading-lg mb-4">Event Not Found</h1>
            <p className="body-md text-muted-foreground mb-6">
              This event type doesn&apos;t exist or is no longer available.
            </p>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <CalendarIcon className="h-6 w-6" />
              <span className="heading-sm">SyncBooker</span>
            </Link>
          </div>
        </div>
      </header>
      {/* Banner */}
      <div className="h-32 w-full bg-muted lg:h-48 relative overflow-hidden">
        {eventType.user?.banner ? (
          <img
            src={eventType.user.banner}
            alt="User banner"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-primary/10 to-primary/5" />
        )}
      </div>

      {step === "confirmed" ? (
        <div className="flex items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background overflow-hidden border-2 border-background">
                {eventType.user?.displayPicture ? (
                  <img
                    src={eventType.user.displayPicture}
                    alt={eventType.user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <CalendarIcon className="h-8 w-8" />
                )}
              </div>
              <h1 className="heading-lg mb-4">Booking Confirmed!</h1>
              <p className="body-md text-muted-foreground mb-6">
                Your meeting has been scheduled. A confirmation email has been sent to {email}.
              </p>
              <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center justify-center gap-2 body-md">
                  <CalendarIcon className="h-4 w-4" />
                  {date && format(date, "EEEE, MMMM d, yyyy")}
                </div>
                <div className="flex items-center justify-center gap-2 body-md">
                  <Clock className="h-4 w-4" />
                  {selectedTime && formatSlotTime(selectedTime)}
                </div>
              </div>
              <Link href="/" className="mt-6 inline-block">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="relative -mt-20 mb-8 flex flex-col items-center lg:items-start lg:flex-row lg:gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg lg:h-32 lg:w-32">
              {eventType.user?.displayPicture ? (
                <img
                  src={eventType.user.displayPicture}
                  alt={eventType.user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <AvatarFallback className="text-2xl">
                  {eventType.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="mt-4 text-center lg:mt-16 lg:text-left">
              <h2 className="heading-md">{eventType.user?.name}</h2>
              <p className="body-sm text-muted-foreground">@{eventType.user?.username}</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left Column - Event Info */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h1 className="heading-lg">{eventType.title}</h1>
                      {eventType.color && (
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: eventType.color }}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-5 w-5" />
                      <span className="body-md">{eventType.durationMinutes} minutes</span>
                    </div>
                    {eventType.description && (
                      <p className="body-md text-muted-foreground">{eventType.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  {step === "select" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="heading-sm mb-4">Select a Date & Time</h3>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(newDate) => {
                            setDate(newDate);
                            setSelectedTime(null); // Reset selected time
                          }}
                          className="rounded-md border border-border"
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </div>

                      {date && (
                        <div>
                          <h4 className="label-md mb-3">Available Times</h4>
                          {slotsLoading ? (
                            <div className="flex justify-center py-8">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                          ) : slotsError ? (
                            <div className="text-center py-8">
                              <p className="body-md text-muted-foreground mb-2">
                                Failed to load available times
                              </p>
                              <p className="body-sm text-muted-foreground">
                                Please try again later
                              </p>
                            </div>
                          ) : slots.length > 0 ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2">
                                {slots.map((slot, index) => (
                                  <Button
                                    key={`${slot.startTime}-${index}`}
                                    variant={
                                      selectedTime === slot.startTime ? "default" : "outline"
                                    }
                                    onClick={() => setSelectedTime(slot.startTime)}
                                    className="w-full"
                                  >
                                    {formatSlotTime(slot.startTime)}
                                  </Button>
                                ))}
                              </div>
                              <p className="body-sm text-muted-foreground text-center">
                                {slots.length} {slots.length === 1 ? "slot" : "slots"} available
                              </p>
                            </div>
                          ) : date ? (
                            <div className="text-center py-8">
                              <p className="body-md text-muted-foreground mb-2">
                                No available times for this date
                              </p>
                              <p className="body-sm text-muted-foreground">
                                Please try a different date
                              </p>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {selectedTime && (
                        <Button className="w-full" onClick={() => setStep("details")}>
                          Continue
                        </Button>
                      )}
                    </div>
                  )}

                  {step === "details" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="heading-sm mb-2">Enter Your Details</h3>
                        <p className="body-sm text-muted-foreground">
                          We&apos;ll send a confirmation to your email
                        </p>
                      </div>

                      <div className="rounded-lg border border-border bg-muted/50 p-4">
                        <div className="flex items-center gap-2 body-md mb-1">
                          <CalendarIcon className="h-4 w-4" />
                          {date && format(date, "EEEE, MMMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 body-md">
                          <Clock className="h-4 w-4" />
                          {selectedTime && formatSlotTime(selectedTime)}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Additional Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            placeholder="Anything you'd like to share..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setStep("select")}
                          className="flex-1"
                          disabled={createBooking.isPending}
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleConfirm}
                          className="flex-1"
                          disabled={!name || !email || createBooking.isPending}
                        >
                          {createBooking.isPending ? "Confirming..." : "Confirm Booking"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
