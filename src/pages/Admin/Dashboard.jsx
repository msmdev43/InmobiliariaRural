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
    // Aquí irían las llamadas a la API
    // Simulamos datos para mostrar el diseño
    setTimeout(() => {
      setStats({
        totalPropiedades: 45,
        disponibles: 32,
        vendidas: 13,
        consultasPendientes: 3
      });

      setUltimasConsultas([
        { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', fecha: '2024-01-15', propiedad: 'Campo en Tandil' },
        { id: 2, nombre: 'María García', email: 'maria@email.com', fecha: '2024-01-14', propiedad: 'Chacra en Lobos' },
        { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', fecha: '2024-01-13', propiedad: 'Estancia en Azul' },
      ]);

      setPropiedadesDestacadas([
        { id: 1, titulo: 'Campo en Tandil', precio: '$150,000', tipo: 'venta' },
        { id: 2, titulo: 'Chacra en Lobos', precio: '$85,000', tipo: 'venta' },
        { id: 3, titulo: 'Quinta en Pilar', precio: '$45,000', tipo: 'alquiler' },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Sidebar>
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-date">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(0, 106, 78, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Propiedades</span>
              <span className="stat-value">{stats.totalPropiedades}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">Disponibles</span>
              <span className="stat-value">{stats.disponibles}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">Vendidas/Alquiladas</span>
              <span className="stat-value">{stats.vendidas}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="stat-content">
              <span className="stat-label">Consultas Pendientes</span>
              <span className="stat-value">{stats.consultasPendientes}</span>
            </div>
          </div>
        </div>

        {/* Gráfico simple y tablas */}
        <div className="dashboard-grid">
          {/* Últimas consultas */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Últimas Consultas</h2>
              <a href="/admin/consultas" className="card-link">Ver todas</a>
            </div>
            <div className="card-content">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Propiedad</th>
                    <th>Fecha</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasConsultas.map(consulta => (
                    <tr key={consulta.id}>
                      <td>{consulta.nombre}</td>
                      <td>{consulta.email}</td>
                      <td>{consulta.propiedad}</td>
                      <td>{consulta.fecha}</td>
                      <td>
                        <button className="table-btn">Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Propiedades destacadas */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Propiedades Destacadas</h2>
              <a href="/admin/propiedades" className="card-link">Gestionar</a>
            </div>
            <div className="card-content">
              {propiedadesDestacadas.map(prop => (
                <div key={prop.id} className="property-item">
                  <div className="property-info">
                    <h3>{prop.titulo}</h3>
                    <span className="property-price">{prop.precio}</span>
                  </div>
                  <span className={`property-type ${prop.tipo}`}>
                    {prop.tipo === 'venta' ? 'Venta' : 'Alquiler'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span>Nueva Propiedad</span>
            </button>
            <button className="action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Ver Consultas</span>
            </button>
            <button className="action-btn">
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