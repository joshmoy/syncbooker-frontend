import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Copy, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const eventTypes = [
  {
    id: 1,
    title: "30 Min Consultation",
    duration: 30,
    description: "Quick consultation call to discuss your needs",
    bookings: 12,
    status: "active",
  },
  {
    id: 2,
    title: "Discovery Call",
    duration: 30,
    description: "Initial discovery call for new clients",
    bookings: 8,
    status: "active",
  },
  {
    id: 3,
    title: "Follow-up Meeting",
    duration: 60,
    description: "Extended follow-up session",
    bookings: 4,
    status: "active",
  },
];

export default function EventTypesPage() {
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="heading-sm">{event.title}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="body-sm text-muted-foreground">
                          {event.duration} min
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="body-sm text-muted-foreground">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="secondary">{event.bookings} bookings</Badge>
                    <Button variant="ghost" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </Button>
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