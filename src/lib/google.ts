import apiInstance from "./api";

export const googleService = {
  async getAuthUrl(redirectTo?: string): Promise<{ url: string }> {
    const response = await apiInstance.get<{ url: string }>("/google/auth-url", {
      params: redirectTo ? { redirectTo } : undefined,
    });
    return response.data;
  },
};
