import FormField from '../common/FormField';
import { paymentMethodOptions, reportCategoryOptions, reportStatusOptions } from '../../validations/reportValidation';

export default function ReportForm({ title, form, errors, onChange, onSubmit, onCancel }) {
  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
      </header>

      <form onSubmit={onSubmit} className="max-w-[635px] rounded-lg border border-slate-200 bg-white p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Fecha" error={errors.date}>
            <input type="date" value={form.date} onChange={(event) => onChange('date', event.target.value)} className="form-input" />
          </FormField>

          <FormField label="N° Venta" error={errors.saleNumber}>
            <input value={form.saleNumber} onChange={(event) => onChange('saleNumber', event.target.value)} className="form-input" />
          </FormField>

          <FormField label="Categoria" error={errors.category}>
            <select value={form.category} onChange={(event) => onChange('category', event.target.value)} className="form-input">
              {reportCategoryOptions.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Total (S/)" error={errors.total}>
            <input value={form.total} onChange={(event) => onChange('total', event.target.value)} inputMode="decimal" className="form-input" />
          </FormField>

          <FormField label="Metodo de pago" error={errors.paymentMethod}>
            <select value={form.paymentMethod} onChange={(event) => onChange('paymentMethod', event.target.value)} className="form-input">
              {paymentMethodOptions.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Estado" error={errors.status}>
            <select value={form.status} onChange={(event) => onChange('status', event.target.value)} className="form-input">
              {reportStatusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Notas" error={errors.notes} className="md:col-span-2">
            <textarea value={form.notes} onChange={(event) => onChange('notes', event.target.value)} rows="3" className="form-input resize-none" />
          </FormField>
        </div>

        <div className="mt-7 border-t border-slate-100 pt-5">
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
