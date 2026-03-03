"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Mail, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBookings, useApproveBooking, useRejectBooking, useDeleteBooking } from "@/hooks/use-bookings";
import type { Booking } from "@/types/booking";
import { RescheduleDialog } from "@/components/dashboard/reschedule-dialog";
import Link from "next/link";
import { format, isPast } from "date-fns";

export default function BookingsPage() {
  const { data: bookings, isLoading, error } = useBookings();
  const approveBooking = useApproveBooking();
  const rejectBooking = useRejectBooking();
  const deleteBooking = useDeleteBooking();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [bookingToReschedule, setBookingToReschedule] = useState<Booking | null>(null);

  const handleApprove = (id: string) => {
    approveBooking.mutate(id);
  };

  const handleReject = (id: string) => {
    rejectBooking.mutate(id);
  };

  const handleCancelClick = (id: string) => {
    setBookingToCancel(id);
    setCancelDialogOpen(true);
  };

  const handleRescheduleClick = (booking: Booking) => {
    setBookingToReschedule(booking);
    setRescheduleDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (bookingToCancel) {
      deleteBooking.mutate(bookingToCancel);
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const upcomingBookings = bookings?.filter(
    (b) =>
      (b.status === "confirmed" || b.status === "pending") &&
      !isPast(new Date(b.startTime))
  ) || [];

  const pastBookings = bookings?.filter(
    (b) =>
      b.status !== "cancelled" && isPast(new Date(b.startTime))
  ) || [];

  const cancelledBookings = bookings?.filter(
    (b) => b.status === "cancelled"
  ) || [];

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="body-md text-muted-foreground">
              Failed to load bookings. Please try again.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-56 mt-2" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1.5">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="heading-lg">Bookings</h1>
          <p className="body-md mt-2 text-muted-foreground">
            Manage all your scheduled meetings
          </p>
        </div>

        {bookings && bookings.length > 0 ? (
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
              <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelClick}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onReschedule={handleRescheduleClick}
                    isProcessing={approveBooking.isPending || rejectBooking.isPending}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="flex min-h-[200px] items-center justify-center p-8">
                    <p className="body-md text-muted-foreground">
                      No upcoming bookings
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelClick}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onReschedule={handleRescheduleClick}
                    isProcessing={approveBooking.isPending || rejectBooking.isPending}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="flex min-h-[200px] items-center justify-center p-8">
                    <p className="body-md text-muted-foreground">
                      No past bookings
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {cancelledBookings.length > 0 ? (
                cancelledBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelClick}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onReschedule={handleRescheduleClick}
                    isProcessing={approveBooking.isPending || rejectBooking.isPending}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="flex min-h-[200px] items-center justify-center p-8">
                    <p className="body-md text-muted-foreground">
                      No cancelled bookings
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelClick}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onReschedule={handleRescheduleClick}
                  isProcessing={approveBooking.isPending || rejectBooking.isPending}
                />
              ))}
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8">
              <div className="text-center">
                <h3 className="heading-sm mb-2">No bookings yet</h3>
                <p className="body-md text-muted-foreground">
                  Your bookings will appear here once people start booking time with
                  you
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {bookingToReschedule && (
        <RescheduleDialog
          booking={bookingToReschedule}
          open={rescheduleDialogOpen}
          onOpenChange={(open) => {
            setRescheduleDialogOpen(open);
            if (!open) setBookingToReschedule(null);
          }}
        />
      )}

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be
              undone and the invitee will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

function BookingCard({
  booking,
  onCancel,
  onApprove,
  onReject,
  onReschedule,
  isProcessing,
}: {
  booking: Booking;
  onCancel: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReschedule: (booking: Booking) => void;
  isProcessing: boolean;
}) {
  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  const isUpcoming = !isPast(startDate);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{getInitials(booking.inviteeName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="heading-sm hover:text-primary transition-colors">
                  <Link href={`/dashboard/bookings/${booking.id}`}>
                    {booking.eventType?.title || "Event"}
                  </Link>
                </h3>
                <p className="body-sm text-muted-foreground mt-1">
                  {booking.inviteeName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    booking.status === "confirmed"
                      ? "default"
                      : booking.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {booking.status}
                </Badge>
                {isUpcoming && booking.status !== "cancelled" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={isProcessing}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {booking.status === "pending" && (
                        <DropdownMenuItem
                          className="text-primary"
                          onClick={() => onApprove(booking.id)}
                        >
                          Approve Booking
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/bookings/${booking.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onReschedule(booking)}>
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onCancel(booking.id)}
                      >
                        {booking.status === "pending" ? "Reject" : "Cancel Booking"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 body-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(startDate, "MMM dd, yyyy")}
              </div>
              <div className="flex items-center gap-2 body-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
              </div>
              <div className="flex items-center gap-2 body-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {booking.inviteeEmail}
              </div>
            </div>

            {booking.notes && (
              <div className="rounded-lg bg-muted p-3">
                <p className="body-sm">
                  <span className="font-medium">Notes:</span> {booking.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}