"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Copy, MoreVertical, Loader2 } from "lucide-react";
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
import { useEventTypes, useDeleteEventType } from "@/hooks/use-event-types";
import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import { toast } from "sonner";
import type { EventType } from "@/types/event-type";

export default function EventTypesPage() {
  const { data: eventTypes, isLoading, error } = useEventTypes();
  const { user } = useAuthStore();
  const deleteEventType = useDeleteEventType();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const handleCopyLink = (eventType: EventType) => {
    // Use username if available, fallback to user ID
    const username = user?.username || user?.email?.split('@')[0] || eventType.userId;
    const link = `${window.location.origin}/${username}/${eventType.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Booking link copied to clipboard!");
  };

  const handleDeleteClick = (id: string) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      deleteEventType.mutate(eventToDelete);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="body-md text-muted-foreground">
              Failed to load event types. Please try again.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-lg">Event Types</h1>
            <p className="body-md mt-2 text-muted-foreground">
              Create and manage your event types
            </p>
          </div>
          <Link href="/dashboard/events/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Event Type
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="body-sm text-muted-foreground">
                Loading event types...
              </p>
            </div>
          </div>
        ) : eventTypes && eventTypes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eventTypes.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="heading-sm">{event.title}</h3>
                          {event.color && (
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: event.color }}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="body-sm text-muted-foreground">
                            {event.durationMinutes} min
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/events/${event.id}/edit`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteClick(event.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="body-sm text-muted-foreground">
                      {event.description || "No description"}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="secondary">Active</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(event)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8">
              <div className="text-center">
                <h3 className="heading-sm mb-2">No event types yet</h3>
                <p className="body-md mb-6 text-muted-foreground">
                  Create your first event type to start accepting bookings
                </p>
                <Link href="/dashboard/events/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event Type
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event type? This action
              cannot be undone and may affect existing bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}