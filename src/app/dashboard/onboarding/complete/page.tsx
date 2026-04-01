"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Link2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOnboardingStatus } from "@/hooks/use-onboarding";

export default function OnboardingCompletePage() {
  const router = useRouter();
  const { isLoading, hasEventTypes } = useOnboardingStatus();

  useEffect(() => {
    if (isLoading) return;

    if (!hasEventTypes) {
      router.replace("/dashboard/onboarding");
      return;
    }
  }, [hasEventTypes, isLoading, router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div>
              <h1 className="heading-sm">Finishing your setup</h1>
              <p className="body-sm mt-2 text-muted-foreground">
                We&apos;re confirming that your first event is ready.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden border-green-200 bg-linear-to-br from-green-50 via-white to-emerald-50 shadow-sm">
            <CardContent className="relative p-8 md:p-10">
              <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-r from-green-200/30 via-emerald-200/20 to-transparent" />
              <div className="relative space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                    Setup complete
                  </Badge>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700 shadow-sm">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-3">
                    <h1 className="heading-lg">You&apos;re ready to start booking</h1>
                    <p className="body-md max-w-2xl text-muted-foreground">
                      Everything is in place. Your calendar is connected, your availability is set,
                      and your first event is live.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-green-200/70 bg-white/80 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <Link2 className="h-5 w-5" />
                    </div>
                    <p className="label-md">Google Meet connected</p>
                    <p className="body-sm mt-1 text-muted-foreground">
                      New bookings can generate meeting links automatically.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-green-200/70 bg-white/80 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <p className="label-md">Availability saved</p>
                    <p className="body-sm mt-1 text-muted-foreground">
                      Visitors can now see when you&apos;re open for meetings.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-green-200/70 bg-white/80 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <p className="label-md">First event created</p>
                    <p className="body-sm mt-1 text-muted-foreground">
                      You now have a booking type ready to share.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" onClick={() => router.replace("/dashboard")}>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.replace("/dashboard/events")}
                  >
                    View Event Types
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle className="heading-sm">What happens next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="label-md">Share your booking page</p>
                <p className="body-sm mt-1 text-muted-foreground">
                  Send your link to clients, candidates, or teammates so they can start booking.
                </p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="label-md">Fine-tune your setup</p>
                <p className="body-sm mt-1 text-muted-foreground">
                  You can add more event types, edit availability, or reconnect integrations any
                  time from the dashboard.
                </p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="label-md">Stay in control</p>
                <p className="body-sm mt-1 text-muted-foreground">
                  Nothing else moves automatically from here. You decide what to do next.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
