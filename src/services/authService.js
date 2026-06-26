import { apiClient } from './apiClient';

const developmentUsers = [
  {
    email: 'admin@modacenter.pe',
    password: '12345678',
    role: 'Administrador',
    user: {
      id: 1,
      name: 'Admin ModaCenter',
      email: 'admin@modacenter.pe',
      role: 'Administrador',
    },
  },
  {
    email: 'vendedor@modacenter.pe',
    password: '12345678',
    role: 'Vendedor',
    user: {
      id: 2,
      name: 'Vendedor ModaCenter',
      email: 'vendedor@modacenter.pe',
      role: 'Vendedor',
    },
  },
];

function loginWithDevelopmentUser(credentials) {
  const email = credentials.email.trim().toLowerCase();
  const user = developmentUsers.find(
    (item) => item.email === email && item.password === credentials.password && item.role === credentials.role,
  );

  if (!user) {
    throw new Error('Credenciales invalidas.');
  }

  return {
    token: 'development-session',
    user: user.user,
  };
}

export async function login(credentials) {
  try {
    return await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        correo: credentials.email.trim().toLowerCase(),
        password: credentials.password,
        rol: credentials.role,
      }),
    });
  } catch (error) {
    if (error.message !== 'No se pudo conectar con la API REST.') {
      throw error;
    }

    return loginWithDevelopmentUser(credentials);
  }
}

export function saveSession(session) {
  window.sessionStorage.setItem('modacenter.session', JSON.stringify(session));
}

export function clearSession() {
  window.sessionStorage.removeItem('modacenter.session');
}

