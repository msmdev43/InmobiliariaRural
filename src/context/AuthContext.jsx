// C:\xampp\htdocs\InmobiliariaRural\src\context\AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
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

  useEffect(() => {
    // Verificar sesión al cargar la app
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const isValid = await apiService.checkSession();
      setAuthenticated(isValid);
      if (isValid) {
        // Aquí podrías cargar datos del usuario si es necesario
        setUser({ email: 'admin@inmobiliaria.com' }); // Datos de ejemplo
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await apiService.adminLogin(credentials);
      if (data.success) {
        setAuthenticated(true);
        setUser({ email: credentials.email });
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  };

  const logout = async () => {
    try {
      await apiService.adminLogout();
    } finally {
      setAuthenticated(false);
      setUser(null);
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