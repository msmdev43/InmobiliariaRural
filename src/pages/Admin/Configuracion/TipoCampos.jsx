// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Configuracion\TiposCampos.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Admin/Sidebar';
import apiService from '../../../services/api.service';
import '../../../styles/pages/Admin/TiposCampos.css';

const TiposCampos = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '' });
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarTipos();
  }, []);

  const cargarTipos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getTiposCampos();
      setTipos(response.data || []);
    } catch (error) {
      console.error('Error cargando tipos:', error);
      setError('Error al cargar los tipos de campo. Por favor, intenta de nuevo.');
      setTipos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    try {
      setError('');
      let response;
      
      if (editando) {
        // Usar modificarTipoCampo en lugar de editarTipoCampo
        response = await apiService.modificarTipoCampo(editando.id, { nombre: formData.nombre });
      } else {
        response = await apiService.crearTipoCampo({ nombre: formData.nombre });
      }
      
      if (response && response.success) {
        setModalOpen(false);
        setEditando(null);
        setFormData({ nombre: '' });
        cargarTipos();
      } else {
        setError(response?.message || 'Error al guardar el tipo de campo');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setError(error.message || 'Error al guardar el tipo de campo');
    }
  };

  const handleEditar = (tipo) => {
    setEditando(tipo);
    setFormData({ nombre: tipo.nombre });
    setModalOpen(true);
    setError('');
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este tipo de campo?')) return;
    
    try {
      setError('');
      const response = await apiService.eliminarTipoCampo(id);
      
      if (response && response.success) {
        cargarTipos();
      } else {
        alert(response?.message || 'Error al eliminar el tipo de campo');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert(error.message || 'Error al eliminar el tipo de campo');
    }
  };

  const tiposFiltrados = tipos.filter(tipo =>
    tipo.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Sidebar>
      <div className="tiposcampos-page-unique">
        {/* Header */}
        <div className="tiposcampos-header-unique">
          <div className="tiposcampos-header-content-unique">
            <h1 className="tiposcampos-title-unique">Tipos de Campos</h1>
          </div>
          <button 
            className="tiposcampos-btn-nuevo-unique" 
            onClick={() => {
              setEditando(null);
              setFormData({ nombre: '' });
              setError('');
              setModalOpen(true);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Nuevo Tipo de Campo
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="tiposcampos-search-unique">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar tipo de campo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="tiposcampos-search-input-unique"
          />
          {busqueda && (
            <button className="tiposcampos-search-clear-unique" onClick={() => setBusqueda('')}>
              ×
            </button>
          )}
        </div>

        {/* Mensaje de error */}
        {error && !modalOpen && (
          <div className="tiposcampos-error-unique">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
            <button onClick={cargarTipos} className="tiposcampos-error-retry-unique">
              Reintentar
            </button>
          </div>
        )}

        {/* Contenido principal */}
        {loading ? (
          <div className="tiposcampos-loading-unique">
            <div className="tiposcampos-spinner-unique"></div>
            <p className="tiposcampos-loading-text-unique">Cargando tipos de campo...</p>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div className="tiposcampos-stats-unique">
              <div className="tiposcampos-stat-card-unique">
                <span className="tiposcampos-stat-value-unique">{tipos.length}</span>
                <span className="tiposcampos-stat-label-unique">Total de tipos</span>
              </div>
              {busqueda && (
                <div className="tiposcampos-stat-card-unique">
                  <span className="tiposcampos-stat-value-unique">{tiposFiltrados.length}</span>
                  <span className="tiposcampos-stat-label-unique">Resultados</span>
                </div>
              )}
            </div>

            {/* Grid de tipos */}
            {tiposFiltrados.length > 0 ? (
              <div className="tiposcampos-grid-unique">
                {tiposFiltrados.map(tipo => (
                  <div key={tipo.id} className="tiposcampos-card-unique">
                    <div className="tiposcampos-card-icon-unique">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div className="tiposcampos-card-content-unique">
                      <h3 className="tiposcampos-card-title-unique">{tipo.nombre}</h3>
                      <span className="tiposcampos-card-id-unique">ID: {tipo.id}</span>
                    </div>
                    <div className="tiposcampos-card-actions-unique">
                      <button 
                        onClick={() => handleEditar(tipo)}
                        className="tiposcampos-action-btn-unique tiposcampos-action-edit-unique"
                        title="Editar tipo"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleEliminar(tipo.id)}
                        className="tiposcampos-action-btn-unique tiposcampos-action-delete-unique"
                        title="Eliminar tipo"
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
              <div className="tiposcampos-empty-unique">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <h3 className="tiposcampos-empty-title-unique">No hay tipos de campo</h3>
                <p className="tiposcampos-empty-text-unique">
                  {busqueda 
                    ? `No se encontraron tipos que coincidan con "${busqueda}"`
                    : 'Agregá tu primer tipo de campo haciendo clic en "Nuevo Tipo de Campo"'}
                </p>
                {busqueda && (
                  <button className="tiposcampos-empty-link-unique" onClick={() => setBusqueda('')}>
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="tiposcampos-modal-overlay-unique" onClick={() => {
            setModalOpen(false);
            setEditando(null);
            setFormData({ nombre: '' });
            setError('');
          }}>
            <div className="tiposcampos-modal-unique" onClick={e => e.stopPropagation()}>
              <div className="tiposcampos-modal-header-unique">
                <h2 className="tiposcampos-modal-title-unique">
                  {editando ? 'Editar Tipo de Campo' : 'Nuevo Tipo de Campo'}
                </h2>
                <button 
                  className="tiposcampos-modal-close-unique"
                  onClick={() => {
                    setModalOpen(false);
                    setEditando(null);
                    setFormData({ nombre: '' });
                    setError('');
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="tiposcampos-modal-body-unique">
                  {error && (
                    <div className="tiposcampos-modal-error-unique">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="tiposcampos-form-group-unique">
                    <label htmlFor="tiposcampos-nombre" className="tiposcampos-form-label-unique">
                      Nombre del tipo de campo
                    </label>
                    <input
                      id="tiposcampos-nombre"
                      type="text"
                      placeholder="Ej: Campo Agrícola, Estancia, Chacra, etc."
                      value={formData.nombre}
                      onChange={(e) => setFormData({ nombre: e.target.value })}
                      className="tiposcampos-form-input-unique"
                      autoFocus
                      required
                    />
                    <small className="tiposcampos-form-hint-unique">
                      Este tipo aparecerá en el formulario de propiedades
                    </small>
                  </div>
                </div>
                <div className="tiposcampos-modal-footer-unique">
                  <button 
                    type="button" 
                    className="tiposcampos-btn-cancelar-unique"
                    onClick={() => {
                      setModalOpen(false);
                      setEditando(null);
                      setFormData({ nombre: '' });
                      setError('');
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="tiposcampos-btn-guardar-unique"
                    disabled={!formData.nombre.trim()}
                  >
                    {editando ? 'Guardar Cambios' : 'Crear Tipo'}
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

export default TiposCampos;