import { apiClient } from './apiClient';

function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.name ?? product.nombre ?? '',
    category: product.category ?? product.categoria ?? '',
    description: product.description ?? product.descripcion ?? '',
    costPrice: Number(product.costPrice ?? product.precio_costo ?? 0),
    salePrice: Number(product.salePrice ?? product.precio_venta ?? 0),
    sizes: Array.isArray(product.sizes)
      ? product.sizes
      : Array.isArray(product.tallas)
        ? product.tallas
        : JSON.parse(product.tallas || '[]'),
    color: product.color ?? '',
    stock: Number(product.stock ?? 0),
    minStock: Number(product.minStock ?? product.stock_minimo ?? 0),
    image: product.image ?? product.imagen ?? '',
  };
}

function toApiProduct(product) {
  return {
    nombre: product.name.trim(),
    categoria: product.category,
    descripcion: product.description.trim(),
    precio_costo: Number(product.costPrice),
    precio_venta: Number(product.salePrice),
    tallas: product.sizes,
    color: product.color,
    stock: Number(product.stock),
    stock_minimo: Number(product.minStock),
    imagen: product.image || null,
  };
}

export async function getProducts() {
  const products = await apiClient('/productos');
  return products.map(normalizeProduct);
}

export async function createProduct(product) {
  const createdProduct = await apiClient('/productos', {
    method: 'POST',
    body: JSON.stringify(toApiProduct(product)),
  });

  return normalizeProduct(createdProduct);
}

export async function updateProduct(id, product) {
  const updatedProduct = await apiClient(`/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toApiProduct(product)),
  });

  return normalizeProduct(updatedProduct);
}

export async function deleteProduct(id) {
  await apiClient(`/productos/${id}`, {
    method: 'DELETE',
  });
}
