import StatusBadge from '../common/StatusBadge';
import TableActions from '../common/TableActions';

function formatDate(date) {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${day}/${month}`;
}

function money(value) {
  return `S/ ${Number(value || 0).toLocaleString('es-PE')}`;
}

function statusTone(status) {
  if (status === 'Completado') return 'green';
  if (status === 'Pendiente') return 'amber';
  return 'red';
}

export default function ReportTable({ reports, onEdit, onDelete, showActions = true }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="table-th">Fecha</th>
              <th className="table-th">N° Venta</th>
              <th className="table-th">Categoria</th>
              <th className="table-th">Total</th>
              <th className="table-th">Metodo</th>
              <th className="table-th">Estado</th>
              {showActions ? <th className="table-th text-center">Acciones</th> : null}
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-slate-100 last:border-b-0">
                <td className="px-5 py-3 text-slate-950">{formatDate(report.date)}</td>
                <td className="px-5 py-3 text-slate-950">{report.saleNumber}</td>
                <td className="px-5 py-3 text-slate-700">{report.category}</td>
                <td className="px-5 py-3 text-slate-950">{money(report.total)}</td>
                <td className="px-5 py-3 text-slate-700">{report.paymentMethod}</td>
                <td className="px-5 py-3">
                  <StatusBadge tone={statusTone(report.status)}>{report.status}</StatusBadge>
                </td>
                {showActions ? (
                  <td className="px-5 py-3">
                    <TableActions onEdit={() => onEdit(report)} onDelete={() => onDelete(report)} />
                  </td>
                ) : null}
              </tr>
            ))}
            {!reports.length ? (
              <tr>
                <td colSpan={showActions ? 7 : 6} className="px-5 py-8 text-center text-sm text-slate-500">
                  No hay reportes registrados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
