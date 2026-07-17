
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          sessionStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    sessionStorage.setItem('token', res.data.token);
    setUser(res.data);
    
    // Redirect based on role
    if (res.data.role === 'Admin') navigate('/admin/dashboard');
    else if (res.data.role === 'Organizer') navigate('/organizer/dashboard');
    else navigate('/student/dashboard');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    sessionStorage.setItem('token', res.data.token);
    setUser(res.data);
    
    // Redirect based on role
    if (res.data.role === 'Admin') navigate('/admin/dashboard');
    else if (res.data.role === 'Organizer') navigate('/organizer/dashboard');
    else navigate('/student/dashboard');
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
