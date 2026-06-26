const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const userRoleOptions = ['Administrador', 'Vendedor'];
export const userStatusOptions = ['Activo', 'Inactivo'];

export const emptyUserForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'Vendedor',
  status: 'Activo',
  monthlySales: '0',
};

export function mapUserToForm(user) {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    password: '',
    role: user.role,
    status: user.status,
    monthlySales: String(user.monthlySales ?? 0),
  };
}

export function validateUser(user, users = [], currentUserId = null) {
  const errors = {};
  const email = user.email.trim().toLowerCase();
  const duplicatedEmail = users.some((item) => item.email.toLowerCase() === email && item.id !== currentUserId);

  if (!user.name.trim()) errors.name = 'El nombre es obligatorio.';
  if (!email) {
    errors.email = 'El correo es obligatorio.';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Ingresa un correo valido.';
  } else if (duplicatedEmail) {
    errors.email = 'Este correo ya esta registrado.';
  }

  if (!user.phone.trim()) errors.phone = 'El telefono es obligatorio.';
  if (!currentUserId && !user.password) errors.password = 'La contrasena es obligatoria.';
  if (user.password && user.password.length < 8) errors.password = 'La contrasena debe tener minimo 8 caracteres.';
  if (!user.role) errors.role = 'Selecciona un rol.';
  if (!user.status) errors.status = 'Selecciona un estado.';

  return errors;
}

export function normalizeUserPayload(user) {
  return {
    ...user,
    name: user.name.trim(),
    email: user.email.trim().toLowerCase(),
    phone: user.phone.trim(),
    monthlySales: Number(user.monthlySales || 0),
  };
}
