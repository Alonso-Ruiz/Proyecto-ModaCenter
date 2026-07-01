import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/common/AdminLayout';
import InventoryEntryForm from '../../components/inventory/InventoryEntryForm';
import InventoryTable from '../../components/inventory/InventoryTable';
import { getProducts } from '../../services/productService';
import { createInventoryEntry, getInventoryProducts } from '../../services/inventoryService';
import {
  emptyInventoryEntryForm,
  normalizeInventoryEntryPayload,
  validateInventoryEntry,
} from '../../validations/inventoryValidation';

export default function Inventario() {
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('list');
  const [form, setForm] = useState(emptyInventoryEntryForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      setServiceError('');
      const [inventoryData, productData] = await Promise.all([getInventoryProducts(), getProducts()]);
      setInventoryProducts(inventoryData);
      setProducts(productData);
    } catch (error) {
      setServiceError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const summary = useMemo(() => {
    return {
      total: inventoryProducts.length,
      low: inventoryProducts.filter((item) => item.currentStock > 0 && item.currentStock <= item.minStock).length,
      empty: inventoryProducts.filter((item) => item.currentStock === 0).length,
    };
  }, [inventoryProducts]);

  function openForm() {
    setForm(emptyInventoryEntryForm);
    setErrors({});
    setNotice('');
    setView('form');
  }

  function updateForm(field, value) {
    setForm((current) => {
      if (field !== 'productId') return { ...current, [field]: value };

      const selectedProduct = products.find((product) => product.id === Number(value));
      return {
        ...current,
        productId: value,
        size: selectedProduct?.sizes?.[0] || '',
        color: selectedProduct?.color || '',
        costPrice: selectedProduct ? String(selectedProduct.costPrice) : current.costPrice,
      };
    });
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateInventoryEntry(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) return;

    try {
      await createInventoryEntry(normalizeInventoryEntryPayload(form));
      setNotice('Ingreso de mercaderia registrado correctamente.');
      setServiceError('');
      setView('list');
      await loadInventory();
    } catch (error) {
      setServiceError(error.message);
    }
  }

  return (
    <AdminLayout active="inventory">
      <div className="mx-auto flex min-h-full max-w-[1220px] flex-col gap-5">
        {view === 'list' ? (
          <>
            <header>
              <h1 className="text-2xl font-bold text-slate-950">Inventario</h1>
              {notice ? <p className="mt-1 text-sm text-emerald-700">{notice}</p> : null}
              {serviceError ? <p className="mt-1 text-sm text-rose-600">{serviceError}</p> : null}
            </header>

            <section className="grid gap-4 md:grid-cols-3">
              <article className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-xs text-slate-400">Total SKUs</p>
                <p className="mt-2 text-2xl text-slate-950">{summary.total}</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-xs text-slate-400">Stock Bajo</p>
                <p className="mt-2 text-2xl text-slate-950">{summary.low}</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="text-xs text-slate-400">Agotados</p>
                <p className="mt-2 text-2xl text-slate-950">{summary.empty}</p>
              </article>
            </section>

            {loading ? (
              <p className="text-sm text-slate-500">Cargando inventario...</p>
            ) : (
              <InventoryTable products={inventoryProducts} onRestock={openForm} />
            )}
          </>
        ) : (
          <InventoryEntryForm
            form={form}
            errors={errors}
            products={products}
            onChange={updateForm}
            onSubmit={handleSubmit}
            onCancel={() => setView('list')}
          />
        )}
      </div>
    </AdminLayout>
  );
}
