// C:\xampp\htdocs\InmobiliariaRural\src\components\Admin\Sidebar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api.service';
import '../../styles/components/Admin/Sidebar.css';

const Sidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [totalConsultas, setTotalConsultas] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Detectar si es mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // En desktop, cerrar el menú mobile y resetear estados
      if (!mobile) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar menú mobile al cambiar de ruta
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Bloquear scroll cuando el menú mobile está abierto
  useEffect(() => {
    if (mobileOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, isMobile]);

  // Cargar total de consultas al montar el componente
  useEffect(() => {
    const cargarTotalConsultas = async () => {
      try {
        const response = await apiService.contarConsultasNoLeidas();
        if (response && response.success) {
          setTotalConsultas(response.total || 0);
        }
      } catch (error) {
        console.error('Error al cargar total de consultas:', error);
      }
    };

    cargarTotalConsultas();
    
    const interval = setInterval(() => {
      cargarTotalConsultas();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOverlayClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

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
      path: '/admin/publicarPropiedad',
      name: 'Publicar Propiedad',
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
      badge: totalConsultas
    },
    {
      name: 'Configuración',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62z" />
        </svg>
      ),
      submenu: [
        {
          path: '/admin/configuracion/tipos-campos',
          name: 'Tipos de Campos'
        },
        {
          path: '/admin/configuracion/servicios',
          name: 'Servicios'
        }
      ]
    }
  ];

  const renderMenuItem = (item, index) => {
    if (item.submenu) {
      return (
        <div key={index} className="sidebar-menu-item-unique sidebar-has-submenu-unique">
          <div 
            className={`sidebar-submenu-toggle-unique ${configOpen ? 'sidebar-submenu-open-unique' : ''}`}
            onClick={() => setConfigOpen(!configOpen)}
          >
            <span className="sidebar-menu-icon-unique">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="sidebar-menu-text-unique">{item.name}</span>
                <span className="sidebar-submenu-arrow-unique">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </>
            )}
          </div>
          {!collapsed && configOpen && (
            <div className="sidebar-submenu-unique">
              {item.submenu.map((subitem, subindex) => (
                <NavLink
                  key={subindex}
                  to={subitem.path}
                  className={({ isActive }) => 
                    `sidebar-submenu-item-unique ${isActive ? 'sidebar-submenu-item-active-unique' : ''}`
                  }
                >
                  {subitem.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={index}
        to={item.path}
        className={({ isActive }) => 
          `sidebar-menu-item-unique ${isActive ? 'sidebar-menu-item-active-unique' : ''}`
        }
      >
        <span className="sidebar-menu-icon-unique">{item.icon}</span>
        {!collapsed && (
          <>
            <span className="sidebar-menu-text-unique">{item.name}</span>
            {item.badge > 0 && (
              <span className="sidebar-menu-badge-unique">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </>
        )}
        {collapsed && item.badge > 0 && (
          <span className="sidebar-menu-badge-unique sidebar-menu-badge-collapsed-unique">
            {item.badge > 99 ? '99+' : item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <div className={`sidebar-layout-unique ${collapsed && !isMobile ? 'sidebar-collapsed-unique' : ''} ${mobileOpen ? 'sidebar-mobile-open-unique' : ''}`}>
      {/* Overlay para mobile */}
      <div 
        className={`sidebar-overlay-unique ${mobileOpen ? 'sidebar-overlay-visible-unique' : ''}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Botón hamburguesa para mobile */}
      <button 
        className="sidebar-mobile-toggle-unique"
        onClick={handleToggleMobile}
        aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      <div className="sidebar-container-unique">
        {/* Header */}
        <div className="sidebar-header-unique">
          <div className="sidebar-logo-unique">
            <img src="/assets/logo.png" alt="Logo" />
            {!collapsed && <span className="sidebar-logo-text-unique">Inmobiliaria Rural</span>}
          </div>
          <button 
            className="sidebar-toggle-btn-unique" 
            onClick={handleToggleCollapse}
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points={collapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
            </svg>
          </button>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav-unique">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer-unique">
          <div className="sidebar-user-info-unique">
            <div className="sidebar-user-avatar-unique">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            {!collapsed && (
              <div className="sidebar-user-details-unique">
                <span 
                  className="sidebar-user-name-unique" 
                  title={user?.email || 'Admin'}
                >
                  {user?.email || 'Admin'}
                </span>
                <span className="sidebar-user-role-unique">Administrador</span>
              </div>
            )}
          </div>
          <button className="sidebar-logout-btn-unique" onClick={handleLogout} title="Cerrar sesión">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!collapsed && <span className="sidebar-logout-text-unique">Cerrar sesión</span>}
          </button>
        </div>
      </div>

      <div className="sidebar-main-content-unique">
        <div className="sidebar-content-area-unique">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;