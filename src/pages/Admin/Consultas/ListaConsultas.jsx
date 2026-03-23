// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Consultas\ListaConsultas.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from '../../../components/Admin/Sidebar';
import apiService from '../../../services/api.service';
import { useToast, ToastContainer } from '../../../components/UI/Toast';
import VerConsulta from './VerConsulta';
import '../../../styles/pages/Admin/Consultas.css';

// Componente para el badge de tipo de consulta
const TipoBadge = ({ tipo }) => {
  const tipos = {
    propiedad: { bg: '#e6f7f0', color: '#006A4E', icon: '🏠', texto: 'Propiedad' },
    arrendamiento: { bg: '#e0f2fe', color: '#0369a1', icon: '📄', texto: 'Arrendamiento' },
    tasacion: { bg: '#fff4e6', color: '#b85e00', icon: '💰', texto: 'Tasación' },
    venta: { bg: '#f3e8ff', color: '#7e22ce', icon: '🤝', texto: 'Venta' },
    soporte: { bg: '#fee2e2', color: '#dc2626', icon: '🔧', texto: 'Soporte' }
  };

  const style = tipos[tipo] || { bg: '#f1f5f9', color: '#475569', icon: '📝', texto: tipo };

  return (
    <span 
      className="consulta-tipo-badge"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      <span className="consulta-tipo-icon">{style.icon}</span>
      <span className="consulta-tipo-texto">{style.texto}</span>
    </span>
  );
};

const ListaConsultas = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [consultas, setConsultas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ por_tipo: { detalle: [] }, total: 0 });
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
  
  // Estado de filtros
  const [filtros, setFiltros] = useState({
    buscar: '',
    tipo: '',
    fecha_desde: '',
    fecha_hasta: '',
    propiedad_id: ''
  });
  
  const [paginacion, setPaginacion] = useState({
    pagina_actual: 1,
    por_pagina: 20,
    total_registros: 0,
    total_paginas: 0
  });
  
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Ref para evitar cargas múltiples
  const isMounted = useRef(true);
  const loadingRef = useRef(false);

  // Cargar consultas
  const cargarConsultas = useCallback(async (pagina = 1) => {
    // Evitar cargas simultáneas
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filtros.buscar) params.append('buscar', filtros.buscar);
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
      if (filtros.propiedad_id) params.append('propiedad_id', filtros.propiedad_id);
      
      params.append('pagina', pagina);
      params.append('por_pagina', paginacion.por_pagina);

      const response = await apiService.getConsultas(params.toString());
      
      // Verificar si el componente sigue montado
      if (!isMounted.current) return;
      
      if (response.success) {
        setConsultas(response.data || []);
        setEstadisticas(response.estadisticas || { por_tipo: { detalle: [] }, total: 0 });
        setPaginacion(response.paginacion || {
          pagina_actual: pagina,
          por_pagina: paginacion.por_pagina,
          total_registros: 0,
          total_paginas: 0
        });
        toast.success(`✅ Consultas actualizadas (${response.data?.length || 0} registros)`, 2000);
      } else {
        toast.error(response.message || 'Error al cargar consultas');
      }
    } catch (error) {
      console.error('Error cargando consultas:', error);
      if (isMounted.current) {
        toast.error('Error al conectar con el servidor');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      loadingRef.current = false;
    }
  }, [filtros, paginacion.por_pagina, toast]);

  // Cargar datos iniciales - solo una vez
  useEffect(() => {
    isMounted.current = true;
    cargarConsultas();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Función para refrescar manualmente
  const handleRefresh = () => {
    cargarConsultas(paginacion.pagina_actual);
  };

  // Manejar búsqueda
  const handleBuscar = (e) => {
    e.preventDefault();
    cargarConsultas(1);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      buscar: '',
      tipo: '',
      fecha_desde: '',
      fecha_hasta: '',
      propiedad_id: ''
    });
    // Esperar a que se actualice el estado antes de cargar
    setTimeout(() => cargarConsultas(1), 0);
  };

  const handleCambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= paginacion.total_paginas) {
      cargarConsultas(nuevaPagina);
    }
  };

  // Eliminar consulta
  const handleEliminar = async (consulta) => {
    const confirmar = window.confirm(
      `¿Eliminar consulta de ${consulta.nombrecompleto}?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) return;

    try {
      const response = await apiService.eliminarConsulta(consulta.id);
      
      if (response.success) {
        toast.success(response.message);
        cargarConsultas(paginacion.pagina_actual);
      } else {
        toast.error(response.message || 'Error al eliminar la consulta');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  // Ver detalle
  const handleVerMensaje = (consulta) => {
    setConsultaSeleccionada(consulta);
  };

  // Cerrar modal de ver consulta
  const handleCerrarVerConsulta = () => {
    setConsultaSeleccionada(null);
  };

  // Tipos de consulta para el filtro
  const tiposConsulta = [
    { value: 'propiedad', label: '🏠 Propiedad' },
    { value: 'arrendamiento', label: '📄 Arrendamiento' },
    { value: 'tasacion', label: '💰 Tasación' },
    { value: 'venta', label: '🤝 Venta' },
    { value: 'soporte', label: '🔧 Soporte' }
  ];

  if (loading && consultas.length === 0) {
    return (
      <Sidebar>
        <div className="consultas-loading-unique">
          <div className="consultas-spinner-unique"></div>
          <p>Cargando consultas...</p>
        </div>
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="consultas-page-unique">
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
        
        {/* Modal Ver Consulta */}
        {consultaSeleccionada && (
          <VerConsulta 
            consulta={consultaSeleccionada} 
            onClose={handleCerrarVerConsulta} 
          />
        )}
        
        {/* Header */}
        <div className="consultas-header-unique">
          <div className="consultas-header-content-unique">
            <h1 className="consultas-title-unique">Consultas</h1>
            <p className="consultas-subtitle-unique">
              Total: <strong>{paginacion.total_registros}</strong> consultas recibidas
            </p>
          </div>
          <div className="consultas-header-actions-unique">
            <button 
              onClick={handleRefresh} 
              className="consultas-btn-refresh-unique"
              title="Actualizar consultas"
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <form onSubmit={handleBuscar} className="consultas-search-unique">
          <div className="consultas-search-wrapper-unique">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono..."
              value={filtros.buscar}
              onChange={(e) => setFiltros({...filtros, buscar: e.target.value})}
              className="consultas-search-input-unique"
            />
            <button type="submit" className="consultas-search-btn-unique">Buscar</button>
          </div>
          <button 
            type="button" 
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`consultas-filtros-toggle-unique ${mostrarFiltros ? 'activo' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
            </svg>
            Filtros
          </button>
        </form>

        {/* Filtros avanzados */}
        {mostrarFiltros && (
          <div className="consultas-filtros-avanzados-unique">
            <div className="consultas-filtros-linea-unique">
              <div className="consultas-filtro-item-unique">
                <label className="consultas-filtro-label-unique">Tipo</label>
                <select 
                  value={filtros.tipo} 
                  onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                  className="consultas-filtro-select-unique"
                >
                  <option value="">Todos</option>
                  {tiposConsulta.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              <div className="consultas-filtro-item-unique">
                <label className="consultas-filtro-label-unique">Fecha desde</label>
                <input
                  type="date"
                  value={filtros.fecha_desde}
                  onChange={(e) => setFiltros({...filtros, fecha_desde: e.target.value})}
                  className="consultas-filtro-input-unique"
                />
              </div>

              <div className="consultas-filtro-item-unique">
                <label className="consultas-filtro-label-unique">Fecha hasta</label>
                <input
                  type="date"
                  value={filtros.fecha_hasta}
                  onChange={(e) => setFiltros({...filtros, fecha_hasta: e.target.value})}
                  className="consultas-filtro-input-unique"
                />
              </div>

              <div className="consultas-filtros-acciones-unique">
                <button onClick={handleLimpiarFiltros} className="consultas-filtros-limpiar-unique">
                  Limpiar
                </button>
                <button onClick={() => cargarConsultas(1)} className="consultas-filtros-aplicar-unique">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas por tipo */}
        {estadisticas.por_tipo?.detalle?.length > 0 && (
          <div className="consultas-stats-unique">
            {estadisticas.por_tipo.detalle.map(stat => (
              <div key={stat.tipo} className="consultas-stat-card-unique" style={{ borderLeftColor: stat.tipo_color }}>
                <span className="consultas-stat-value-unique">{stat.total}</span>
                <span className="consultas-stat-label-unique">{stat.tipo_texto}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tabla de consultas */}
        {consultas.length > 0 ? (
          <div className="consultas-tabla-container-unique">
            <table className="consultas-tabla-unique">
              <thead>
                <tr>
                  <th>Código Inmueble</th>
                  <th>Fecha y Hora</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {consultas.map(consulta => (
                  <tr key={consulta.id}>
                    <td className="columna-codigo">
                      {consulta.propiedades?.length > 0 ? (
                        <div className="codigos-lista">
                          {consulta.propiedades.map(prop => (
                            <span key={prop.id} className="codigo-badge" title={prop.titulo}>
                              {prop.codigo}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="codigo-badge codigo-vacio">—</span>
                      )}
                     </td>
                    <td className="columna-fecha">
                      <div className="fecha-info">
                        <span className="fecha-principal">{consulta.fecha_formateada}</span>
                      </div>
                    </td>
                    <td className="columna-nombre">
                      <span className="nombre-completo">{consulta.nombrecompleto}</span>
                    </td>
                    <td className="columna-email">
                      {consulta.email ? (
                        <a href={`mailto:${consulta.email}`} className="email-link">
                          {consulta.email}
                        </a>
                      ) : (
                        <span className="email-vacio">—</span>
                      )}
                    </td>
                    <td className="columna-telefono">
                      {consulta.telefono ? (
                        <a href={`tel:${consulta.telefono}`} className="telefono-link">
                          {consulta.telefono}
                        </a>
                      ) : (
                        <span className="telefono-vacio">—</span>
                      )}
                    </td>
                    <td className="columna-tipo">
                      <TipoBadge tipo={consulta.tipo} />
                    </td>
                    <td className="columna-acciones">
                      <div className="acciones-fila">
                        <button
                          onClick={() => handleVerMensaje(consulta)}
                          className="accion-btn accion-ver"
                          title="Ver mensaje completo"
                        >
                          💬
                        </button>
                        <button
                          onClick={() => handleEliminar(consulta)}
                          className="accion-btn accion-eliminar"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="consultas-empty-unique">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <h3 className="consultas-empty-title-unique">No hay consultas</h3>
            <p className="consultas-empty-text-unique">
              {filtros.buscar || filtros.tipo || filtros.fecha_desde
                ? 'No se encontraron consultas con los filtros aplicados'
                : 'Aún no se han recibido consultas'}
            </p>
            {(filtros.buscar || filtros.tipo || filtros.fecha_desde) && (
              <button className="consultas-empty-link-unique" onClick={handleLimpiarFiltros}>
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Paginación */}
        {paginacion.total_paginas > 1 && (
          <div className="consultas-paginacion-unique">
            <button
              onClick={() => handleCambiarPagina(paginacion.pagina_actual - 1)}
              disabled={paginacion.pagina_actual === 1}
              className="consultas-paginacion-btn-unique"
            >
              ← Anterior
            </button>
            
            <span className="consultas-paginacion-info-unique">
              Página {paginacion.pagina_actual} de {paginacion.total_paginas}
            </span>
            
            <button
              onClick={() => handleCambiarPagina(paginacion.pagina_actual + 1)}
              disabled={paginacion.pagina_actual === paginacion.total_paginas}
              className="consultas-paginacion-btn-unique"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default ListaConsultas;