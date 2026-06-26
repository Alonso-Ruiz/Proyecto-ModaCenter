import StatusBadge from '../common/StatusBadge';
import TableActions from '../common/TableActions';

function money(value) {
  return `S/ ${Number(value || 0).toLocaleString('es-PE')}`;
}

function getStockBadge(product) {
  if (Number(product.stock) === 0) return { label: 'Agotado', tone: 'red' };
  if (Number(product.stock) <= Number(product.minStock)) return { label: product.stock, tone: 'amber' };
  return { label: product.stock, tone: 'green' };
}

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="table-th">Producto</th>
              <th className="table-th">Categoria</th>
              <th className="table-th">Talla</th>
              <th className="table-th">Color</th>
              <th className="table-th">Precio</th>
              <th className="table-th">Stock</th>
              <th className="table-th text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stockBadge = getStockBadge(product);

              return (
                <tr key={product.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-5 py-3 font-medium text-slate-950">{product.name}</td>
                  <td className="px-5 py-3">
                    <StatusBadge>{product.category}</StatusBadge>
                  </td>
                  <td className="px-5 py-3 text-slate-700">{product.sizes.join(', ')}</td>
                  <td className="px-5 py-3 text-slate-700">{product.color}</td>
                  <td className="px-5 py-3 text-slate-950">{money(product.salePrice)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={stockBadge.tone}>{stockBadge.label}</StatusBadge>
                  </td>
                  <td className="px-5 py-3">
                    <TableActions onEdit={() => onEdit(product)} onDelete={() => onDelete(product)} />
                  </td>
                </tr>
              );
            })}
            {!products.length ? (
              <tr>
                <td colSpan="7" className="px-5 py-8 text-center text-sm text-slate-500">
                  No se encontraron productos.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
