import { useEffect, useState } from 'react';
import { BarChart, DonutChart, HorizontalBarChart } from '../../components/common/Charts';
import AdminLayout from '../../components/common/AdminLayout';
import { getDashboardMetrics } from '../../services/dashboardService';

const emptyMetrics = {
  summary: {
    todaySales: 0,
    monthProfit: 0,
    activeProducts: 0,
    stockAlerts: 0,
  },
  salesByDate: [],
  salesByCategory: [],
  bestProducts: [],
};

function money(value) {
  return `S/ ${Number(value || 0).toLocaleString('es-PE')}`;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState(emptyMetrics);
  const [serviceError, setServiceError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardMetrics()
      .then((data) => {
        setMetrics(data);
        setServiceError('');
      })
      .catch((error) => setServiceError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Ventas Hoy', value: money(metrics.summary.todaySales), hint: 'Total vendido durante el dia' },
    { label: 'Ganancias del Mes', value: money(metrics.summary.monthProfit), hint: 'Utilidad estimada por ventas del mes' },
    { label: 'Productos Activos', value: metrics.summary.activeProducts, hint: 'Productos con stock disponible' },
    { label: 'Alertas de Stock', value: metrics.summary.stockAlerts, hint: 'Productos agotados o bajo minimo' },
  ];

  return (
    <AdminLayout active="dashboard">
      <div className="mx-auto flex min-h-full max-w-[1220px] flex-col gap-4">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          {loading ? <p className="mt-1 text-sm text-slate-400">Cargando metricas...</p> : null}
          {serviceError ? <p className="mt-1 text-sm text-rose-600">{serviceError}</p> : null}
        </header>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <article key={card.label} className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-400">{card.label}</p>
              <p className="mt-2 text-2xl font-bold leading-tight text-slate-950">{card.value}</p>
              <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">Ventas por periodo</h2>
            <BarChart data={metrics.salesByDate} valuePrefix="S/ " />
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">Ventas por categoria</h2>
            <DonutChart data={metrics.salesByCategory} valuePrefix="S/ " />
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">Productos mas vendidos</h2>
            <HorizontalBarChart data={metrics.bestProducts} />
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">Actividad de tienda</h2>
            <div className="grid gap-3 text-sm text-slate-600">
              <p>Las metricas se actualizan con cada venta procesada desde Punto de Venta.</p>
              <p>Las alertas de stock toman el stock actual y el stock minimo de cada producto.</p>
              <p>La ganancia mensual se calcula con precio de venta menos costo por unidad.</p>
            </div>
          </article>
        </section>
      </div>
    </AdminLayout>
  );
}
