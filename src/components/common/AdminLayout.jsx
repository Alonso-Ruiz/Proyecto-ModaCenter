import { Link } from 'react-router-dom';
import { clearSession, getSession } from '../../services/authService';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', key: 'dashboard' },
  { label: 'Productos', to: '/admin/productos', key: 'products' },
  { label: 'Inventario', to: '/admin/inventario', key: 'inventory' },
  { label: 'Reportes', to: '/admin/reportes', key: 'reports' },
  { label: 'Usuarios', to: '/admin/usuarios', key: 'users' },
];

export default function AdminLayout({ active = 'dashboard', children }) {
  const session = getSession();
  const userName = session?.user?.name || 'Admin Usuario';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="grid min-h-screen grid-cols-1 lg:h-screen lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-col bg-gradient-to-b from-[#0e1d39] to-[#09162d] p-3 text-slate-200 lg:overflow-hidden">
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-white/5 p-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-slate-600 text-[10px] font-bold">MC</div>
            <div>
              <p className="text-sm font-semibold leading-tight">ModaCenter</p>
              <p className="text-xs text-slate-400">{session?.user?.role || 'Administrador'}</p>
            </div>
          </div>

          <nav className="space-y-1 text-[11px]">
            {navItems.map((item) =>
              item.to === '#' ? (
                <a key={item.key} className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10" href={item.to}>
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`block rounded-lg px-3 py-2 ${active === item.key ? 'bg-white/15 font-semibold text-white' : 'text-slate-300 hover:bg-white/10'
                    }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="mt-auto space-y-2 pt-5">
            <div className="flex items-center gap-2 px-2 text-xs text-slate-300">
              <div className="grid h-6 w-6 place-items-center rounded-full bg-slate-500 font-semibold">{initial}</div>
              <span>{userName}</span>
            </div>
            <Link
              to="/login"
              onClick={clearSession}
              className="block rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10"
            >
              Cerrar Sesion
            </Link>
          </div>
        </aside>

        <main className="p-3 md:p-4 lg:h-screen lg:overflow-auto lg:p-4">{children}</main>
      </div>
    </div>
  );
}

