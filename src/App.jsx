import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Productos from './pages/Productos/Productos';
import Usuarios from './pages/Usuarios/Usuarios';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/productos" element={<Productos />} />
      <Route path="/admin/usuarios" element={<Usuarios />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
