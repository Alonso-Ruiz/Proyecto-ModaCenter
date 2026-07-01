import { useEffect, useState } from 'react';
import SellerLayout from '../../components/common/SellerLayout';
import StatusBadge from '../../components/common/StatusBadge';
import { getSales } from '../../services/salesService';

function money(value) {
  return `S/ ${Number(value || 0).toLocaleString('es-PE')}`;
}

function formatDate(date) {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${day}/${month}`;
}

export default function HistorialVentas() {
  const [sales, setSales] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '', search: '' });
  const [selectedSale, setSelectedSale] = useState(null);
  const [serviceError, setServiceError] = useState('');

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales(nextFilters = filters) {
    try {
      setSales(await getSales(nextFilters));
      setServiceError('');
    } catch (error) {
      setServiceError(error.message);
    }
  }

  function updateFilter(field, value) {
    const nextFilters = { ...filters, [field]: value };
    setFilters(nextFilters);
    loadSales(nextFilters);
  }

  return (
    <SellerLayout active="history">
      <div className="mx-auto flex min-h-screen max-w-[1120px] flex-col gap-5 p-6">
        <h1 className="text-2xl font-bold text-slate-950">Historial de Ventas</h1>
        {serviceError ? <p className="text-sm text-rose-600">{serviceError}</p> : null}

        <section className="grid gap-3 md:grid-cols-[160px_160px_1fr]">
          <input type="date" value={filters.from} onChange={(event) => updateFilter('from', event.target.value)} className="form-input h-11" />
          <input type="date" value={filters.to} onChange={(event) => updateFilter('to', event.target.value)} className="form-input h-11" />
          <input
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            className="form-input h-11"
            placeholder="Buscar N° de venta..."
          />
        </section>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="table-th">N° Venta</th>
                  <th className="table-th">Fecha</th>
                  <th className="table-th">Productos</th>
                  <th className="table-th">Total</th>
                  <th className="table-th">Metodo</th>
                  <th className="table-th">Estado</th>
                  <th className="table-th">Accion</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-5 py-3 text-slate-950">{sale.saleNumber}</td>
                    <td className="px-5 py-3">{formatDate(sale.date)}</td>
                    <td className="px-5 py-3">{sale.productsSummary}</td>
                    <td className="px-5 py-3">{money(sale.total)}</td>
                    <td className="px-5 py-3">{sale.paymentMethod}</td>
                    <td className="px-5 py-3"><StatusBadge tone={sale.status === 'Completado' ? 'green' : 'red'}>{sale.status}</StatusBadge></td>
                    <td className="px-5 py-3">
                      <button type="button" onClick={() => setSelectedSale(sale)} className="rounded border border-blue-200 px-3 py-1 text-blue-600">
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
                {!sales.length ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-8 text-center text-sm text-slate-500">No hay ventas registradas.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedSale ? (
        <div className="fixed inset-0 grid place-items-center bg-black/30 p-4">
          <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex justify-between">
              <h2 className="font-semibold">Detalle {selectedSale.saleNumber}</h2>
              <button type="button" onClick={() => setSelectedSale(null)}>x</button>
            </div>
            <div className="space-y-2 text-sm">
              {selectedSale.items.map((item) => (
                <div key={item.id} className="flex justify-between border-b border-slate-100 pb-2">
                  <span>{item.product} x {item.quantity}</span>
                  <span>{money(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>{money(selectedSale.total)}</span>
            </div>
          </section>
        </div>
      ) : null}
    </SellerLayout>
  );
}
