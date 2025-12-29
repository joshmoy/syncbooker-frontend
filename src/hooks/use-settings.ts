import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService } from "@/lib/settings";
import { useAuthStore } from "@/store/auth";
import type { UpdateSettingsRequest } from "@/types/settings";

// Query keys
export const settingsKeys = {
  all: ["settings"] as const,
  detail: () => [...settingsKeys.all, "detail"] as const,
};

/**
 * Hook to fetch user settings
 */
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.detail(),
    queryFn: () => settingsService.getUserSettings(),
  });
}

/**
 * Hook to update user settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateSettingsRequest) =>
      settingsService.updateSettings(data),
    onSuccess: (response) => {
      // Update local user state
      setUser(response.user);
      // Invalidate settings query
      queryClient.invalidateQueries({ queryKey: settingsKeys.detail() });
      toast.success(response.message || "Settings updated successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update settings. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to upload display picture
 */
export function useUploadDisplayPicture() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (file: File) => settingsService.uploadDisplayPicture(file),
    onSuccess: (response) => {
      // Update user in auth store with new display picture
      if (user && response.displayPicture) {
        setUser({
          ...user,
          displayPicture: response.displayPicture,
        });
      }
      // Invalidate settings to refetch with new image URL
      queryClient.invalidateQueries({ queryKey: settingsKeys.detail() });
      toast.success(response.message || "Display picture uploaded successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload display picture. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to upload banner
 */
export function useUploadBanner() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (file: File) => settingsService.uploadBanner(file),
    onSuccess: (response) => {
      // Update user in auth store with new banner
      if (user && response.banner) {
        setUser({
          ...user,
          banner: response.banner,
        });
      }
      // Invalidate settings to refetch with new image URL
      queryClient.invalidateQueries({ queryKey: settingsKeys.detail() });
      toast.success(response.message || "Banner uploaded successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload banner. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to remove display picture
 */
export function useRemoveDisplayPicture() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: () => settingsService.removeDisplayPicture(),
    onSuccess: (response) => {
      // Update user in auth store to remove display picture
      if (user) {
        setUser({
          ...user,
          displayPicture: null,
        });
      }
      // Invalidate settings to refetch
      queryClient.invalidateQueries({ queryKey: settingsKeys.detail() });
      toast.success(response.message || "Display picture removed successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove display picture. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Hook to remove banner
 */
export function useRemoveBanner() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: () => settingsService.removeBanner(),
    onSuccess: (response) => {
      // Update user in auth store to remove banner
      if (user) {
        setUser({
          ...user,
          banner: null,
        });
      }
      // Invalidate settings to refetch
      queryClient.invalidateQueries({ queryKey: settingsKeys.detail() });
      toast.success(response.message || "Banner removed successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove banner. Please try again.";
      toast.error(message);
    },
  });
}