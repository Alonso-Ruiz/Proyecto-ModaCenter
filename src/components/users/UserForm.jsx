import FormField from '../common/FormField';
import { userRoleOptions, userStatusOptions } from '../../validations/userValidation';

export default function UserForm({ title, form, errors, isEditing, onChange, onSubmit, onCancel }) {
  return (
    <section>
      <header className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-950">{title}</h1>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Volver
        </button>
      </header>

      <form onSubmit={onSubmit} className="max-w-[562px] rounded-lg border border-slate-200 bg-white p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Nombre completo" error={errors.name}>
            <input value={form.name} onChange={(event) => onChange('name', event.target.value)} className="form-input" />
          </FormField>

          <FormField label="Correo electronico" error={errors.email}>
            <input
              value={form.email}
              onChange={(event) => onChange('email', event.target.value)}
              type="email"
              className="form-input"
            />
          </FormField>

          <FormField label="Telefono" error={errors.phone}>
            <input value={form.phone} onChange={(event) => onChange('phone', event.target.value)} className="form-input" />
          </FormField>

          <FormField label={isEditing ? 'Nueva contrasena' : 'Contrasena'} error={errors.password}>
            <input
              value={form.password}
              onChange={(event) => onChange('password', event.target.value)}
              type="password"
              className="form-input"
            />
          </FormField>

          <FormField label="Rol" error={errors.role}>
            <select value={form.role} onChange={(event) => onChange('role', event.target.value)} className="form-input">
              {userRoleOptions.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Estado" error={errors.status}>
            <div className="flex h-11 items-center gap-5 text-sm font-semibold text-slate-700">
              {userStatusOptions.map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.status === status}
                    onChange={() => onChange('status', status)}
                    className="h-3.5 w-3.5"
                  />
                  {status}
                </label>
              ))}
            </div>
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
