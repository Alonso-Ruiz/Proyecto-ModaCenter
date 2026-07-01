export const reportCategoryOptions = ['Polo', 'Pantalon', 'Chaqueta', 'Camisa', 'Vestido', 'Falda', 'Short', 'Otros'];
export const paymentMethodOptions = ['Efectivo', 'Tarjeta', 'Yape', 'Plin', 'Transferencia'];
export const reportStatusOptions = ['Completado', 'Pendiente', 'Anulado'];

export const emptyReportForm = {
  date: '',
  saleNumber: '',
  category: 'Polo',
  total: '',
  paymentMethod: 'Efectivo',
  status: 'Completado',
  notes: '',
};

export function mapReportToForm(report) {
  return {
    date: report.date,
    saleNumber: report.saleNumber,
    category: report.category,
    total: String(report.total),
    paymentMethod: report.paymentMethod,
    status: report.status,
    notes: report.notes || '',
  };
}

export function validateReport(report, reports = [], currentReportId = null) {
  const errors = {};
  const total = Number(report.total);
  const duplicatedSale = reports.some(
    (item) => item.saleNumber.toLowerCase() === report.saleNumber.trim().toLowerCase() && item.id !== currentReportId,
  );

  if (!report.date) errors.date = 'La fecha es obligatoria.';
  if (!report.saleNumber.trim()) {
    errors.saleNumber = 'El numero de venta es obligatorio.';
  } else if (duplicatedSale) {
    errors.saleNumber = 'Este numero de venta ya existe.';
  }
  if (!report.category) errors.category = 'Selecciona una categoria.';
  if (!Number.isFinite(total) || total <= 0) errors.total = 'El total debe ser mayor a 0.';
  if (!report.paymentMethod) errors.paymentMethod = 'Selecciona un metodo.';
  if (!report.status) errors.status = 'Selecciona un estado.';

  return errors;
}

export function normalizeReportPayload(report) {
  return {
    ...report,
    saleNumber: report.saleNumber.trim(),
    total: Number(report.total),
    notes: report.notes.trim(),
  };
}
