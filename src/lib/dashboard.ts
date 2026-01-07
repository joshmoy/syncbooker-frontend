import apiInstance from "./api";
import { DashboardStats, DashboardStatsResponse } from "@/types/dashboard";

/**
 * Dashboard service for fetching dashboard statistics
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiInstance.get<DashboardStatsResponse>("/dashboard/stats");
    return response.data.stats;
  },
};