import apiInstance from "./api";

export const googleService = {
  async getAuthUrl(): Promise<{ url: string }> {
    const response = await apiInstance.get<{ url: string }>("/google/auth-url");
    return response.data;
  },
};
