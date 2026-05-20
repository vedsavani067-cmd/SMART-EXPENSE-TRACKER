import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddIncome from './pages/AddIncome';
import AddExpense from './pages/AddExpense';
import History from './pages/History';
import Reports from './pages/Reports';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageCategories from './pages/ManageCategories';
import UserProfile from './pages/UserProfile';
import SystemSettings from './pages/SystemSettings';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

export default function App() {
  const { user, isAdmin, sysSettings } = useAuth();
  const location = useLocation();

  if (sysSettings?.maintenanceMode && !isAdmin && location.pathname !== '/admin-login') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1a', color: 'white', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', padding: '3rem 2rem', borderRadius: '24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>🚧</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.75rem' }}>System Maintenance</h1>
          <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '2rem' }}>
            We're currently upgrading our servers to serve you better! Please check back later.
          </p>
          <a href="/admin-login" style={{ color: '#475569', fontSize: '0.75rem', textDecoration: 'none' }}>Admin Access</a>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/admin-login" element={isAdmin ? <Navigate to="/admin" /> : <AdminLogin />} />

      {/* User Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/add-income" element={<ProtectedRoute><AddIncome /></ProtectedRoute>} />
      <Route path="/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

      {/* Admin Protected */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
      <Route path="/admin/users/:id/profile" element={<AdminRoute><UserProfile /></AdminRoute>} />
      <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><SystemSettings /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
