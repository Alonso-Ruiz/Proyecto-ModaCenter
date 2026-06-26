import StatusBadge from '../common/StatusBadge';
import TableActions from '../common/TableActions';

function money(value) {
  return `S/ ${Number(value || 0).toLocaleString('es-PE')}`;
}

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function UserTable({ users, onEdit, onDelete }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="table-th">Nombre</th>
              <th className="table-th">Correo</th>
              <th className="table-th">Telefono</th>
              <th className="table-th">Rol</th>
              <th className="table-th">Estado</th>
              <th className="table-th">Ventas Mes</th>
              <th className="table-th text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 last:border-b-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 font-medium text-slate-950">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-xs text-slate-500">
                      {initials(user.name)}
                    </span>
                    {user.name}
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-700">{user.email}</td>
                <td className="px-5 py-3 text-slate-700">{user.phone}</td>
                <td className="px-5 py-3">
                  <StatusBadge>{user.role}</StatusBadge>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge tone={user.status === 'Activo' ? 'green' : 'slate'}>{user.status}</StatusBadge>
                </td>
                <td className="px-5 py-3 text-slate-950">{money(user.monthlySales)}</td>
                <td className="px-5 py-3">
                  <TableActions onEdit={() => onEdit(user)} onDelete={() => onDelete(user)} />
                </td>
              </tr>
            ))}
            {!users.length ? (
              <tr>
                <td colSpan="7" className="px-5 py-8 text-center text-sm text-slate-500">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
