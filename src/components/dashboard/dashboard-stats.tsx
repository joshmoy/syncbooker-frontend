"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard";

export function DashboardStats() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      name: "Total Bookings",
      value: stats?.totalBookings.toString() || "0",
      change: `${stats?.totalBookingsChange || "0%"} this week`,
      icon: Calendar,
    },
    {
      name: "This Week",
      value: stats?.weekBookings.toString() || "0",
      change: stats?.weekBookingsChange || "0",
      icon: Clock,
    },
    {
      name: "Event Types",
      value: stats?.eventTypesCount.toString() || "0",
      change: "Active",
      icon: TrendingUp,
    },
    {
      name: "Unique Visitors",
      value: stats?.uniqueVisitors.toString() || "0",
      change: stats?.uniqueVisitorsChange || "0%",
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.name}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="body-sm text-muted-foreground">{stat.name}</p>
                <p className="heading-md">{stat.value}</p>
                <p className="body-sm text-muted-foreground">{stat.change}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
