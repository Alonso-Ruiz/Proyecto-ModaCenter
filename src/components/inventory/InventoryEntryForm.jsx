import FormField from '../common/FormField';

export default function InventoryEntryForm({ form, errors, products, onChange, onSubmit, onCancel }) {
  const selectedProduct = products.find((product) => product.id === Number(form.productId));
  const sizes = selectedProduct?.sizes?.length ? selectedProduct.sizes : ['XS', 'S', 'M', 'L', 'XL'];
  const colors = selectedProduct?.color ? [selectedProduct.color] : ['Blanco', 'Negro', 'Azul', 'Gris', 'Marino'];

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">Registrar Ingreso de Mercaderia</h1>
      </header>

      <form onSubmit={onSubmit} className="max-w-[635px] rounded-lg border border-slate-200 bg-white p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Fecha" error={errors.date}>
            <input type="date" value={form.date} onChange={(event) => onChange('date', event.target.value)} className="form-input" />
          </FormField>

          <FormField label="Proveedor" error={errors.supplier}>
            <input value={form.supplier} onChange={(event) => onChange('supplier', event.target.value)} className="form-input" />
          </FormField>

          <FormField label="Producto" error={errors.productId}>
            <select value={form.productId} onChange={(event) => onChange('productId', event.target.value)} className="form-input">
              <option value="">Seleccionar producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Talla" error={errors.size}>
            <select value={form.size} onChange={(event) => onChange('size', event.target.value)} className="form-input">
              <option value="">Seleccionar talla</option>
              {sizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Color" error={errors.color}>
            <select value={form.color} onChange={(event) => onChange('color', event.target.value)} className="form-input">
              <option value="">Seleccionar color</option>
              {colors.map((color) => (
                <option key={color}>{color}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Cantidad" error={errors.quantity}>
            <input value={form.quantity} onChange={(event) => onChange('quantity', event.target.value)} inputMode="numeric" className="form-input" />
          </FormField>

          <FormField label="Precio de Costo (S/)" error={errors.costPrice}>
            <input value={form.costPrice} onChange={(event) => onChange('costPrice', event.target.value)} inputMode="decimal" className="form-input" />
          </FormField>

          <FormField label="N° Factura / Guia" error={errors.invoiceNumber}>
            <input value={form.invoiceNumber} onChange={(event) => onChange('invoiceNumber', event.target.value)} className="form-input" />
          </FormField>

          <FormField label="Notas" error={errors.notes} className="md:col-span-2">
            <textarea value={form.notes} onChange={(event) => onChange('notes', event.target.value)} rows="3" className="form-input resize-none" />
          </FormField>
        </div>

        <div className="mt-7 border-t border-slate-100 pt-5">
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              Registrar Ingreso
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
