import { apiClient } from './apiClient';

function normalizeSale(sale) {
  return {
    id: sale.id,
    saleNumber: sale.saleNumber ?? sale.numero_venta ?? '',
    date: sale.date ?? sale.fecha ?? '',
    total: Number(sale.total ?? 0),
    paymentMethod: sale.paymentMethod ?? sale.metodo_pago ?? '',
    status: sale.status ?? sale.estado ?? '',
    sellerName: sale.sellerName ?? sale.vendedor_nombre ?? '',
    productsSummary: sale.productsSummary ?? sale.productos ?? '',
    items: (sale.items ?? sale.detalles ?? []).map((item) => ({
      id: item.id,
      productId: item.productId ?? item.producto_id,
      product: item.product ?? item.producto ?? item.nombre ?? '',
      quantity: Number(item.quantity ?? item.cantidad ?? 0),
      unitPrice: Number(item.unitPrice ?? item.precio_unitario ?? 0),
      subtotal: Number(item.subtotal ?? 0),
    })),
  };
}

export async function createSale(sale) {
  const createdSale = await apiClient('/ventas', {
    method: 'POST',
    body: JSON.stringify({
      vendedor_id: sale.sellerId,
      metodo_pago: sale.paymentMethod,
      items: sale.items.map((item) => ({
        producto_id: item.productId,
        cantidad: item.quantity,
        precio_unitario: item.unitPrice,
      })),
    }),
  });

  return normalizeSale(createdSale);
}

export async function getSales(filters = {}) {
  const params = new URLSearchParams();
  if (filters.from) params.set('desde', filters.from);
  if (filters.to) params.set('hasta', filters.to);
  if (filters.search) params.set('buscar', filters.search);

  const query = params.toString() ? `?${params.toString()}` : '';
  const sales = await apiClient(`/ventas${query}`);
  return sales.map(normalizeSale);
}
