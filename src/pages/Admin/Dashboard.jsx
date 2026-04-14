// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api.service';
import { useToast, ToastContainer } from '../../components/UI/Toast';
import UltimasConsultas from '../../components/Admin/UltimasConsultas';
import UltimasPropiedades from '../../components/Admin/UltimasPropiedades';
import '../../styles/pages/Admin/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [loadingConsultas, setLoadingConsultas] = useState(true);
  const [loadingPropiedades, setLoadingPropiedades] = useState(true);
  const [stats, setStats] = useState({
    totalPropiedades: 0,
    propiedadesDestacadas: 0,
    consultasHoy: 0
  });
  const [ultimasConsultas, setUltimasConsultas] = useState([]);
  const [ultimasPropiedades, setUltimasPropiedades] = useState([]);

  useEffect(() => {
    cargarDatosDashboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      setLoading(true);
      setLoadingConsultas(true);
      setLoadingPropiedades(true);
      
      // Cargar estadísticas del dashboard
      try {
        const estadisticasResponse = await apiService.getEstadisticasDashboard();
        
        if (estadisticasResponse.success) {
          setStats({
            totalPropiedades: estadisticasResponse.data.totalPropiedades || 0,
            propiedadesDestacadas: estadisticasResponse.data.propiedadesDestacadas || 0,
            consultasHoy: estadisticasResponse.data.consultasHoy || 0
          });
        } else {
          console.error('Error en respuesta de estadísticas:', estadisticasResponse.message);
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      }
      
      // Cargar últimas consultas
      try {
        const consultasResponse = await apiService.getUltimasConsultas(5);
        
        if (consultasResponse.success) {
          setUltimasConsultas(consultasResponse.data || []);
        } else {
          console.error('Error en respuesta de consultas:', consultasResponse.message);
          setUltimasConsultas([]);
        }
      } catch (error) {
        console.error('Error cargando consultas:', error);
        setUltimasConsultas([]);
      } finally {
        setLoadingConsultas(false);
      }

      // Cargar últimas propiedades
      try {
        const propiedadesResponse = await apiService.getUltimasPropiedades(10);
        
        if (propiedadesResponse.success) {
          setUltimasPropiedades(propiedadesResponse.data || []);
        } else {
          console.error('Error en respuesta de propiedades:', propiedadesResponse.message);
          setUltimasPropiedades([]);
        }
      } catch (error) {
        console.error('Error cargando propiedades:', error);
        setUltimasPropiedades([]);
      } finally {
        setLoadingPropiedades(false);
      }
      
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Función para ver detalle de consulta
  const handleVerConsulta = (consultaId) => {
    navigate(`/admin/consultas?consulta=${consultaId}`);
  };

  // Función para ver detalle de propiedad
  const handleVerPropiedad = (propiedadId) => {
    navigate(`/admin/propiedades/${propiedadId}`);
  };

  if (loading) {
    return (
      <Sidebar>
        <div className="dashboard-loading-unique">
          <div className="dashboard-spinner-unique"></div>
          <p className="dashboard-loading-text-unique">Cargando dashboard...</p>
        </div>
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="dashboard-page-unique">
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
        
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

        {/* Tarjetas de estadísticas - Solo 3 */}
        <div className="dashboard-stats-grid-unique">
          {/* Tarjeta 1: Total Propiedades */}
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

          {/* Tarjeta 2: Propiedades Destacadas */}
          <div className="dashboard-stat-card-unique">
            <div className="dashboard-stat-icon-unique" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="dashboard-stat-content-unique">
              <span className="dashboard-stat-label-unique">Propiedades Destacadas</span>
              <span className="dashboard-stat-value-unique">{stats.propiedadesDestacadas}</span>
            </div>
          </div>

          {/* Tarjeta 3: Consultas Hoy */}
          <div className="dashboard-stat-card-unique">
            <div className="dashboard-stat-icon-unique" style={{ background: 'rgba(249, 115, 22, 0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="dashboard-stat-content-unique">
              <span className="dashboard-stat-label-unique">Consultas Hoy</span>
              <span className="dashboard-stat-value-unique">{stats.consultasHoy}</span>
            </div>
          </div>
        </div>

        {/* Grid principal - Dos columnas */}
        <div className="dashboard-main-grid-unique">
          {/* Últimas consultas */}
          <UltimasConsultas 
            consultas={ultimasConsultas}
            loading={loadingConsultas}
            onVerConsulta={handleVerConsulta}
          />

          {/* Últimas propiedades */}
          <UltimasPropiedades 
            propiedades={ultimasPropiedades}
            loading={loadingPropiedades}
            onVerPropiedad={handleVerPropiedad}
          />
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