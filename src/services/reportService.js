import { apiClient } from './apiClient';

function normalizeReport(report) {
  return {
    id: report.id,
    date: report.date ?? report.fecha ?? '',
    saleNumber: report.saleNumber ?? report.numero_venta ?? '',
    category: report.category ?? report.categoria ?? '',
    total: Number(report.total ?? 0),
    paymentMethod: report.paymentMethod ?? report.metodo_pago ?? '',
    status: report.status ?? report.estado ?? '',
    notes: report.notes ?? report.notas ?? '',
  };
}

function toApiReport(report) {
  return {
    fecha: report.date,
    numero_venta: report.saleNumber.trim(),
    categoria: report.category,
    total: Number(report.total),
    metodo_pago: report.paymentMethod,
    estado: report.status,
    notas: report.notes.trim(),
  };
}

export async function getReports(filters = {}) {
  const params = new URLSearchParams();
  if (filters.from) params.set('desde', filters.from);
  if (filters.to) params.set('hasta', filters.to);
  if (filters.category && filters.category !== 'Todas') params.set('categoria', filters.category);

  const query = params.toString() ? `?${params.toString()}` : '';
  const reports = await apiClient(`/reportes${query}`);
  return reports.map(normalizeReport);
}

export async function getReportMetrics(filters = {}) {
  const params = new URLSearchParams();
  if (filters.from) params.set('desde', filters.from);
  if (filters.to) params.set('hasta', filters.to);
  if (filters.category && filters.category !== 'Todas') params.set('categoria', filters.category);

  const query = params.toString() ? `?${params.toString()}` : '';
  const metrics = await apiClient(`/reportes/metricas${query}`);

  return {
    byDate: (metrics.byDate ?? []).map((item) => ({ label: item.label, total: Number(item.total ?? 0) })),
    byCategory: (metrics.byCategory ?? []).map((item) => ({ label: item.label, total: Number(item.total ?? 0) })),
    bestProducts: (metrics.bestProducts ?? []).map((item) => ({ label: item.label, total: Number(item.total ?? 0) })),
  };
}

export async function createReport(report) {
  const createdReport = await apiClient('/reportes', {
    method: 'POST',
    body: JSON.stringify(toApiReport(report)),
  });

  return normalizeReport(createdReport);
}

export async function updateReport(id, report) {
  const updatedReport = await apiClient(`/reportes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toApiReport(report)),
  });

  return normalizeReport(updatedReport);
}

export async function deleteReport(id) {
  await apiClient(`/reportes/${id}`, { method: 'DELETE' });
}
