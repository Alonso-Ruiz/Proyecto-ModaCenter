import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/common/AdminLayout';
import ProductForm from '../../components/products/ProductForm';
import ProductTable from '../../components/products/ProductTable';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../services/productService';
import {
  emptyProductForm,
  mapProductToForm,
  normalizeProductPayload,
  productCategoryOptions,
  validateProduct,
} from '../../validations/productValidation';


export default function Productos() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [stockFilter, setStockFilter] = useState('Todos');
  const [view, setView] = useState('list');
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyProductForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setServiceError('');
      setProducts(await getProducts());
    } catch (error) {
      setProducts([]);
      setServiceError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = `${product.name} ${product.category} ${product.color} ${product.sizes.join(' ')}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase().trim());
      const matchesCategory = categoryFilter === 'Todas' || product.category === categoryFilter;
      const matchesStock =
        stockFilter === 'Todos' ||
        (stockFilter === 'Disponibles' && Number(product.stock) > Number(product.minStock)) ||
        (stockFilter === 'Stock bajo' && Number(product.stock) > 0 && Number(product.stock) <= Number(product.minStock)) ||
        (stockFilter === 'Agotados' && Number(product.stock) === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  function openCreateForm() {
    setEditingProduct(null);
    setForm(emptyProductForm);
    setErrors({});
    setNotice('');
    setView('form');
  }

  function openEditForm(product) {
    setEditingProduct(product);
    setForm(mapProductToForm(product));
    setErrors({});
    setNotice('');
    setView('form');
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  function toggleSize(size) {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.includes(size)
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size],
    }));
    setErrors((current) => ({ ...current, sizes: '' }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, image: 'Solo se permiten imagenes.' }));
      return;
    }

    if (file.size > 1500000) {
      setErrors((current) => ({ ...current, image: 'La imagen no debe superar 1.5 MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateForm('image', reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateProduct(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) return;

    try {
      const payload = normalizeProductPayload(form);
      const savedProduct = editingProduct
        ? await updateProduct(editingProduct.id, payload)
        : await createProduct(payload);

      setProducts((current) =>
        editingProduct
          ? current.map((product) => (product.id === editingProduct.id ? savedProduct : product))
          : [savedProduct, ...current],
      );
      setNotice(editingProduct ? 'Producto actualizado correctamente.' : 'Producto registrado correctamente.');
      setServiceError('');
      setView('list');
    } catch (error) {
      setServiceError(error.message);
    }
  }

  async function handleDelete(product) {
    const shouldDelete = window.confirm(`Eliminar "${product.name}"?`);
    if (!shouldDelete) return;

    try {
      await deleteProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setNotice('Producto eliminado correctamente.');
      setServiceError('');
    } catch (error) {
      setServiceError(error.message);
    }
  }

  return (
    <AdminLayout active="products">
      <div className="mx-auto flex min-h-full max-w-[1220px] flex-col gap-4">
        {view === 'list' ? (
          <>
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-950">Productos</h1>
                {notice ? <p className="mt-1 text-sm text-emerald-700">{notice}</p> : null}
                {serviceError ? <p className="mt-1 text-sm text-rose-600">{serviceError}</p> : null}
              </div>
              <button type="button" onClick={openCreateForm} className="btn-primary h-11">
                + Nuevo Producto
              </button>
            </header>

            <section className="flex flex-col gap-3 lg:flex-row">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-500"
                placeholder="Buscar producto..."
              />
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="filter-input">
                <option>Todas</option>
                {productCategoryOptions.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)} className="filter-input">
                <option>Todos</option>
                <option>Disponibles</option>
                <option>Stock bajo</option>
                <option>Agotados</option>
              </select>
            </section>

            {loading ? <p className="text-sm text-slate-500">Cargando productos...</p> : <ProductTable products={filteredProducts} onEdit={openEditForm} onDelete={handleDelete} />}
          </>
        ) : (
          <ProductForm
            title={editingProduct ? 'Actualizar Producto' : 'Registrar Producto'}
            form={form}
            errors={errors}
            onChange={updateForm}
            onToggleSize={toggleSize}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            onCancel={() => setView('list')}
          />
        )}
      </div>
    </AdminLayout>
  );
}
