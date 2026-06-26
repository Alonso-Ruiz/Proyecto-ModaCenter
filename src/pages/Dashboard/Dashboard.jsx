import AdminLayout from '../../components/common/AdminLayout';

export default function Dashboard() {
  return (
    <AdminLayout active="dashboard">
      <div className="mx-auto flex h-full max-w-[1220px] flex-col gap-3">
        <h1 className="mb-1 text-3xl font-bold text-slate-900">Dashboard</h1>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {['Ventas Hoy', 'Ganancias del Mes', 'Productos Activos', 'Alertas de Stock'].map((label) => (
            <article key={label} className="rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-400">{label}</p>
              <p className="mt-1 text-[16px] font-semibold leading-tight text-slate-800">0</p>
            </article>
          ))}
        </section>

        <section className="grid gap-3 xl:grid-cols-2">
          <article className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-[23px] font-medium">Ventas por periodo</h2>
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
      </div>
    </AdminLayout>
  );
}
