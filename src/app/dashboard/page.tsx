"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { UpcomingBookings } from "@/components/dashboard/upcoming-bookings";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Loader2 } from "lucide-react";
import { useOnboardingStatus } from "@/hooks/use-onboarding";
import { useAuthStore } from "@/store/auth";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isLoading: onboardingLoading, needsOnboarding } = useOnboardingStatus();

  useEffect(() => {
    if (!onboardingLoading && needsOnboarding) {
      router.replace("/dashboard/onboarding");
    }
  }, [needsOnboarding, onboardingLoading, router]);

  if (onboardingLoading || needsOnboarding) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div>
              <h1 className="heading-sm">Preparing your workspace</h1>
              <p className="body-sm mt-2 text-muted-foreground">
                We&apos;re checking whether you still need the first-time setup flow.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
