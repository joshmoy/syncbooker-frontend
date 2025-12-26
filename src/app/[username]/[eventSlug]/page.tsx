"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, Clock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const availableSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "04:00 PM",
];

export default function BookingPage({
  params,
}: {
  params: { username: string; eventSlug: string };
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "details" | "confirmed">("select");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    toast.success("Booking confirmed! Check your email for details.");
    setStep("confirmed");
  };

  if (step === "confirmed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background">
              <CalendarIcon className="h-8 w-8" />
            </div>
            <h1 className="heading-lg mb-4">Booking Confirmed!</h1>
            <p className="body-md text-muted-foreground mb-6">
              Your meeting has been scheduled. A confirmation email has been sent
              to {email}.
            </p>
            <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center justify-center gap-2 body-md">
                <CalendarIcon className="h-4 w-4" />
                {date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center justify-center gap-2 body-md">
                <Clock className="h-4 w-4" />
                {selectedTime}
              </div>
            </div>
            <Link href="/" className="mt-6 inline-block">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Column - Event Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6 flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="heading-sm">John Doe</h2>
                    <p className="body-sm text-muted-foreground">
                      @{params.username}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="heading-lg">30 Min Consultation</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span className="body-md">30 minutes</span>
                  </div>
                  <p className="body-md text-muted-foreground">
                    Quick consultation call to discuss your needs and see how we
                    can work together.
                  </p>
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
                        onSelect={setDate}
                        className="rounded-md border border-border"
                        disabled={(date) => date < new Date()}
                      />
                    </div>

                    {date && (
                      <div>
                        <h4 className="label-md mb-3">Available Times</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant={
                                selectedTime === slot ? "default" : "outline"
                              }
                              onClick={() => setSelectedTime(slot)}
                              className="w-full"
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTime && (
                      <Button
                        className="w-full"
                        onClick={() => setStep("details")}
                      >
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
                        We'll send a confirmation to your email
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <div className="flex items-center gap-2 body-md mb-1">
                        <CalendarIcon className="h-4 w-4" />
                        {date?.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2 body-md">
                        <Clock className="h-4 w-4" />
                        {selectedTime}
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
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleConfirm}
                        className="flex-1"
                        disabled={!name || !email}
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}