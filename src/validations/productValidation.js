export const productCategoryOptions = ['Polo', 'Pantalon', 'Chaqueta', 'Camisa', 'Vestido', 'Falda', 'Short'];
export const productColorOptions = ['Blanco', 'Negro', 'Azul', 'Gris', 'Marino', 'Rojo', 'Verde', 'Beige'];
export const productSizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

export const emptyProductForm = {
  name: '',
  category: 'Polo',
  description: '',
  costPrice: '',
  salePrice: '',
  sizes: [],
  color: 'Blanco',
  stock: '',
  minStock: '',
  image: '',
};

export function mapProductToForm(product) {
  return {
    name: product.name,
    category: product.category,
    description: product.description,
    costPrice: String(product.costPrice),
    salePrice: String(product.salePrice),
    sizes: product.sizes,
    color: product.color,
    stock: String(product.stock),
    minStock: String(product.minStock),
    image: product.image || '',
  };
}

export function validateProduct(product) {
  const errors = {};
  const costPrice = Number(product.costPrice);
  const salePrice = Number(product.salePrice);
  const stock = Number(product.stock);
  const minStock = Number(product.minStock);

  if (!product.name.trim()) errors.name = 'El nombre es obligatorio.';
  if (product.name.trim().length > 70) errors.name = 'Maximo 70 caracteres.';
  if (!product.category) errors.category = 'Selecciona una categoria.';
  if (!product.description.trim()) errors.description = 'La descripcion es obligatoria.';
  if (!Number.isFinite(costPrice) || costPrice <= 0) errors.costPrice = 'Ingresa un costo mayor a 0.';
  if (!Number.isFinite(salePrice) || salePrice <= 0) errors.salePrice = 'Ingresa un precio mayor a 0.';
  if (Number.isFinite(costPrice) && Number.isFinite(salePrice) && salePrice <= costPrice) {
    errors.salePrice = 'El precio de venta debe ser mayor al costo.';
  }
  if (!product.sizes.length) errors.sizes = 'Selecciona al menos una talla.';
  if (!product.color) errors.color = 'Selecciona un color.';
  if (!Number.isInteger(stock) || stock < 0) errors.stock = 'El stock debe ser un entero positivo.';
  if (!Number.isInteger(minStock) || minStock < 0) errors.minStock = 'El stock minimo debe ser un entero positivo.';
  if (Number.isInteger(stock) && Number.isInteger(minStock) && minStock > stock && stock > 0) {
    errors.minStock = 'El stock minimo no debe superar al stock actual.';
  }

  return errors;
}

export function normalizeProductPayload(product) {
  return {
    ...product,
    name: product.name.trim(),
    description: product.description.trim(),
    costPrice: Number(product.costPrice),
    salePrice: Number(product.salePrice),
    stock: Number(product.stock),
    minStock: Number(product.minStock),
  };
}

