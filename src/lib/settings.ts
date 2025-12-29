import apiInstance from "./api";
import {
  UpdateSettingsRequest,
  SettingsResponse,
  UpdateSettingsResponse,
  UploadImageResponse,
} from "@/types/settings";

/**
 * Settings service for managing user settings
 */
export const settingsService = {
  /**
   * Get user settings
   */
  async getUserSettings(): Promise<SettingsResponse> {
    const response = await apiInstance.get<SettingsResponse>("/settings");
    return response.data;
  },

  /**
   * Update user settings
   */
  async updateSettings(
    data: UpdateSettingsRequest
  ): Promise<UpdateSettingsResponse> {
    const response = await apiInstance.put<UpdateSettingsResponse>(
      "/settings",
      data
    );
    return response.data;
  },

  /**
   * Upload display picture
   */
  async uploadDisplayPicture(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiInstance.post<UploadImageResponse>(
      "/settings/upload/display-picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Upload banner
   */
  async uploadBanner(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiInstance.post<UploadImageResponse>(
      "/settings/upload/banner",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Remove display picture
   */
  async removeDisplayPicture(): Promise<{ message: string }> {
    const response = await apiInstance.delete<{ message: string }>(
      "/settings/display-picture"
    );
    return response.data;
  },

  /**
   * Remove banner
   */
  async removeBanner(): Promise<{ message: string }> {
    const response = await apiInstance.delete<{ message: string }>(
      "/settings/banner"
    );
    return response.data;
  },
};