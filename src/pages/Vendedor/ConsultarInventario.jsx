import { useEffect, useMemo, useState } from 'react';
import SellerLayout from '../../components/common/SellerLayout';
import StatusBadge from '../../components/common/StatusBadge';
import { getProducts } from '../../services/productService';
import { productCategoryOptions } from '../../validations/productValidation';

function stockTone(product) {
  if (product.stock === 0) return 'red';
  if (product.stock <= product.minStock) return 'amber';
  return 'green';
}

export default function ConsultarInventario() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [serviceError, setServiceError] = useState('');

  useEffect(() => {
    getProducts().then(setProducts).catch((error) => setServiceError(error.message));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesText = `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase().trim());
      const matchesCategory = category === 'Todas' || product.category === category;
      return matchesText && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <SellerLayout active="inventory">
      <div className="mx-auto flex min-h-screen max-w-[1120px] flex-col gap-5 p-6">
        <h1 className="text-2xl font-bold text-slate-950">Consultar Inventario</h1>
        {serviceError ? <p className="text-sm text-rose-600">{serviceError}</p> : null}

        <section className="grid gap-3 md:grid-cols-[1fr_130px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="form-input h-11" placeholder="Buscar producto..." />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="form-input h-11">
            <option>Todas</option>
            {productCategoryOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </section>

        <p className="text-sm text-slate-400">Solo lectura · {filteredProducts.length} productos</p>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <article key={product.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-3 grid h-24 place-items-center rounded-lg bg-slate-50">
                {product.image ? <img src={product.image} alt={product.name} className="h-20 object-contain" /> : <span className="text-xs text-slate-400">Sin imagen</span>}
              </div>
              <h2 className="font-semibold text-slate-950">{product.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{product.category}</p>
              <div className="mt-3 flex gap-1">
                {product.sizes.map((size) => <span key={size} className="rounded border border-slate-200 px-2 py-1 text-xs">{size}</span>)}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-sm text-slate-400">Stock</span>
                <StatusBadge tone={stockTone(product)}>{product.stock === 0 ? 'Agotado' : `${product.stock} uds`}</StatusBadge>
              </div>
            </article>
          ))}
        </section>
      </div>
    </SellerLayout>
  );
}
