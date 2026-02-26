"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { UpcomingBookings } from "@/components/dashboard/upcoming-bookings";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { useAuthStore } from "@/store/auth";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="heading-lg">Dashboard</h1>
          <p className="body-md mt-2 text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! Here&apos;s an overview of
            your scheduling activity.
          </p>
        </div>

        <DashboardStats />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <UpcomingBookings />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
