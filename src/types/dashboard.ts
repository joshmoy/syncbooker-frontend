export interface DashboardStats {
  totalBookings: number;
  weekBookings: number;
  eventTypesCount: number;
  uniqueVisitors: number;
  totalBookingsChange?: string;
  weekBookingsChange?: string;
  uniqueVisitorsChange?: string;
}

export interface DashboardStatsResponse {
  stats: DashboardStats;
}