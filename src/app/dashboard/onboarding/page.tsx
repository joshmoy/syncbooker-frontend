"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, CheckCircle2, Clock3, Link2, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { googleService } from "@/lib/google";
import { useOnboardingStatus, type OnboardingStep } from "@/hooks/use-onboarding";

const stepConfig: Array<{
  key: Exclude<OnboardingStep, "complete">;
  title: string;
  description: string;
  icon: typeof Link2;
}> = [
  {
    key: "google",
    title: "Connect Google Meet",
    description: "Connect Google Calendar so new bookings can create Meet links automatically.",
    icon: Link2,
  },
  {
    key: "availability",
    title: "Set your availability",
    description: "Choose when people can book with you before you publish your first event.",
    icon: Clock3,
  },
  {
    key: "event",
    title: "Create your first event",
    description: "Finish setup by creating the first booking page you can share with others.",
    icon: Calendar,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const {
    isLoading,
    hasGoogleConnected,
    hasAvailability,
    hasEventTypes,
    nextStep,
  } = useOnboardingStatus();
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("google_connected") === "true") {
      toast.success("Google Calendar connected successfully!");
      searchParams.delete("google_connected");
      const nextUrl = searchParams.toString()
        ? `${window.location.pathname}?${searchParams.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, "", nextUrl);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && hasEventTypes) {
      router.replace("/dashboard");
    }
  }, [hasEventTypes, isLoading, router]);

  const handlePrimaryAction = async () => {
    if (nextStep === "google") {
      try {
        setIsConnectingGoogle(true);
        const { url } = await googleService.getAuthUrl("/dashboard/onboarding");
        window.location.href = url;
      } catch {
        toast.error("Failed to get Google authentication URL");
        setIsConnectingGoogle(false);
      }
      return;
    }

    if (nextStep === "availability") {
      router.push("/dashboard/availability?onboarding=1");
      return;
    }

    if (nextStep === "event") {
      router.push("/dashboard/events/new?onboarding=1");
    }
  };

  const getStepState = (step: Exclude<OnboardingStep, "complete">) => {
    if (step === "google") {
      return hasGoogleConnected ? "complete" : "current";
    }

    if (step === "availability") {
      if (!hasGoogleConnected) return "upcoming";
      return hasAvailability ? "complete" : "current";
    }

    if (!hasGoogleConnected || !hasAvailability) {
      return "upcoming";
    }

    return hasEventTypes ? "complete" : "current";
  };

  const primaryLabel =
    nextStep === "google"
      ? "Connect Google Meet"
      : nextStep === "availability"
        ? "Set Availability"
        : "Create First Event";

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div>
              <h1 className="heading-sm">Preparing your setup</h1>
              <p className="body-sm mt-2 text-muted-foreground">
                We&apos;re checking what&apos;s already configured.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="label-md text-primary">First-time setup</p>
          <h1 className="heading-lg">Let&apos;s get your booking workflow ready</h1>
          <p className="body-md max-w-2xl text-muted-foreground">
            We&apos;ll connect Google Meet, confirm when you&apos;re available, and then help you
            publish your first event type.
          </p>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="heading-sm">
              {nextStep === "google" && "Start by connecting Google Meet"}
              {nextStep === "availability" && "Google is connected. Next, set your availability"}
              {nextStep === "event" && "Availability is ready. Now create your first event"}
            </CardTitle>
            <CardDescription>
              {nextStep === "google" &&
                "This lets SyncBooker add Google Meet links to bookings automatically."}
              {nextStep === "availability" &&
                "Your booking page needs open hours before anyone can reserve time with you."}
              {nextStep === "event" &&
                "Your first event gives people a shareable page to book with you."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="body-sm text-muted-foreground">
              Step {nextStep === "google" ? "1" : nextStep === "availability" ? "2" : "3"} of 3
            </div>
            <Button onClick={handlePrimaryAction} disabled={isConnectingGoogle}>
              {isConnectingGoogle ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                primaryLabel
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {stepConfig.map((step, index) => {
            const Icon = step.icon;
            const state = getStepState(step.key);

            return (
              <Card
                key={step.key}
                className={cn(
                  "transition-colors",
                  state === "current" && "border-primary shadow-sm",
                  state === "complete" && "border-green-200 bg-green-50/70",
                  state === "upcoming" && "opacity-75"
                )}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border",
                        state === "current" && "border-primary bg-primary/10 text-primary",
                        state === "complete" && "border-green-200 bg-green-100 text-green-700",
                        state === "upcoming" && "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      {state === "complete" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="body-sm text-muted-foreground">0{index + 1}</span>
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="heading-sm">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
