"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock } from "lucide-react";
import { useBookings } from "@/hooks/use-bookings";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { Booking } from "@/types/booking";

function formatBookingDate(dateString: string): string {
  const date = parseISO(dateString);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d");
}

function formatBookingTime(startTime: string, endTime: string): string {
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
}

function getUpcomingBookings(bookings: Booking[]): Booking[] {
  const now = new Date();
  return bookings
    .filter((booking) => {
      const startTime = parseISO(booking.startTime);
      return startTime >= now && booking.status !== "cancelled";
    })
    .sort((a, b) => {
      const dateA = parseISO(a.startTime);
      const dateB = parseISO(b.startTime);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);
}

export function UpcomingBookings() {
  const { data: bookings, isLoading } = useBookings();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="heading-sm">Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-lg border border-border p-4"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingBookings = getUpcomingBookings(bookings || []);

  if (upcomingBookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="heading-sm">Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="body-md text-muted-foreground">
              No upcoming bookings
            </p>
            <p className="body-sm text-muted-foreground mt-1">
              Your upcoming bookings will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="heading-sm">Upcoming Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-start gap-4 rounded-lg border border-border p-4"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {booking.inviteeName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="label-md">
                    {booking.eventType?.title || "Meeting"}
                  </p>
                  <Badge
                    variant={
                      booking.status === "confirmed" ? "default" : "secondary"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
                <p className="body-sm text-muted-foreground">
                  {booking.inviteeName} • {booking.inviteeEmail}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1 body-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatBookingDate(booking.startTime)}
                  </div>
                  <div className="flex items-center gap-1 body-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatBookingTime(booking.startTime, booking.endTime)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}