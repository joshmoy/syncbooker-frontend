import { useMemo } from "react";
import { useSettings } from "@/hooks/use-settings";
import { useAvailabilities } from "@/hooks/use-availability";
import { useEventTypes } from "@/hooks/use-event-types";

export type OnboardingStep = "google" | "availability" | "event" | "complete";

export function useOnboardingStatus() {
  const settingsQuery = useSettings();
  const availabilitiesQuery = useAvailabilities();
  const eventTypesQuery = useEventTypes();

  return useMemo(() => {
    const isLoading =
      settingsQuery.isLoading ||
      availabilitiesQuery.isLoading ||
      eventTypesQuery.isLoading;

    const hasGoogleConnected = !!settingsQuery.data?.user.googleConnected;
    const hasAvailability = (availabilitiesQuery.data?.length ?? 0) > 0;
    const hasEventTypes = (eventTypesQuery.data?.length ?? 0) > 0;

    let nextStep: OnboardingStep = "complete";

    if (!hasEventTypes) {
      if (!hasGoogleConnected) {
        nextStep = "google";
      } else if (!hasAvailability) {
        nextStep = "availability";
      } else {
        nextStep = "event";
      }
    }

    return {
      isLoading,
      hasGoogleConnected,
      hasAvailability,
      hasEventTypes,
      nextStep,
      needsOnboarding: !hasEventTypes,
    };
  }, [
    settingsQuery.isLoading,
    settingsQuery.data?.user.googleConnected,
    availabilitiesQuery.isLoading,
    availabilitiesQuery.data,
    eventTypesQuery.isLoading,
    eventTypesQuery.data,
  ]);
}
