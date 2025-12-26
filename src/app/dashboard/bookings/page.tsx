import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Mail, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const allBookings = [
  {
    id: 1,
    title: "30 Min Consultation",
    attendee: "Sarah Johnson",
    email: "sarah@example.com",
    date: "Dec 26, 2024",
    time: "2:00 PM - 2:30 PM",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Discovery Call",
    attendee: "Michael Chen",
    email: "michael@example.com",
    date: "Dec 27, 2024",
    time: "10:00 AM - 10:30 AM",
    status: "confirmed",
  },
  {
    id: 3,
    title: "Follow-up Meeting",
    attendee: "Emily Davis",
    email: "emily@example.com",
    date: "Dec 28, 2024",
    time: "3:00 PM - 4:00 PM",
    status: "pending",
  },
  {
    id: 4,
    title: "30 Min Consultation",
    attendee: "David Wilson",
    email: "david@example.com",
    date: "Dec 20, 2024",
    time: "11:00 AM - 11:30 AM",
    status: "completed",
  },
  {
    id: 5,
    title: "Discovery Call",
    attendee: "Lisa Anderson",
    email: "lisa@example.com",
    date: "Dec 18, 2024",
    time: "2:00 PM - 2:30 PM",
    status: "cancelled",
  },
];

export default function BookingsPage() {
  const upcomingBookings = allBookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const pastBookings = allBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="heading-lg">Bookings</h1>
          <p className="body-md mt-2 text-muted-foreground">
            Manage all your scheduled meetings
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {allBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function BookingCard({ booking }: { booking: (typeof allBookings)[0] }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {booking.attendee
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="heading-sm">{booking.title}</h3>
                <p className="body-sm text-muted-foreground mt-1">
                  {booking.attendee}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    booking.status === "confirmed"
                      ? "default"
                      : booking.status === "completed"
                        ? "secondary"
                        : booking.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                  }
                >
                  {booking.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 body-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {booking.date}
              </div>
              <div className="flex items-center gap-2 body-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {booking.time}
              </div>
              <div className="flex items-center gap-2 body-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {booking.email}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}