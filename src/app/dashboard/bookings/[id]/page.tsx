"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Mail, 
  User, 
  Video, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  ExternalLink,
  Plus
} from "lucide-react";
import { useBooking, useApproveBooking, useRejectBooking, useGenerateMeetingLink } from "@/hooks/use-bookings";
import { format, isPast } from "date-fns";

export default function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: booking, isLoading, error } = useBooking(id);
  const approveBooking = useApproveBooking();
  const rejectBooking = useRejectBooking();
  const generateMeetingLink = useGenerateMeetingLink();

  const handleApprove = () => {
    approveBooking.mutate(id);
  };

  const handleReject = () => {
    rejectBooking.mutate(id);
  };

  const handleGenerateMeetingLink = () => {
    generateMeetingLink.mutate(id);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !booking) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="heading-md">Booking not found</h2>
          <Button onClick={() => router.push("/dashboard/bookings")}>
            Back to Bookings
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-success-foreground">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending Approval</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isProcessing = approveBooking.isPending || rejectBooking.isPending;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="heading-lg">Booking Details</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="heading-sm">Meeting Information</CardTitle>
                {getStatusBadge(booking.status)}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-primary/10 p-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</p>
                      <p className="body-md font-semibold">
                        {format(new Date(booking.startTime), "EEEE, MMMM do, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</p>
                      <p className="body-md font-semibold">
                        {format(new Date(booking.startTime), "h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-4">Event Type</h4>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="font-medium text-primary">{booking.eventType?.title || "Custom Event"}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {booking.eventType?.durationMinutes} minutes duration
                    </p>
                  </div>
                </div>

                {booking.meetingLink ? (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-4">Location</h4>
                    <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Google Meet</p>
                          <p className="text-xs text-muted-foreground">Meeting link generated</p>
                        </div>
                      </div>
                      <Button asChild size="sm">
                        <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                          Join Meeting <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : booking.status === "confirmed" && !isPast(new Date(booking.startTime)) && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-4">Location</h4>
                    <div className="flex items-center justify-between rounded-lg border border-dashed p-4">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">No meeting link</p>
                          <p className="text-xs text-muted-foreground">Generate a Google Meet link for this booking</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleGenerateMeetingLink}
                        disabled={generateMeetingLink.isPending}
                      >
                        {generateMeetingLink.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-2" />
                        ) : (
                          <Plus className="h-3 w-3 mr-2" />
                        )}
                        Generate Link
                      </Button>
                    </div>
                  </div>
                )}

                {booking.notes && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-2">Notes from Invitee</h4>
                    <p className="body-sm text-muted-foreground bg-muted p-4 rounded-lg italic">
                      "{booking.notes}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {booking.status === "pending" && !isPast(new Date(booking.startTime)) && (
              <div className="flex gap-4">
                <Button 
                  className="flex-1 h-12" 
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  {approveBooking.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Approve Booking
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 text-destructive border-destructive/20 hover:bg-destructive/10"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  {rejectBooking.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Reject Booking
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="heading-sm">Invitee Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Name</p>
                    <p className="body-sm font-medium">{booking.inviteeName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Email</p>
                    <p className="body-sm font-medium truncate max-w-[200px]">{booking.inviteeEmail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="heading-sm">History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Created</p>
                    <p className="text-xs">{format(new Date(booking.createdAt), "MMM d, yyyy h:mm a")}</p>
                  </div>
                </div>
                {booking.status !== "pending" && (
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full ${booking.status === "confirmed" ? "bg-success" : "bg-destructive"}`} />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
                      </p>
                      {/* We don't have updatedAt in the UI currently, but we could add it if needed */}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
