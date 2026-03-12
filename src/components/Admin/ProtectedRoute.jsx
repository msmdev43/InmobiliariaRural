// C:\xampp\htdocs\InmobiliariaRural\src\components\Admin\ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <div className="spinner" style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: 'var(--foreground)' }}>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;