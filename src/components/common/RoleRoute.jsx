import { Navigate } from 'react-router-dom';
import { getSession } from '../../services/authService';

export default function RoleRoute({ allowedRoles, children }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(session.user.role)) {
    return <Navigate to={session.user.role === 'Vendedor' ? '/vendedor/pos' : '/admin/dashboard'} replace />;
  }

  return children;
}
