// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Configuracion\Servicios.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Admin/Sidebar';
import apiService from '../../../services/api.service';
import '../../../styles/pages/Admin/Servicios.css';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '' });
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      setLoading(true);
      const response = await apiService.getServicios();
      setServicios(response.data || []);
    } catch (error) {
      console.error('Error cargando servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    try {
      if (editando) {
        await apiService.editarServicio(editando.idservicios, formData);
      } else {
        await apiService.crearServicio(formData);
      }
      
      setModalOpen(false);
      setEditando(null);
      setFormData({ nombre: '' });
      cargarServicios();
    } catch (error) {
      alert('Error al guardar');
    }
  };

  const handleEditar = (servicio) => {
    setEditando(servicio);
    setFormData({ nombre: servicio.nombre });
    setModalOpen(true);
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
    
    try {
      await apiService.eliminarServicio(id);
      cargarServicios();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const serviciosFiltrados = servicios.filter(servicio =>
    servicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Sidebar>
      <div className="servicios-page-unique">
        {/* Header */}
        <div className="servicios-header-unique">
          <div className="servicios-header-content-unique">
            <h1 className="servicios-title-unique">Servicios</h1>
          </div>
          <button className="servicios-btn-nuevo-unique" onClick={() => setModalOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Nuevo Servicio
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="servicios-search-unique">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="servicios-search-input-unique"
          />
          {busqueda && (
            <button className="servicios-search-clear-unique" onClick={() => setBusqueda('')}>
              ×
            </button>
          )}
        </div>

        {/* Contenido principal */}
        {loading ? (
          <div className="servicios-loading-unique">
            <div className="servicios-spinner-unique"></div>
            <p>Cargando servicios...</p>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div className="servicios-stats-unique">
              <div className="servicios-stat-card-unique">
                <span className="servicios-stat-value-unique">{servicios.length}</span>
                <span className="servicios-stat-label-unique">Total de servicios</span>
              </div>
              {busqueda && (
                <div className="servicios-stat-card-unique">
                  <span className="servicios-stat-value-unique">{serviciosFiltrados.length}</span>
                  <span className="servicios-stat-label-unique">Resultados</span>
                </div>
              )}
            </div>

            {/* Grid de servicios */}
            {serviciosFiltrados.length > 0 ? (
              <div className="servicios-grid-unique">
                {serviciosFiltrados.map(servicio => (
                  <div key={servicio.idservicios} className="servicios-card-unique">
                    <div className="servicios-card-icon-unique">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                    </div>
                    <div className="servicios-card-content-unique">
                      <h3 className="servicios-card-title-unique">{servicio.nombre}</h3>
                      <span className="servicios-card-id-unique">ID: {servicio.idservicios}</span>
                    </div>
                    <div className="servicios-card-actions-unique">
                      <button 
                        onClick={() => handleEditar(servicio)}
                        className="servicios-action-btn-unique servicios-action-edit-unique"
                        title="Editar servicio"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleEliminar(servicio.idservicios)}
                        className="servicios-action-btn-unique servicios-action-delete-unique"
                        title="Eliminar servicio"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="servicios-empty-unique">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <h3 className="servicios-empty-title-unique">No hay servicios</h3>
                <p className="servicios-empty-text-unique">
                  {busqueda 
                    ? `No se encontraron servicios que coincidan con "${busqueda}"`
                    : 'Agregá tu primer servicio haciendo clic en "Nuevo Servicio"'}
                </p>
                {busqueda && (
                  <button className="servicios-empty-link-unique" onClick={() => setBusqueda('')}>
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="servicios-modal-overlay-unique" onClick={() => {
            setModalOpen(false);
            setEditando(null);
            setFormData({ nombre: '' });
          }}>
            <div className="servicios-modal-unique" onClick={e => e.stopPropagation()}>
              <div className="servicios-modal-header-unique">
                <h2 className="servicios-modal-title-unique">
                  {editando ? 'Editar Servicio' : 'Nuevo Servicio'}
                </h2>
                <button 
                  className="servicios-modal-close-unique"
                  onClick={() => {
                    setModalOpen(false);
                    setEditando(null);
                    setFormData({ nombre: '' });
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="servicios-modal-body-unique">
                  <div className="servicios-form-group-unique">
                    <label htmlFor="servicio-nombre" className="servicios-form-label-unique">
                      Nombre del servicio
                    </label>
                    <input
                      id="servicio-nombre"
                      type="text"
                      placeholder="Ej: Agua Corriente, Energía Eléctrica, etc."
                      value={formData.nombre}
                      onChange={(e) => setFormData({ nombre: e.target.value })}
                      className="servicios-form-input-unique"
                      autoFocus
                      required
                    />
                    <small className="servicios-form-hint-unique">
                      Este servicio aparecerá en el listado de propiedades
                    </small>
                  </div>
                </div>
                <div className="servicios-modal-footer-unique">
                  <button 
                    type="button" 
                    className="servicios-btn-cancelar-unique"
                    onClick={() => {
                      setModalOpen(false);
                      setEditando(null);
                      setFormData({ nombre: '' });
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="servicios-btn-guardar-unique"
                    disabled={!formData.nombre.trim()}
                  >
                    {editando ? 'Guardar Cambios' : 'Crear Servicio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default Servicios;