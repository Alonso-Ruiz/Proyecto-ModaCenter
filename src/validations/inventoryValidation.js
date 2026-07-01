export const emptyInventoryEntryForm = {
  date: '',
  supplier: '',
  productId: '',
  size: '',
  color: '',
  quantity: '',
  costPrice: '',
  invoiceNumber: '',
  notes: '',
};

export function validateInventoryEntry(entry) {
  const errors = {};
  const quantity = Number(entry.quantity);
  const costPrice = Number(entry.costPrice);

  if (!entry.date) errors.date = 'La fecha es obligatoria.';
  if (!entry.supplier.trim()) errors.supplier = 'El proveedor es obligatorio.';
  if (!entry.productId) errors.productId = 'Selecciona un producto.';
  if (!entry.size) errors.size = 'Selecciona una talla.';
  if (!entry.color) errors.color = 'Selecciona un color.';
  if (!Number.isInteger(quantity) || quantity <= 0) errors.quantity = 'La cantidad debe ser mayor a 0.';
  if (!Number.isFinite(costPrice) || costPrice <= 0) errors.costPrice = 'El costo debe ser mayor a 0.';
  if (!entry.invoiceNumber.trim()) errors.invoiceNumber = 'La factura o guia es obligatoria.';

  return errors;
}

export function normalizeInventoryEntryPayload(entry) {
  return {
    ...entry,
    productId: Number(entry.productId),
    quantity: Number(entry.quantity),
    costPrice: Number(entry.costPrice),
    supplier: entry.supplier.trim(),
    invoiceNumber: entry.invoiceNumber.trim(),
    notes: entry.notes.trim(),
  };
}
