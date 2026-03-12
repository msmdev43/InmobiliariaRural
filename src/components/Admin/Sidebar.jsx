// C:\xampp\htdocs\InmobiliariaRural\src\components\Admin\Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/Admin/Sidebar.css';

const Sidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      )
    },
    {
      path: '/admin/propiedades',
      name: 'Propiedades',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      path: '/admin/propiedades/nueva',
      name: 'Nueva Propiedad',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      )
    },
    {
      path: '/admin/consultas',
      name: 'Consultas',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      badge: 3
    },
    {
      path: '/admin/configuracion',
      name: 'Configuración',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62z" />
        </svg>
      )
    }
  ];

  return (
    <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/assets/logo.png" alt="Logo" />
            {!collapsed && <span>Inmobiliaria Rural</span>}
          </div>
          <button 
            className="sidebar-toggle" 
            onClick={() => setCollapsed(!collapsed)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points={collapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="nav-text">{item.name}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="nav-badge collapsed">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            {!collapsed && (
              <div className="admin-details">
                <span className="admin-name">{user?.email || 'Admin'}</span>
                <span className="admin-role">Administrador</span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;