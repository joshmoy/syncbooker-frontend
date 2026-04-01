"use client";

import { useState, use } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Copy, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useEventType, useUpdateEventType } from "@/hooks/use-event-types";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { BookingCopyAssistant } from "@/components/dashboard/booking-copy-assistant";
import { BookingFaqAssistant } from "@/components/dashboard/booking-faq-assistant";
import { EventTypeGeneratorAssistant } from "@/components/dashboard/event-type-generator-assistant";
import type { EventType, EventTypeFaq } from "@/types/event-type";

const durations = [15, 30, 45, 60, 90, 120];

const colorOptions = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Amber" },
  { value: "#EF4444", label: "Red" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
  { value: "#6B7280", label: "Gray" },
];

export default function EventTypeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuthStore();
  const { data: eventType, isLoading } = useEventType(id);
  const updateEventType = useUpdateEventType(id);

  const getBookingLink = () => {
    const username = user?.username || user?.email?.split("@")[0] || eventType?.userId;
    return `${window.location.origin}/${username}/${id}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getBookingLink());
    toast.success("Booking link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="body-sm text-muted-foreground">Loading event type...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!eventType) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="body-sm text-muted-foreground">Event type not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <EventTypeDetailsForm
      eventType={eventType}
      onCopyLink={handleCopyLink}
      getBookingLink={getBookingLink}
      onSave={(payload) => updateEventType.mutate(payload)}
      isSaving={updateEventType.isPending}
    />
  );
}

function EventTypeDetailsForm({
  eventType,
  onSave,
  isSaving,
  getBookingLink,
  onCopyLink,
}: {
  eventType: EventType;
  onSave: (payload: {
    title: string;
    durationMinutes: number;
    description?: string;
    color?: string;
    faqs?: EventTypeFaq[];
  }) => void;
  isSaving: boolean;
  getBookingLink: () => string;
  onCopyLink: () => void;
}) {
  const [title, setTitle] = useState(eventType.title);
  const [duration, setDuration] = useState(eventType.durationMinutes.toString());
  const [description, setDescription] = useState(eventType.description || "");
  const [color, setColor] = useState(eventType.color || "#3B82F6");
  const [faqs, setFaqs] = useState<EventTypeFaq[]>(eventType.faqs || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      title,
      durationMinutes: parseInt(duration, 10),
      description: description || undefined,
      color: color || undefined,
      faqs,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-3">
          <Link href="/dashboard/events">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="heading-lg">Event Type Details</h1>
            <p className="body-md mt-2 text-muted-foreground">
              Update this event type directly from its details page
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="heading-sm">Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <EventTypeGeneratorAssistant
                    onApplySuggestion={(suggestion) => {
                      setTitle(suggestion.title);
                      setDuration(suggestion.durationMinutes.toString());
                      setDescription(suggestion.description);
                      setColor(suggestion.color);
                    }}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., 30 Min Consultation"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger id="duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.map((d) => (
                          <SelectItem key={d} value={d.toString()}>
                            {d} minutes
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <BookingCopyAssistant
                    title={title}
                    durationMinutes={parseInt(duration, 10)}
                    existingDescription={description}
                    onApplySuggestion={(suggestion) => {
                      setTitle(suggestion.title);
                      setDescription(suggestion.description);
                    }}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Select value={color} onValueChange={setColor}>
                      <SelectTrigger id="color">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-4 w-4 rounded-full"
                                style={{ backgroundColor: option.value }}
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this event is about..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                    />
                    <p className="body-sm text-muted-foreground">
                      This will be shown to people booking time with you
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">Booking Page FAQs</Label>
                      <p className="body-sm mt-1 text-muted-foreground">
                        Add answers to common questions visitors may have before booking.
                      </p>
                    </div>
                    <BookingFaqAssistant
                      title={title}
                      description={description}
                      onApplyFaqs={(nextFaqs) => setFaqs(nextFaqs)}
                    />
                    {faqs.length > 0 ? (
                      <div className="space-y-4">
                        {faqs.map((faq, index) => (
                          <div key={index} className="rounded-lg border border-border p-4">
                            <div className="space-y-2">
                              <Label htmlFor={`faq-question-${index}`}>Question {index + 1}</Label>
                              <Input
                                id={`faq-question-${index}`}
                                value={faq.question}
                                onChange={(e) => {
                                  const nextFaqs = [...faqs];
                                  nextFaqs[index] = {
                                    ...nextFaqs[index],
                                    question: e.target.value,
                                  };
                                  setFaqs(nextFaqs);
                                }}
                              />
                            </div>

                            <div className="mt-4 space-y-2">
                              <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                              <Textarea
                                id={`faq-answer-${index}`}
                                rows={3}
                                value={faq.answer}
                                onChange={(e) => {
                                  const nextFaqs = [...faqs];
                                  nextFaqs[index] = {
                                    ...nextFaqs[index],
                                    answer: e.target.value,
                                  };
                                  setFaqs(nextFaqs);
                                }}
                              />
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              className="mt-3 px-0 text-destructive hover:text-destructive"
                              onClick={() =>
                                setFaqs(faqs.filter((_, faqIndex) => faqIndex !== index))
                              }
                            >
                              Remove FAQ
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border p-4">
                        <p className="body-sm text-muted-foreground">
                          No FAQs yet. Generate them with AI above, or add them manually.
                        </p>
                      </div>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setFaqs([
                          ...faqs,
                          {
                            question: "",
                            answer: "",
                          },
                        ])
                      }
                    >
                      Add FAQ
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Link href="/dashboard/events">
                      <Button type="button" variant="outline">
                        Back to Events
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="heading-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="heading-sm">{title || "Event Title"}</h3>
                    {color && (
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
                    )}
                  </div>
                  <p className="body-sm mb-4 text-muted-foreground">{duration} minutes</p>
                  <p className="body-sm">
                    {description || "Event description will appear here..."}
                  </p>
                </div>
                <p className="body-sm text-muted-foreground">
                  This is how your event will appear to people booking with you
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="heading-sm">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Booking Link
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="body-sm text-muted-foreground">
                  Share this link with people who want to book time with you
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-border bg-muted/50 p-3">
                    <code className="body-sm break-all">{getBookingLink()}</code>
                  </div>
                  <Button variant="outline" size="icon" onClick={onCopyLink} title="Copy link">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
