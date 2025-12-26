import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";

const bookings = [
  {
    id: 1,
    title: "30 Min Consultation",
    attendee: "Sarah Johnson",
    email: "sarah@example.com",
    date: "Today",
    time: "2:00 PM - 2:30 PM",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Discovery Call",
    attendee: "Michael Chen",
    email: "michael@example.com",
    date: "Tomorrow",
    time: "10:00 AM - 10:30 AM",
    status: "confirmed",
  },
  {
    id: 3,
    title: "Follow-up Meeting",
    attendee: "Emily Davis",
    email: "emily@example.com",
    date: "Dec 28",
    time: "3:00 PM - 4:00 PM",
    status: "pending",
  },
];

export function UpcomingBookings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="heading-sm">Upcoming Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-start gap-4 rounded-lg border border-border p-4"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {booking.attendee
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="label-md">{booking.title}</p>
                  <Badge
                    variant={
                      booking.status === "confirmed" ? "default" : "secondary"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
                <p className="body-sm text-muted-foreground">
                  {booking.attendee} • {booking.email}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1 body-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {booking.date}
                  </div>
                  <div className="flex items-center gap-1 body-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {booking.time}
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