// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api.service';
import { useToast, ToastContainer } from '../../components/UI/Toast';
import UltimasConsultas from '../../components/Admin/ultimasConsultas';
import '../../styles/pages/Admin/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [loadingConsultas, setLoadingConsultas] = useState(true);
  const [stats, setStats] = useState({
    totalPropiedades: 0,
    disponibles: 0,
    vendidas: 0,
    consultasHoy: 0
  });
  const [ultimasConsultas, setUltimasConsultas] = useState([]);
  const [propiedadesDestacadas, setPropiedadesDestacadas] = useState([]);

  useEffect(() => {
    cargarDatosDashboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      setLoading(true);
      setLoadingConsultas(true);
      
      // Cargar últimas consultas
      try {
        const consultasResponse = await apiService.getUltimasConsultas(5);
        
        if (consultasResponse.success) {
          setUltimasConsultas(consultasResponse.data || []);
          // Solo guardar las consultas de hoy para la estadística
          const consultasHoy = consultasResponse.estadisticas?.hoy || 0;
          setStats(prev => ({ ...prev, consultasHoy }));
        }
      } catch (error) {
        console.error('Error cargando consultas:', error);
      } finally {
        setLoadingConsultas(false);
      }

      // Cargar propiedades destacadas
      try {
        const destacadasResponse = await apiService.getPropiedadesDestacadas();
        
        if (destacadasResponse.success) {
          setPropiedadesDestacadas(destacadasResponse.data || []);
        }
      } catch (error) {
        console.error('Error cargando propiedades destacadas:', error);
      }

      // Cargar estadísticas de propiedades
      try {
        const propiedadesResponse = await apiService.getPropiedades();
        
        if (propiedadesResponse.success) {
          const props = propiedadesResponse.data || [];
          setStats(prev => ({
            ...prev,
            totalPropiedades: props.length,
            disponibles: props.filter(p => p.estado === 'disponible' && !p.deleted_at).length,
            vendidas: props.filter(p => p.estado === 'vendido' || p.estado === 'alquilado').length
          }));
        }
      } catch (error) {
        console.error('Error cargando propiedades:', error);
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
              <span className="dashboard-stat-label-unique">Consultas Hoy</span>
              <span className="dashboard-stat-value-unique">{stats.consultasHoy}</span>
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div className="dashboard-main-grid-unique">
          {/* Últimas consultas - Componente separado */}
          <UltimasConsultas 
            consultas={ultimasConsultas}
            loading={loadingConsultas}
            onVerConsulta={handleVerConsulta}
          />

          {/* Propiedades destacadas */}
          <div className="dashboard-card-unique">
            <div className="dashboard-card-header-unique">
              <h2 className="dashboard-card-title-unique">Propiedades Destacadas</h2>
              <button 
                className="dashboard-card-link-unique"
                onClick={() => navigate('/admin/propiedades?destacados=1')}
              >
                Gestionar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="dashboard-card-content-unique">
              {propiedadesDestacadas.length > 0 ? (
                propiedadesDestacadas.map(prop => (
                  <div key={prop.id} className="dashboard-property-item-unique">
                    <div className="dashboard-property-info-unique">
                      <h3 className="dashboard-property-title-unique">{prop.titulo}</h3>
                      <div className="dashboard-property-details-unique">
                        <span className="dashboard-property-price-unique">
                          {prop.precio_formateado} {prop.moneda}
                        </span>
                        <span className={`dashboard-property-badge-unique dashboard-property-${prop.tipo_operacion}-unique`}>
                          {prop.tipo_operacion === 'venta' ? 'Venta' : 'Alquiler'}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="dashboard-property-view-unique"
                      onClick={() => navigate(`/admin/propiedades/${prop.id}`)}
                      title="Ver propiedad"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="dashboard-empty-unique">
                  <p>No hay propiedades destacadas</p>
                </div>
              )}
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
              onClick={() => navigate('/admin/configuracion/servicios')}
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