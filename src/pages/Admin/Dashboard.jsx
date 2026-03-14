// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar';
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages/Admin/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPropiedades: 0,
    disponibles: 0,
    vendidas: 0,
    consultasPendientes: 0
  });

  const [ultimasConsultas, setUltimasConsultas] = useState([]);
  const [propiedadesDestacadas, setPropiedadesDestacadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalPropiedades: 12,
        disponibles: 8,
        vendidas: 4,
        consultasPendientes: 3
      });

      setUltimasConsultas([
        { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', fecha: '2026-01-15', propiedad: 'Campo Los Alamos' },
        { id: 2, nombre: 'María García', email: 'maria@email.com', fecha: '2026-01-14', propiedad: 'Estancia San Pedro' },
        { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', fecha: '2026-01-13', propiedad: 'Chacra La Esperanza' },
      ]);

      setPropiedadesDestacadas([
        { id: 1, titulo: 'Campo Santa Irene', precio: '$250.000', tipo: 'venta' },
        { id: 2, titulo: 'Estancia La Ballenera', precio: '$180.000', tipo: 'venta' },
        { id: 3, titulo: 'Chacra Los Nogales', precio: '$2.500/mes', tipo: 'alquiler' },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Sidebar>
        <div className="dashboard-loading-unique">
          <div className="dashboard-spinner-unique"></div>
          <p className="dashboard-loading-text-unique">Cargando dashboard...</p>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="dashboard-page-unique">
        {/* Header */}
        <div className="dashboard-header-unique">
          <div className="dashboard-header-left-unique">
            <h1 className="dashboard-title-unique">Dashboard</h1>
            <p className="dashboard-subtitle-unique">Bienvenido de nuevo, {user?.email || 'Administrador'}</p>
          </div>
          <div className="dashboard-date-unique">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="dashboard-stats-grid-unique">
          <div className="dashboard-stat-card-unique">
            <div className="dashboard-stat-icon-unique" style={{ background: 'rgba(0, 106, 78, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006A4E" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="dashboard-stat-content-unique">
              <span className="dashboard-stat-label-unique">Total Propiedades</span>
              <span className="dashboard-stat-value-unique">{stats.totalPropiedades}</span>
            </div>
          </div>

          <div className="dashboard-stat-card-unique">
            <div className="dashboard-stat-icon-unique" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <div className="dashboard-stat-content-unique">
              <span className="dashboard-stat-label-unique">Disponibles</span>
              <span className="dashboard-stat-value-unique">{stats.disponibles}</span>
            </div>
          </div>

          <div className="dashboard-stat-card-unique">
            <div className="dashboard-stat-icon-unique" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="dashboard-stat-content-unique">
              <span className="dashboard-stat-label-unique">Vendidas/Alquiladas</span>
              <span className="dashboard-stat-value-unique">{stats.vendidas}</span>
            </div>
          </div>

          <div className="dashboard-stat-card-unique">
            <div className="dashboard-stat-icon-unique" style={{ background: 'rgba(249, 115, 22, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="dashboard-stat-content-unique">
              <span className="dashboard-stat-label-unique">Consultas Pendientes</span>
              <span className="dashboard-stat-value-unique">{stats.consultasPendientes}</span>
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div className="dashboard-main-grid-unique">
          {/* Últimas consultas */}
          <div className="dashboard-card-unique">
            <div className="dashboard-card-header-unique">
              <h2 className="dashboard-card-title-unique">Últimas Consultas</h2>
              <button 
                className="dashboard-card-link-unique"
                onClick={() => navigate('/admin/consultas')}
              >
                Ver todas
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="dashboard-card-content-unique">
              <div className="dashboard-table-container-unique">
                <table className="dashboard-table-unique">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Propiedad</th>
                      <th>Fecha</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimasConsultas.map(consulta => (
                      <tr key={consulta.id} className="dashboard-table-row-unique">
                        <td>
                          <div className="dashboard-contact-info-unique">
                            <span className="dashboard-contact-name-unique">{consulta.nombre}</span>
                          </div>
                        </td>
                        <td>{consulta.email}</td>
                        <td>{consulta.propiedad}</td>
                        <td>{consulta.fecha}</td>
                        <td>
                          <button className="dashboard-table-btn-unique">
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Propiedades destacadas */}
          <div className="dashboard-card-unique">
            <div className="dashboard-card-header-unique">
              <h2 className="dashboard-card-title-unique">Propiedades Destacadas</h2>
              <button 
                className="dashboard-card-link-unique"
                onClick={() => navigate('/admin/propiedades')}
              >
                Gestionar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="dashboard-card-content-unique">
              {propiedadesDestacadas.map(prop => (
                <div key={prop.id} className="dashboard-property-item-unique">
                  <div className="dashboard-property-info-unique">
                    <h3 className="dashboard-property-title-unique">{prop.titulo}</h3>
                    <span className="dashboard-property-price-unique">{prop.precio}</span>
                  </div>
                  <span className={`dashboard-property-badge-unique dashboard-property-${prop.tipo}-unique`}>
                    {prop.tipo === 'venta' ? 'Venta' : 'Alquiler'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="dashboard-quick-actions-unique">
          <h2 className="dashboard-quick-title-unique">Acciones Rápidas</h2>
          <div className="dashboard-actions-grid-unique">
            <button 
              className="dashboard-action-btn-unique"
              onClick={() => navigate('/admin/publicarPropiedad')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span>Publicar Propiedad</span>
            </button>
            <button 
              className="dashboard-action-btn-unique"
              onClick={() => navigate('/admin/consultas')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Ver Consultas</span>
            </button>
            <button 
              className="dashboard-action-btn-unique"
              onClick={() => navigate('/admin/configuracion')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62z" />
              </svg>
              <span>Configuración</span>
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Dashboard;