// C:\xampp\htdocs\InmobiliariaRural\src\context\AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Escuchar eventos de no autorizado
  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthenticated(false);
      setUser(null);
      if (window.location.pathname !== '/admin/login') {
        navigate('/admin/login');
      }
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, [navigate]);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const isValid = await apiService.checkSession();
      setAuthenticated(isValid);
      if (isValid) {
        setUser({ email: 'Administrador' });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.debug('Error en checkSession:', error);
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await apiService.adminLogin(credentials);
      if (data.success) {
        // Establecemos autenticación directamente sin esperar checkSession
        setAuthenticated(true);
        setUser({ email: credentials.email });
        
        // Pequeño delay para asegurar que el estado se actualice
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 100);
        
        return { success: true };
      }
      return { success: false, message: data.message || 'Error al iniciar sesión' };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

  const logout = async () => {
    try {
      await apiService.adminLogout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setAuthenticated(false);
      setUser(null);
      navigate('/admin/login');
    }
  };

  const value = {
    user,
    authenticated,
    loading,
    login,
    logout,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};