import { apiClient } from './apiClient';

function normalizeUser(user) {
  return {
    id: user.id,
    name: user.name ?? user.nombre ?? '',
    email: user.email ?? user.correo ?? '',
    phone: user.phone ?? user.telefono ?? '',
    role: user.role ?? user.rol ?? 'Vendedor',
    status: user.status ?? user.estado ?? 'Activo',
    monthlySales: Number(user.monthlySales ?? user.ventas_mes ?? 0),
  };
}

function toApiUser(user) {
  return {
    nombre: user.name.trim(),
    correo: user.email.trim().toLowerCase(),
    telefono: user.phone.trim(),
    rol: user.role,
    estado: user.status,
    ventas_mes: Number(user.monthlySales || 0),
    ...(user.password ? { password: user.password } : {}),
  };
}

export async function getUsers() {
  const users = await apiClient('/usuarios');
  return users.map(normalizeUser);
}

export async function createUser(user) {
  const createdUser = await apiClient('/usuarios', {
    method: 'POST',
    body: JSON.stringify(toApiUser(user)),
  });

  return normalizeUser(createdUser);
}

export async function updateUser(id, user) {
  const updatedUser = await apiClient(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toApiUser(user)),
  });

  return normalizeUser(updatedUser);
}

export async function deleteUser(id) {
  await apiClient(`/usuarios/${id}`, {
    method: 'DELETE',
  });
}
