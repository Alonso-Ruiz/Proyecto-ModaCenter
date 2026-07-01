import { apiClient } from './apiClient';

function normalizeInventoryProduct(item) {
  return {
    id: item.id,
    productId: item.productId ?? item.producto_id ?? item.id,
    product: item.product ?? item.producto ?? item.nombre ?? '',
    category: item.category ?? item.categoria ?? '',
    size: item.size ?? item.talla ?? '',
    color: item.color ?? '',
    currentStock: Number(item.currentStock ?? item.stock_actual ?? item.stock ?? 0),
    minStock: Number(item.minStock ?? item.stock_minimo ?? 0),
  };
}

function normalizeInventoryEntry(entry) {
  return {
    id: entry.id,
    date: entry.date ?? entry.fecha ?? '',
    supplier: entry.supplier ?? entry.proveedor ?? '',
    productId: Number(entry.productId ?? entry.producto_id ?? 0),
    product: entry.product ?? entry.producto ?? '',
    size: entry.size ?? entry.talla ?? '',
    color: entry.color ?? '',
    quantity: Number(entry.quantity ?? entry.cantidad ?? 0),
    costPrice: Number(entry.costPrice ?? entry.precio_costo ?? 0),
    invoiceNumber: entry.invoiceNumber ?? entry.numero_factura ?? '',
    notes: entry.notes ?? entry.notas ?? '',
  };
}

function toApiEntry(entry) {
  return {
    fecha: entry.date,
    proveedor: entry.supplier.trim(),
    producto_id: Number(entry.productId),
    talla: entry.size,
    color: entry.color,
    cantidad: Number(entry.quantity),
    precio_costo: Number(entry.costPrice),
    numero_factura: entry.invoiceNumber.trim(),
    notas: entry.notes.trim(),
  };
}

export async function getInventoryProducts() {
  const products = await apiClient('/inventario/productos');
  return products.map(normalizeInventoryProduct);
}

export async function getInventoryEntries() {
  const entries = await apiClient('/inventario/ingresos');
  return entries.map(normalizeInventoryEntry);
}

export async function createInventoryEntry(entry) {
  const createdEntry = await apiClient('/inventario/ingresos', {
    method: 'POST',
    body: JSON.stringify(toApiEntry(entry)),
  });

  return normalizeInventoryEntry(createdEntry);
}
