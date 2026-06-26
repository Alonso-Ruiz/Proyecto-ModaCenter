import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveSession } from '../../services/authService';
import { validateLogin } from '../../validations/loginValidation';

const initialCredentials = {
  email: '',
  password: '',
  role: 'Administrador',
};

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState(initialCredentials);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateCredentials(field, value) {
    setCredentials((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setAuthError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateLogin(credentials);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) return;

    try {
      setLoading(true);
      const session = await login(credentials);
      saveSession(session);
      navigate('/admin/dashboard');
    } catch (error) {
      setAuthError(error.message || 'Credenciales invalidas.');
    } finally {
      setLoading(false);
    }
  }

  
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-200 px-4 py-8">
      <section className="w-full max-w-xs rounded-xl border border-slate-300 bg-slate-100 p-6 shadow-sm">
        <div className="mb-4 flex justify-center">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white">MC</div>
        </div>

        <h1 className="text-center text-[30px] font-bold leading-none text-slate-900">ModaCenter</h1>
        <p className="mt-1 text-center text-xs text-slate-500">Sistema de Gestion de Tienda</p>

        <div className="mt-5 flex rounded-lg border border-slate-300 bg-slate-100 p-0.5 text-sm">
          {['Administrador', 'Vendedor'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => updateCredentials('role', role)}
              className={`w-1/2 rounded-md px-2 py-2 font-semibold ${
                credentials.role === role ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        {errors.role ? <p className="mt-2 text-xs text-rose-600">{errors.role}</p> : null}

        <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
          <label className="block text-xs text-slate-700" htmlFor="email">
            Correo electronico
            <input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(event) => updateCredentials('email', event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-0"
            />
            {errors.email ? <span className="mt-1 block text-xs text-rose-600">{errors.email}</span> : null}
          </label>

          <label className="block text-xs text-slate-700" htmlFor="password">
            Contrasena
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(event) => updateCredentials('password', event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-200 px-3 py-2 text-sm text-slate-700 outline-none ring-0"
            />
            {errors.password ? <span className="mt-1 block text-xs text-rose-600">{errors.password}</span> : null}
          </label>

          {authError ? <p className="text-xs text-rose-600">{authError}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 block w-full rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  );
}
