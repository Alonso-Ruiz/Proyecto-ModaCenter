import { Link } from 'react-router-dom';

const statCards = [
  { label: 'Ventas Hoy', value: 'S/ 3,840' },
  { label: 'Ganancias del Mes', value: 'S/ 28,650' },
  { label: 'Productos Activos', value: '247' },
  { label: 'Alertas de Stock', value: '8' },
];

const lowStock = [
  { product: 'Polo Basico S', tag: '2 uds', tagColor: 'bg-amber-100 text-amber-700' },
  { product: 'Jean XS', tag: '1 ud', tagColor: 'bg-amber-100 text-amber-700' },
  { product: 'Chaqueta M', tag: 'Agotado', tagColor: 'bg-rose-100 text-rose-600' },
];

const bestSellers = [
  { product: 'Polo Basico Blanco', value: 90 },
  { product: 'Jean Slim Azul', value: 75 },
  { product: 'Chaqueta Deportiva', value: 55 },
];

export default function AdminDashboardView() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="grid min-h-screen grid-cols-1 lg:h-screen lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-col bg-gradient-to-b from-[#0e1d39] to-[#09162d] p-3 text-slate-200 lg:overflow-hidden">

          <div className="mb-4 flex items-center gap-2 rounded-lg bg-white/5 p-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-slate-600 text-[10px] font-bold">MC</div>
            <div>
              <p className="text-sm font-semibold leading-tight">ModaCenter</p>
              <p className="text-xs text-slate-400">Administrador</p>
            </div>
          </div>

          <nav className="space-y-1 text-[11px]">
            <a className="block rounded-lg bg-white/15 px-3 py-2 font-semibold text-white" href="#">
              Dashboard
            </a>
            <a className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10" href="#">
              Productos
            </a>
            <a className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10" href="#">
              Inventario
            </a>
            <a className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10" href="#">
              Reportes
            </a>
            <a className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10" href="#">
              Vendedores
            </a>
          </nav>

          <div className="mt-auto space-y-2 pt-5">
            <div className="flex items-center gap-2 px-2 text-xs text-slate-300">
              <div className="grid h-6 w-6 place-items-center rounded-full bg-slate-500 font-semibold">A</div>
              <span>Admin Usuario</span>
            </div>
            <Link to="/login" className="block rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10">
              Cerrar Sesion
            </Link>
          </div>
        </aside>

        <main className="p-3 md:p-4 lg:h-screen lg:overflow-hidden lg:p-4">
          <div className="mx-auto flex h-full max-w-[1220px] flex-col gap-3">
          <h1 className="mb-1 text-3xl font-bold text-slate-900">Dashboard</h1>

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <article key={card.label} className="rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs text-slate-400">{card.label}</p>
                <p className="mt-1 text-[16px] font-semibold leading-tight text-slate-800">{card.value}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-3 xl:grid-cols-2">
            <article className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
              <header className="mb-3 flex items-center justify-between">
                <h2 className="text-[23px] font-medium">Ventas por periodo</h2>
                <div className="flex gap-2 text-xs">
                  <button type="button" className="text-slate-400 hover:text-slate-600">
                    Dia
                  </button>
                  <button type="button" className="rounded bg-slate-800 px-2 py-0.5 font-semibold text-white">
                    Semana
                  </button>
                  <button type="button" className="text-slate-400 hover:text-slate-600">
                    Mes
                  </button>
                </div>
              </header>
              <div className="h-28 rounded-lg bg-slate-100" />
            </article>

            <article className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-[23px] font-medium">Ventas por categoria</h2>
              <div className="grid h-28 grid-cols-3 gap-2">
                <div className="rounded bg-slate-200" />
                <div className="rounded bg-slate-300" />
                <div className="rounded bg-slate-400" />
              </div>
            </article>
          </section>

          <section className="grid gap-3 xl:grid-cols-2">
            <article className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-[23px] font-medium text-rose-500">Stock Bajo</h2>
              <div className="space-y-2">
                {lowStock.map((row) => (
                  <div key={row.product} className="flex items-center justify-between border-b border-slate-200 pb-1.5 last:border-b-0">
                    <span className="text-base text-slate-700">{row.product}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.tagColor}`}>{row.tag}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-[23px] font-medium">Mas Vendidos</h2>
              <div className="space-y-2">
                {bestSellers.map((row) => (
                  <div key={row.product}>
                    <div className="mb-1 flex items-center justify-between text-base">
                      <span>{row.product}</span>
                      <span>{row.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-slate-400" style={{ width: `${row.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
          </div>
        </main>
      </div>
    </div>
  );
}