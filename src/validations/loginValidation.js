const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(credentials) {
  const errors = {};

  if (!credentials.email.trim()) {
    errors.email = 'El correo es obligatorio.';
  } else if (!emailPattern.test(credentials.email.trim())) {
    errors.email = 'Ingresa un correo valido.';
  }

  if (!credentials.password) {
    errors.password = 'La contrasena es obligatoria.';
  }

  if (!credentials.role) {
    errors.role = 'Selecciona un rol.';
  }

  return errors;
}
