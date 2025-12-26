"use client";

import { useState } from "react";
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
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useCreateEventType } from "@/hooks/use-event-types";
import { useAuthStore } from "@/store/auth";

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

export default function NewEventPage() {
  const { user } = useAuthStore();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("30");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const createEventType = useCreateEventType();

  const getBookingLinkPreview = () => {
    const username = user?.username || user?.email?.split('@')[0] || 'your-username';
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/{username}/event-id`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createEventType.mutate({
      title,
      durationMinutes: parseInt(duration),
      description: description || undefined,
      color: color || undefined,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/events">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="heading-lg">Create Event Type</h1>
            <p className="body-md mt-2 text-muted-foreground">
              Set up a new event type for bookings
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

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={createEventType.isPending}
                    >
                      {createEventType.isPending
                        ? "Creating..."
                        : "Create Event Type"}
                    </Button>
                    <Link href="/dashboard/events">
                      <Button type="button" variant="outline">
                        Cancel
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
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    )}
                  </div>
                  <p className="body-sm text-muted-foreground mb-4">
                    {duration} minutes
                  </p>
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
                <CardTitle className="heading-sm">Booking Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="body-sm text-muted-foreground">
                  After creating this event, you'll get a unique link to share:
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                  <LinkIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <code className="body-sm text-muted-foreground break-all">
                    {getBookingLinkPreview()}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}