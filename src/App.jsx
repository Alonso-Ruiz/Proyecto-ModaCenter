import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Inventario from './pages/Inventario/Inventario';
import Login from './pages/Login/Login';
import Productos from './pages/Productos/Productos';
import Reportes from './pages/Reportes/Reportes';
import Usuarios from './pages/Usuarios/Usuarios';
import RoleRoute from './components/common/RoleRoute';
import ConsultarInventario from './pages/Vendedor/ConsultarInventario';
import HistorialVentas from './pages/Vendedor/HistorialVentas';
import PuntoVenta from './pages/Vendedor/PuntoVenta';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={['Administrador']}><Dashboard /></RoleRoute>} />
      <Route path="/admin/productos" element={<RoleRoute allowedRoles={['Administrador']}><Productos /></RoleRoute>} />
      <Route path="/admin/inventario" element={<RoleRoute allowedRoles={['Administrador']}><Inventario /></RoleRoute>} />
      <Route path="/admin/reportes" element={<RoleRoute allowedRoles={['Administrador']}><Reportes /></RoleRoute>} />
      <Route path="/admin/usuarios" element={<RoleRoute allowedRoles={['Administrador']}><Usuarios /></RoleRoute>} />
      <Route path="/vendedor/pos" element={<RoleRoute allowedRoles={['Vendedor']}><PuntoVenta /></RoleRoute>} />
      <Route path="/vendedor/historial" element={<RoleRoute allowedRoles={['Vendedor']}><HistorialVentas /></RoleRoute>} />
      <Route path="/vendedor/inventario" element={<RoleRoute allowedRoles={['Vendedor']}><ConsultarInventario /></RoleRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
