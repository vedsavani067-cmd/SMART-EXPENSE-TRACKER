import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appName, setAppName] = useState('SmartExpenseTracker'); // AppName Sync State
  const [sysSettings, setSysSettings] = useState({ allowRegistrations: true, maintenanceMode: false });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedAdmin = localStorage.getItem('isAdmin');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch { /* ignore */ }
    }
    if (token && savedAdmin === 'true') {
      setIsAdmin(true);
    }

    // Always fetch public settings
    API.get('/admin/settings/public').then(res => {
      if (res.data?.appName) setAppName(res.data.appName);
      setSysSettings({
        allowRegistrations: res.data?.allowRegistrations ?? true,
        maintenanceMode: res.data?.maintenanceMode ?? false
      });
    }).catch(() => {});

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const adminLogin = async (email, password) => {
    const res = await API.post('/auth/admin-login', { email, password });
    const { token } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', 'true');
    setIsAdmin(true);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, isAdmin, loading, login, register, adminLogin, logout, 
      appName, sysSettings 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
