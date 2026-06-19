import { Link } from 'react-router-dom';

export default function LoginView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-200 px-4 py-8">
      <section className="w-full max-w-xs rounded-xl border border-slate-300 bg-slate-100 p-6 shadow-sm">
        <div className="mb-4 flex justify-center">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-sm font700 text-white">MC</div>
        </div>

        <h1 className="text-center text-[30px] font-bold leading-none text-slate-900">ModaCenter</h1>
        <p className="mt-1 text-center text-xs text-slate-500">Sistema de Gestion de Tienda</p>

        <div className="mt-5 flex rounded-lg border border-slate-300 bg-slate-100 p-0.5 text-sm">
          <button
            type="button"
            className="w-1/2 rounded-md bg-slate-900 px-2 py-2 font-semibold text-white"
          >
            Administrador
          </button>
          <button type="button" className="w-1/2 rounded-md px-2 py-2 text-slate-600">
            Vendedor
          </button>
        </div>

        <form className="mt-5 space-y-3" onSubmit={(event) => event.preventDefault()}>
          <label className="block text-xs text-slate-700" htmlFor="email">
            Correo electronico
            <input
              id="email"
              type="email"
              defaultValue="admin@modacenter.pe"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-0"
            />
          </label>

          <label className="block text-xs text-slate-700" htmlFor="password">
            Contrasena
            <input
              id="password"
              type="password"
              defaultValue="123456"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-0"
            />
          </label>

          <Link
            to="/admin/dashboard"
            className="mt-1 block w-full rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Ingresar
          </Link>
        </form>
      </section>
    </main>
  );
}