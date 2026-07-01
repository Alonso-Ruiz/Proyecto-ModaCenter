import { useEffect, useMemo, useState } from 'react';
import SellerLayout from '../../components/common/SellerLayout';
import StatusBadge from '../../components/common/StatusBadge';
import { getSession } from '../../services/authService';
import { getProducts } from '../../services/productService';
import { createSale } from '../../services/salesService';

function money(value) {
  return `S/ ${Number(value || 0).toLocaleString('es-PE')}`;
}

function stockTone(stock) {
  if (stock === 0) return 'red';
  if (stock <= 5) return 'amber';
  return 'green';
}

export default function PuntoVenta() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [receipt, setReceipt] = useState(null);
  const [serviceError, setServiceError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setProducts(await getProducts());
    } catch (error) {
      setServiceError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase().trim()));
  }, [products, search]);

  const total = cart.reduce((sum, item) => sum + item.quantity * item.salePrice, 0);

  function addToCart(product) {
    if (product.stock <= 0) return;

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(productId, amount) {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== productId) return item;
          return { ...item, quantity: Math.max(0, Math.min(item.quantity + amount, item.stock)) };
        })
        .filter((item) => item.quantity > 0),
    );
  }

  async function processSale() {
    if (!cart.length) {
      setServiceError('Agrega productos al carrito.');
      return;
    }

    try {
      const session = getSession();
      const sale = await createSale({
        sellerId: session?.user?.id,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.salePrice,
        })),
      });
      setReceipt(sale);
      setCart([]);
      setServiceError('');
      await loadProducts();
    } catch (error) {
      setServiceError(error.message);
    }
  }

  return (
    <SellerLayout active="pos">
      <div className="grid min-h-screen lg:grid-cols-[1fr_282px]">
        <section className="p-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mb-4 h-11 w-full max-w-[315px] rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none"
            placeholder="Buscar producto..."
          />
          {serviceError ? <p className="mb-3 text-sm text-rose-600">{serviceError}</p> : null}
          {loading ? <p className="text-sm text-slate-500">Cargando productos...</p> : null}

          <div className="grid max-w-[650px] gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 disabled:opacity-50"
              >
                <div className="mb-3 grid h-16 place-items-center rounded-lg bg-slate-50">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-14 max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-400">Sin imagen</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                <p className="mt-2 font-bold text-slate-950">{money(product.salePrice)}</p>
                <div className="mt-2">
                  <StatusBadge tone={stockTone(product.stock)}>{product.stock === 0 ? 'Agotado' : `${product.stock} disp.`}</StatusBadge>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="flex min-h-screen flex-col border-l border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4">
            <h2 className="font-semibold text-slate-950">Carrito</h2>
            <p className="text-xs text-slate-400">{cart.length} producto(s)</p>
          </div>

          <div className="flex-1 divide-y divide-slate-100 overflow-auto p-4">
            {cart.map((item) => (
              <div key={item.id} className="py-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate text-slate-950">{item.name}</p>
                    <p className="text-xs text-slate-400">{money(item.salePrice)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => changeQuantity(item.id, -1)} className="qty-btn">-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => changeQuantity(item.id, 1)} className="qty-btn">+</button>
                  </div>
                  <p className="w-16 text-right">{money(item.quantity * item.salePrice)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="mb-3 flex justify-between">
              <span className="text-slate-500">Total</span>
              <strong>{money(total)}</strong>
            </div>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {['Efectivo', 'Tarjeta', 'Yape'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-md border px-3 py-2 text-sm ${paymentMethod === method ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
                >
                  {method}
                </button>
              ))}
            </div>
            <button type="button" onClick={processSale} className="btn-primary w-full">
              Procesar Venta
            </button>
          </div>
        </aside>
      </div>

      {receipt ? (
        <div className="fixed inset-0 grid place-items-center bg-black/30 p-4">
          <section className="w-full max-w-[318px] rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">ModaCenter</h2>
                <p className="text-xs text-slate-400">Recibo de venta</p>
              </div>
              <button type="button" onClick={() => setReceipt(null)} className="text-slate-300">x</button>
            </div>
            <div className="mb-4 flex justify-between border-b border-dashed border-slate-200 pb-3 text-xs text-slate-400">
              <span>Venta {receipt.saleNumber}</span>
              <span>{receipt.date}</span>
            </div>
            <div className="space-y-2 border-b border-dashed border-slate-200 pb-3 text-sm">
              {receipt.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3">
                  <span>{item.product} x {item.quantity}</span>
                  <span>{money(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>{money(receipt.total)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Metodo: {receipt.paymentMethod}</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => window.print()} className="btn-secondary">Imprimir</button>
              <button type="button" onClick={() => setReceipt(null)} className="btn-primary">Nueva Venta</button>
            </div>
          </section>
        </div>
      ) : null}
    </SellerLayout>
  );
}
