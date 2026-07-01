import { apiClient } from './apiClient';

function normalizeMetricItem(item) {
  return {
    label: item.label ?? item.fecha ?? '',
    total: Number(item.total ?? 0),
  };
}

export async function getDashboardMetrics() {
  const metrics = await apiClient('/dashboard');

  return {
    summary: {
      todaySales: Number(metrics.summary?.todaySales ?? 0),
      monthProfit: Number(metrics.summary?.monthProfit ?? 0),
      activeProducts: Number(metrics.summary?.activeProducts ?? 0),
      stockAlerts: Number(metrics.summary?.stockAlerts ?? 0),
    },
    salesByDate: (metrics.salesByDate ?? []).map(normalizeMetricItem),
    salesByCategory: (metrics.salesByCategory ?? []).map(normalizeMetricItem),
    bestProducts: (metrics.bestProducts ?? []).map(normalizeMetricItem),
  };
}
