import { Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboardView from './views/AdminDashboardView';
import LoginView from './views/LoginView';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/admin/dashboard" element={<AdminDashboardView />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}