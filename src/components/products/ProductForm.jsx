import FormField from '../common/FormField';
import {
  productCategoryOptions,
  productColorOptions,
  productSizeOptions,
} from '../../validations/productValidation';

export default function ProductForm({
  title,
  form,
  errors,
  onChange,
  onToggleSize,
  onImageChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section>
      <header className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-950">{title}</h1>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Volver
        </button>
      </header>

      <form onSubmit={onSubmit} className="max-w-[610px] rounded-lg border border-slate-200 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Nombre del Producto" error={errors.name}>
            <input value={form.name} onChange={(event) => onChange('name', event.target.value)} className="form-input" />
          </FormField>

          <FormField label="Categoria" error={errors.category}>
            <select value={form.category} onChange={(event) => onChange('category', event.target.value)} className="form-input">
              {productCategoryOptions.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Descripcion" error={errors.description} className="md:col-span-2">
            <textarea
              value={form.description}
              onChange={(event) => onChange('description', event.target.value)}
              rows="3"
              className="form-input resize-none"
            />
          </FormField>

          <FormField label="Precio de Costo (S/)" error={errors.costPrice}>
            <input
              value={form.costPrice}
              onChange={(event) => onChange('costPrice', event.target.value)}
              inputMode="decimal"
              className="form-input"
            />
          </FormField>

          <FormField label="Precio de Venta (S/)" error={errors.salePrice}>
            <input
              value={form.salePrice}
              onChange={(event) => onChange('salePrice', event.target.value)}
              inputMode="decimal"
              className="form-input"
            />
          </FormField>

          <FormField label="Tallas" error={errors.sizes}>
            <div className="flex h-9 flex-wrap items-center gap-2">
              {productSizeOptions.map((size) => (
                <label key={size} className="flex items-center gap-1 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.sizes.includes(size)}
                    onChange={() => onToggleSize(size)}
                    className="h-3.5 w-3.5"
                  />
                  {size}
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Color" error={errors.color}>
            <select value={form.color} onChange={(event) => onChange('color', event.target.value)} className="form-input">
              {productColorOptions.map((color) => (
                <option key={color}>{color}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Stock inicial" error={errors.stock}>
            <input
              value={form.stock}
              onChange={(event) => onChange('stock', event.target.value)}
              inputMode="numeric"
              className="form-input"
            />
          </FormField>

          <FormField label="Stock minimo" error={errors.minStock}>
            <input
              value={form.minStock}
              onChange={(event) => onChange('minStock', event.target.value)}
              inputMode="numeric"
              className="form-input"
            />
          </FormField>

          <FormField label="Imagen" error={errors.image} className="md:col-span-2">
            <label className="grid min-h-[72px] cursor-pointer place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-xs text-slate-400">
              <input type="file" accept="image/*" onChange={onImageChange} className="sr-only" />
              {form.image ? 'Imagen seleccionada' : 'Arrastra o haz clic para subir imagen'}
            </label>
          </FormField>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              Guardar
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
