import { apiFetch } from "./client";
import type { DashboardOverviewData } from "./types";

export async function fetchDashboardOverview() {
  return apiFetch<DashboardOverviewData>("/dashboard/overview");
}
