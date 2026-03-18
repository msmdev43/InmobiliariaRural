// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Propiedades\ListaPropiedades.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Admin/Sidebar';
import apiService from '../../../services/api.service';
import { useToast, ToastContainer } from '../../../components/UI/Toast';
import '../../../styles/pages/Admin/propiedades/ListaPropiedades.css';

// ============================================================================
// COMPONENTES INTERNOS
// ============================================================================

/**
 * Badge de tipo de campo (Chacra, Campo, Estancia, etc.)
 */
const TipoCampoBadge = ({ tipo }) => {
  const colores = {
    'Chacra': { bg: '#e6f7f0', color: '#006A4E' },
    'Campo': { bg: '#fff4e6', color: '#b85e00' },
    'Estancia': { bg: '#e6e9ff', color: '#3b4ba0' },
    'Quinta': { bg: '#ffe6f0', color: '#b3005e' },
    'default': { bg: '#f1f5f9', color: '#475569' }
  };

  const estilo = colores[tipo] || colores.default;

  return (
    <span 
      className="tipo-campo-badge"
      style={{
        backgroundColor: estilo.bg,
        color: estilo.color,
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '0.75rem',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        display: 'inline-block'
      }}
    >
      {tipo}
    </span>
  );
};

/**
 * Indicador de estado (punto verde para disponible)
 */
const EstadoIndicador = ({ disponible }) => {
  if (!disponible) return null;
  
  return (
    <span className="estado-indicador" title="Disponible">
      <span className="estado-punto"></span>
      <span className="estado-texto">Disponible</span>
    </span>
  );
};

/**
 * Formato de precio mejorado
 */
const PrecioFormateado = ({ precio, moneda }) => {
  const formatoMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda === 'USD' ? 'USD' : 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return (
    <span className="precio-formateado">
      {formatoMoneda.format(precio)}
    </span>
  );
};

/**
 * Celda de Ubicación formateada
 */
const UbicacionFormateada = ({ ciudad, provincia, zona }) => (
  <div className="ubicacion-formateada">
    <span className="ubicacion-linea1">{ciudad}</span>
    <span className="ubicacion-linea2">{provincia}</span>
    <span className="ubicacion-linea3">{zona}</span>
  </div>
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const ListaPropiedades = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [propiedades, setPropiedades] = useState([]);
  const [filtros, setFiltros] = useState({
    buscar: '',
    tipo_operacion: '',
    provincia: '',
    ciudad: '',
    precio_min: '',
    precio_max: '',
    destacado: '',
    estado: '',
    incluir_eliminados: false
  });
  const [filtrosDisponibles, setFiltrosDisponibles] = useState({
    provincias: [],
    ciudades: [],
    tipos_operacion: ['alquiler', 'venta'],
    estados: ['disponible', 'vendido', 'alquilado', 'reservado']
  });
  const [paginacion, setPaginacion] = useState({
    pagina_actual: 1,
    por_pagina: 20,
    total_registros: 0,
    total_paginas: 0
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [accionEliminar, setAccionEliminar] = useState('eliminar'); // eliminar, restaurar, eliminar_permanentemente

  useEffect(() => {
    cargarPropiedades();
  }, []);

  const cargarPropiedades = async (pagina = 1) => {
    try {
      setLoading(true);
      
      // Construir query params
      const params = new URLSearchParams();
      if (filtros.buscar) params.append('buscar', filtros.buscar);
      if (filtros.tipo_operacion) params.append('tipo_operacion', filtros.tipo_operacion);
      if (filtros.provincia) params.append('provincia', filtros.provincia);
      if (filtros.ciudad) params.append('ciudad', filtros.ciudad);
      if (filtros.precio_min) params.append('precio_min', filtros.precio_min);
      if (filtros.precio_max) params.append('precio_max', filtros.precio_max);
      if (filtros.destacado) params.append('destacado', filtros.destacado);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.incluir_eliminados) params.append('incluir_eliminados', 'true');
      
      params.append('pagina', pagina);
      params.append('por_pagina', paginacion.por_pagina);

      const response = await apiService.getPropiedades(params.toString());
      
      if (response.success) {
        setPropiedades(response.data || []);
        setPaginacion(response.paginacion || {
          pagina_actual: pagina,
          por_pagina: paginacion.por_pagina,
          total_registros: 0,
          total_paginas: 0
        });
        if (response.filtros_disponibles) {
          setFiltrosDisponibles(prev => ({
            ...prev,
            ...response.filtros_disponibles
          }));
        }
      } else {
        toast.error(response.message || 'Error al cargar propiedades');
      }
    } catch (error) {
      console.error('Error cargando propiedades:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarPropiedades(1);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      buscar: '',
      tipo_operacion: '',
      provincia: '',
      ciudad: '',
      precio_min: '',
      precio_max: '',
      destacado: '',
      estado: '',
      incluir_eliminados: false
    });
    setTimeout(() => cargarPropiedades(1), 100);
  };

  const handleCambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= paginacion.total_paginas) {
      cargarPropiedades(nuevaPagina);
    }
  };

  const handleVerPropiedad = (id) => {
    navigate(`/admin/propiedades/${id}`);
  };

  const handleEditarPropiedad = (id) => {
    navigate(`/admin/propiedades/editar/${id}`);
  };

  const handlePublicarNueva = () => {
    navigate('/admin/publicarPropiedad');
  };

  const handleEliminarClick = (propiedad, accion) => {
    setPropiedadSeleccionada(propiedad);
    setAccionEliminar(accion);
    setModalEliminar(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!propiedadSeleccionada) return;

    try {
      const response = await apiService.eliminarPropiedad(
        propiedadSeleccionada.id, 
        accionEliminar
      );
      
      if (response.success) {
        toast.success(response.message);
        setModalEliminar(false);
        setPropiedadSeleccionada(null);
        cargarPropiedades(paginacion.pagina_actual);
      } else {
        toast.error(response.message || 'Error al ejecutar la acción');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  if (loading && propiedades.length === 0) {
    return (
      <Sidebar>
        <div className="lista-loading-unique">
          <div className="lista-spinner-unique"></div>
          <p className="lista-loading-text-unique">Cargando propiedades...</p>
        </div>
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="lista-page-unique">
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
        
        {/* Header */}
        <div className="lista-header-unique">
          <div className="lista-header-content-unique">
            <h1 className="lista-title-unique">Propiedades</h1>
            <p className="lista-subtitle-unique">
              Total: <strong>{paginacion.total_registros}</strong> propiedades
            </p>
          </div>
          <button 
            type="button" 
            onClick={handlePublicarNueva} 
            className="lista-btn-nuevo-unique"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Nueva Propiedad
          </button>
        </div>

        {/* Barra de búsqueda rápida */}
        <form onSubmit={handleBuscar} className="lista-search-unique">
          <div className="lista-search-wrapper-unique">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por título, código, descripción, ciudad..."
              value={filtros.buscar}
              onChange={(e) => setFiltros({...filtros, buscar: e.target.value})}
              className="lista-search-input-unique"
            />
            <button type="submit" className="lista-search-btn-unique">Buscar</button>
          </div>
          <button 
            type="button" 
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className={`lista-filtros-toggle-unique ${mostrarFiltros ? 'activo' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
            </svg>
            Filtros
          </button>
        </form>

        {/* Filtros avanzados */}
        {mostrarFiltros && (
          <div className="lista-filtros-avanzados-unique">
            <div className="lista-filtros-grid-unique">
              <div className="lista-filtro-grupo-unique">
                <label className="lista-filtro-label-unique">Tipo de operación</label>
                <select 
                  value={filtros.tipo_operacion} 
                  onChange={(e) => setFiltros({...filtros, tipo_operacion: e.target.value})}
                  className="lista-filtro-select-unique"
                >
                  <option value="">Todos</option>
                  {filtrosDisponibles.tipos_operacion.map(tipo => (
                    <option key={tipo} value={tipo}>
                      {tipo === 'alquiler' ? 'Alquiler' : 'Venta'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lista-filtro-grupo-unique">
                <label className="lista-filtro-label-unique">Provincia</label>
                <select 
                  value={filtros.provincia} 
                  onChange={(e) => setFiltros({...filtros, provincia: e.target.value})}
                  className="lista-filtro-select-unique"
                >
                  <option value="">Todas</option>
                  {filtrosDisponibles.provincias.map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              <div className="lista-filtro-grupo-unique">
                <label className="lista-filtro-label-unique">Ciudad</label>
                <select 
                  value={filtros.ciudad} 
                  onChange={(e) => setFiltros({...filtros, ciudad: e.target.value})}
                  className="lista-filtro-select-unique"
                >
                  <option value="">Todas</option>
                  {filtrosDisponibles.ciudades.map(ciudad => (
                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                  ))}
                </select>
              </div>

              <div className="lista-filtro-grupo-unique">
                <label className="lista-filtro-label-unique">Estado</label>
                <select 
                  value={filtros.estado} 
                  onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                  className="lista-filtro-select-unique"
                >
                  <option value="">Todos</option>
                  {filtrosDisponibles.estados.map(est => (
                    <option key={est} value={est}>
                      {est.charAt(0).toUpperCase() + est.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lista-filtro-grupo-unique">
                <label className="lista-filtro-label-unique">Precio mínimo</label>
                <input
                  type="number"
                  value={filtros.precio_min}
                  onChange={(e) => setFiltros({...filtros, precio_min: e.target.value})}
                  placeholder="Ej: 50000"
                  className="lista-filtro-input-unique"
                />
              </div>

              <div className="lista-filtro-grupo-unique">
                <label className="lista-filtro-label-unique">Precio máximo</label>
                <input
                  type="number"
                  value={filtros.precio_max}
                  onChange={(e) => setFiltros({...filtros, precio_max: e.target.value})}
                  placeholder="Ej: 500000"
                  className="lista-filtro-input-unique"
                />
              </div>

              <div className="lista-filtro-grupo-unique lista-filtro-checkbox-unique">
                <label>
                  <input
                    type="checkbox"
                    checked={filtros.destacado === '1'}
                    onChange={(e) => setFiltros({...filtros, destacado: e.target.checked ? '1' : ''})}
                  />
                  Solo destacados
                </label>
              </div>

              <div className="lista-filtro-grupo-unique lista-filtro-checkbox-unique">
                <label>
                  <input
                    type="checkbox"
                    checked={filtros.incluir_eliminados}
                    onChange={(e) => setFiltros({...filtros, incluir_eliminados: e.target.checked})}
                  />
                  Incluir eliminados
                </label>
              </div>
            </div>

            <div className="lista-filtros-acciones-unique">
              <button onClick={handleLimpiarFiltros} className="lista-filtros-limpiar-unique">
                Limpiar filtros
              </button>
              <button onClick={() => cargarPropiedades(1)} className="lista-filtros-aplicar-unique">
                Aplicar filtros
              </button>
            </div>
          </div>
        )}

        {/* Tabla de propiedades - VERSIÓN MEJORADA */}
        {propiedades.length > 0 ? (
          <div className="lista-tabla-container-unique">
            <table className="lista-tabla-unique">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Ubicación</th>
                  <th>Superficie</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {propiedades.map(prop => (
                  <tr key={prop.id} className={prop.deleted_at ? 'fila-eliminada' : ''}>
                    {/* Código */}
                    <td className="columna-codigo">
                      <span className="codigo-texto">{prop.codigo}</span>
                      {prop.destacado && (
                        <span className="destacado-estrella" title="Destacado">★</span>
                      )}
                    </td>

                    {/* Tipo (ahora muestra tipo_campo) */}
                    <td className="columna-tipo">
                      <TipoCampoBadge tipo={prop.tipo_campo} />
                    </td>

                    {/* Ubicación formateada */}
                    <td className="columna-ubicacion">
                      <UbicacionFormateada 
                        ciudad={prop.ciudad}
                        provincia={prop.provincia}
                        zona={prop.zona}
                      />
                    </td>

                    {/* Superficie */}
                    <td className="columna-superficie">
                      <span className="superficie-valor">{prop.superficie}</span>
                      <span className="superficie-unidad">ha</span>
                    </td>

                    {/* Precio formateado */}
                    <td className="columna-precio">
                      <PrecioFormateado 
                        precio={prop.precio} 
                        moneda={prop.moneda} 
                      />
                    </td>

                    {/* Estado (punto verde) y estadísticas */}
                    <td className="columna-estado">
                      <EstadoIndicador disponible={prop.estado === 'disponible' && !prop.deleted_at} />
                      <div className="estadisticas-mini">
                        <span className="stat-icon" title="Vistas">👁️ {prop.vistas}</span>
                        <span className="stat-icon" title="Consultas">💬 {prop.consultas}</span>
                        <span className="stat-icon" title="Imágenes">📷 {prop.total_imagenes}</span>
                      </div>
                    </td>

                    {/* Acciones en fila */}
                    <td className="columna-acciones">
                      <div className="acciones-fila">
                        <button
                          onClick={() => handleVerPropiedad(prop.id)}
                          className="accion-btn accion-ver"
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                        
                        {prop.puede_editar && !prop.deleted_at && (
                          <button
                            onClick={() => handleEditarPropiedad(prop.id)}
                            className="accion-btn accion-editar"
                            title="Editar"
                          >
                            ✏️
                          </button>
                        )}
                        
                        {prop.deleted_at ? (
                          <>
                            <button
                              onClick={() => handleEliminarClick(prop, 'restaurar')}
                              className="accion-btn accion-restaurar"
                              title="Restaurar"
                            >
                              🔄
                            </button>
                            <button
                              onClick={() => handleEliminarClick(prop, 'eliminar_permanentemente')}
                              className="accion-btn accion-eliminar-perm"
                              title="Eliminar permanentemente"
                            >
                              🗑️
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEliminarClick(prop, 'eliminar')}
                            className="accion-btn accion-eliminar"
                            title="Dar de baja"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="lista-empty-unique">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="15" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
            <h3 className="lista-empty-title-unique">No hay propiedades</h3>
            <p className="lista-empty-text-unique">
              {filtros.buscar || filtros.tipo_operacion || filtros.provincia 
                ? 'No se encontraron propiedades con los filtros aplicados'
                : 'Comienza publicando tu primera propiedad'}
            </p>
            {(filtros.buscar || filtros.tipo_operacion || filtros.provincia) && (
              <button className="lista-empty-link-unique" onClick={handleLimpiarFiltros}>
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Paginación */}
        {paginacion.total_paginas > 1 && (
          <div className="lista-paginacion-unique">
            <button
              onClick={() => handleCambiarPagina(paginacion.pagina_actual - 1)}
              disabled={paginacion.pagina_actual === 1}
              className="lista-paginacion-btn-unique"
            >
              ← Anterior
            </button>
            
            <span className="lista-paginacion-info-unique">
              Página {paginacion.pagina_actual} de {paginacion.total_paginas}
            </span>
            
            <button
              onClick={() => handleCambiarPagina(paginacion.pagina_actual + 1)}
              disabled={paginacion.pagina_actual === paginacion.total_paginas}
              className="lista-paginacion-btn-unique"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Modal de confirmación para eliminar/restaurar */}
        {modalEliminar && propiedadSeleccionada && (
          <div className="lista-modal-overlay-unique" onClick={() => setModalEliminar(false)}>
            <div className="lista-modal-unique" onClick={e => e.stopPropagation()}>
              <div className="lista-modal-header-unique">
                <h3 className="lista-modal-title-unique">
                  {accionEliminar === 'eliminar' && 'Confirmar baja'}
                  {accionEliminar === 'restaurar' && 'Confirmar restauración'}
                  {accionEliminar === 'eliminar_permanentemente' && 'Confirmar eliminación permanente'}
                </h3>
                <button className="lista-modal-close-unique" onClick={() => setModalEliminar(false)}>
                  ×
                </button>
              </div>
              
              <div className="lista-modal-body-unique">
                <p>
                  {accionEliminar === 'eliminar' && `¿Estás seguro de dar de baja la propiedad "${propiedadSeleccionada.titulo}"?`}
                  {accionEliminar === 'restaurar' && `¿Restaurar la propiedad "${propiedadSeleccionada.titulo}"?`}
                  {accionEliminar === 'eliminar_permanentemente' && `⚠️ ¿ELIMINAR PERMANENTEMENTE "${propiedadSeleccionada.titulo}"? Esta acción no se puede deshacer.`}
                </p>
                <p className="lista-modal-info-unique">
                  Código: {propiedadSeleccionada.codigo}
                </p>
              </div>
              
              <div className="lista-modal-footer-unique">
                <button 
                  className="lista-modal-btn-cancelar-unique" 
                  onClick={() => setModalEliminar(false)}
                >
                  Cancelar
                </button>
                <button 
                  className={`lista-modal-btn-confirmar-unique ${
                    accionEliminar === 'eliminar_permanentemente' ? 'eliminar-perm' : ''
                  }`}
                  onClick={handleConfirmarEliminar}
                >
                  {accionEliminar === 'eliminar' && 'Dar de baja'}
                  {accionEliminar === 'restaurar' && 'Restaurar'}
                  {accionEliminar === 'eliminar_permanentemente' && 'Eliminar permanentemente'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default ListaPropiedades;