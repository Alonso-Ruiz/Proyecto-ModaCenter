import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/common/AdminLayout';
import { BarChart, DonutChart, HorizontalBarChart } from '../../components/common/Charts';
import ReportTable from '../../components/reports/ReportTable';
import { getReportMetrics, getReports } from '../../services/reportService';
import { reportCategoryOptions } from '../../validations/reportValidation';

export default function Reportes() {
  const [reports, setReports] = useState([]);
  const [metrics, setMetrics] = useState({ byDate: [], byCategory: [], bestProducts: [] });
  const [filters, setFilters] = useState({ from: '', to: '', category: 'Todas' });
  const [activeTab, setActiveTab] = useState('Ventas por Fecha');
  const [serviceError, setServiceError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports(nextFilters = filters) {
    try {
      setLoading(true);
      setServiceError('');
      const [reportData, metricData] = await Promise.all([getReports(nextFilters), getReportMetrics(nextFilters)]);
      setReports(reportData);
      setMetrics(metricData);
    } catch (error) {
      setServiceError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const totals = useMemo(() => {
    return {
      sales: reports.length,
      amount: reports.reduce((sum, report) => sum + report.total, 0),
      completed: reports.filter((report) => report.status === 'Completado').length,
    };
  }, [reports]);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function downloadExcel() {
    const rows = reports
      .map((report) => `
        <tr>
          <td>${report.date}</td>
          <td>${report.saleNumber}</td>
          <td>${report.category}</td>
          <td>${report.total.toFixed(2)}</td>
          <td>${report.paymentMethod}</td>
          <td>${report.status}</td>
        </tr>
      `)
      .join('');
    const table = `
      <html>
        <head><meta charset="UTF-8" /></head>
        <body>
          <table border="1">
            <thead>
              <tr>
                <th>Fecha</th><th>N Venta</th><th>Categoria</th><th>Total</th><th>Metodo</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;
    const url = URL.createObjectURL(new Blob([table], { type: 'application/vnd.ms-excel;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reportes.xls';
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadPdf() {
    const rows = reports
      .map((report) => `
        <tr>
          <td>${report.date}</td>
          <td>${report.saleNumber}</td>
          <td>${report.category}</td>
          <td>S/ ${report.total.toLocaleString('es-PE')}</td>
          <td>${report.paymentMethod}</td>
          <td>${report.status}</td>
        </tr>
      `)
      .join('');
    const reportWindow = window.open('', '_blank', 'width=900,height=700');
    if (!reportWindow) return;

    reportWindow.document.write(`
      <html>
        <head>
          <title>Reporte de ventas</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { margin-bottom: 4px; }
            p { color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            th, td { border: 1px solid #dbe3ef; padding: 10px; text-align: left; }
            th { background: #f1f5f9; }
            .summary { display: flex; gap: 16px; margin-top: 18px; }
            .box { border: 1px solid #dbe3ef; padding: 12px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Reporte de ventas</h1>
          <p>ModaCenter - informacion filtrada del modulo Reportes</p>
          <div class="summary">
            <div class="box"><strong>${totals.sales}</strong><br />Ventas</div>
            <div class="box"><strong>S/ ${totals.amount.toLocaleString('es-PE')}</strong><br />Total</div>
            <div class="box"><strong>${totals.completed}</strong><br />Completadas</div>
          </div>
          <table>
            <thead>
              <tr><th>Fecha</th><th>N Venta</th><th>Categoria</th><th>Total</th><th>Metodo</th><th>Estado</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    reportWindow.document.close();
  }

  function renderActiveChart() {
    if (activeTab === 'Ventas por Fecha') return <BarChart data={metrics.byDate} valuePrefix="S/ " />;
    if (activeTab === 'Por Categoria') return <DonutChart data={metrics.byCategory} valuePrefix="S/ " />;
    return <HorizontalBarChart data={metrics.bestProducts} />;
  }

  return (
    <AdminLayout active="reports">
      <div className="mx-auto flex min-h-full max-w-[1220px] flex-col gap-5">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-950">Reportes</h1>
                {serviceError ? <p className="mt-1 text-sm text-rose-600">{serviceError}</p> : null}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={downloadExcel} className="btn-secondary h-11">Excel</button>
                <button type="button" onClick={downloadPdf} className="btn-secondary h-11">PDF</button>
              </div>
            </header>

            <section className="grid gap-3 md:grid-cols-3">
              <article className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-400">Ventas filtradas</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{totals.sales}</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-400">Total vendido</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">S/ {totals.amount.toLocaleString('es-PE')}</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-400">Completadas</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{totals.completed}</p>
              </article>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                <label className="block text-xs font-semibold text-slate-400">
                  Desde
                  <input type="date" value={filters.from} onChange={(event) => updateFilter('from', event.target.value)} className="form-input mt-1 h-11" />
                </label>
                <label className="block text-xs font-semibold text-slate-400">
                  Hasta
                  <input type="date" value={filters.to} onChange={(event) => updateFilter('to', event.target.value)} className="form-input mt-1 h-11" />
                </label>
                <label className="block text-xs font-semibold text-slate-400">
                  Categoria
                  <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)} className="form-input mt-1 h-11">
                    <option>Todas</option>
                    {reportCategoryOptions.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={() => loadReports()} className="btn-primary h-11">
                  Aplicar
                </button>
              </div>
            </section>

            <nav className="flex gap-8 border-b border-slate-200 text-sm font-semibold">
              {['Ventas por Fecha', 'Por Categoria', 'Mas Vendidos'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 ${activeTab === tab ? 'border-b-2 border-slate-950 text-slate-950' : 'text-slate-400'}`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs text-slate-400">{activeTab}</p>
              {renderActiveChart()}
            </section>

            {loading ? <p className="text-sm text-slate-500">Cargando reportes...</p> : <ReportTable reports={reports} showActions={false} />}
      </div>
    </AdminLayout>
  );
}
