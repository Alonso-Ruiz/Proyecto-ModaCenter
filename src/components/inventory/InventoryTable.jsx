import StatusBadge from '../common/StatusBadge';

function stockStatus(item) {
  if (item.currentStock === 0) return { label: 'Agotado', tone: 'red' };
  if (item.currentStock <= item.minStock) return { label: 'Bajo', tone: 'amber' };
  return { label: 'Ok', tone: 'green' };
}

export default function InventoryTable({ products, onRestock }) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-medium text-slate-600">Stock por producto</h2>
        <button type="button" onClick={onRestock} className="btn-primary">
          + Registrar Ingreso
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="table-th">Producto</th>
                <th className="table-th">Categoria</th>
                <th className="table-th">Talla</th>
                <th className="table-th">Stock Actual</th>
                <th className="table-th">Stock Minimo</th>
                <th className="table-th">Estado</th>
                <th className="table-th">Accion</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = stockStatus(product);

                return (
                  <tr key={product.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-5 py-3 text-slate-950">{product.product}</td>
                    <td className="px-5 py-3 text-slate-700">{product.category}</td>
                    <td className="px-5 py-3 text-slate-700">{product.size}</td>
                    <td className="px-5 py-3 text-slate-950">{product.currentStock}</td>
                    <td className="px-5 py-3 text-slate-700">{product.minStock}</td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    </td>
                    <td className="px-5 py-3">
                      <button type="button" onClick={onRestock} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                        Reabastecer
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!products.length ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-sm text-slate-500">
                    No hay productos registrados para inventario.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
