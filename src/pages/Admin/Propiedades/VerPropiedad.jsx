// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Propiedades\VerPropiedad.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Admin/Sidebar';
import apiService from '../../../services/api.service';
import { useToast, ToastContainer } from '../../../components/UI/Toast';
import '../../../styles/pages/Admin/propiedades/VerPropiedad.css';

const VerPropiedad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [propiedad, setPropiedad] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [modalImagen, setModalImagen] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [accionEliminar, setAccionEliminar] = useState('eliminar');

  // URL base para imágenes por defecto
  const DEFAULT_IMAGE = 'http://localhost/BackInmobiliariaRural/uploads/propiedades/default.png';

  useEffect(() => {
    cargarPropiedad();
  }, [id]);

  const cargarPropiedad = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPropiedadDetalle(id);
      
      if (response.success) {
        setPropiedad(response.data);
        
        // Procesar URLs de imágenes
        if (response.data.imagenes && response.data.imagenes.length > 0) {
          const imagenesProcesadas = response.data.imagenes.map(img => ({
            ...img,
            url: construirUrlCompleta(img.url)
          }));
          
          setPropiedad(prev => ({
            ...prev,
            imagenes: imagenesProcesadas
          }));
          
          setImagenSeleccionada(imagenesProcesadas[0]);
        }
      } else {
        toast.error(response.message || 'Error al cargar la propiedad');
        navigate('/admin/propiedades');
      }
    } catch (error) {
      console.error('Error cargando propiedad:', error);
      toast.error('Error al conectar con el servidor');
      navigate('/admin/propiedades');
    } finally {
      setLoading(false);
    }
  };

  // Función para construir URL completa de imagen
  const construirUrlCompleta = (url) => {
    if (!url) return DEFAULT_IMAGE;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/BackInmobiliariaRural')) {
      return `http://localhost${url}`;
    }
    return `http://localhost/BackInmobiliariaRural${url}`;
  };

  const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE;
    e.target.onerror = null;
  };

  const handleEditar = () => {
    navigate(`/admin/propiedades/editar/${id}`);
  };

  const handleVolver = () => {
    navigate('/admin/propiedades');
  };

  const handleEliminarClick = (accion) => {
    setAccionEliminar(accion);
    setModalEliminar(true);
  };

  const handleConfirmarEliminar = async () => {
    try {
      const response = await apiService.eliminarPropiedad(id, accionEliminar);
      
      if (response.success) {
        toast.success(response.message);
        setModalEliminar(false);
        if (accionEliminar === 'eliminar_permanentemente') {
          navigate('/admin/propiedades');
        } else {
          cargarPropiedad(); // Recargar para ver cambios
        }
      } else {
        toast.error(response.message || 'Error al ejecutar la acción');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  const handleImagenClick = (imagen) => {
    setImagenSeleccionada(imagen);
  };

  const handleAbrirModalImagen = (imagen) => {
    setImagenSeleccionada(imagen);
    setModalImagen(true);
  };

  const getEstadoBadge = () => {
    if (!propiedad) return null;
    
    if (propiedad.esta_eliminada) {
      return <span className="ver-estado-badge ver-estado-eliminado">Eliminada</span>;
    }
    
    switch (propiedad.estado) {
      case 'disponible':
        return <span className="ver-estado-badge ver-estado-disponible">Disponible</span>;
      case 'vendido':
        return <span className="ver-estado-badge ver-estado-vendido">Vendido</span>;
      case 'alquilado':
        return <span className="ver-estado-badge ver-estado-alquilado">Alquilado</span>;
      case 'reservado':
        return <span className="ver-estado-badge ver-estado-reservado">Reservado</span>;
      default:
        return <span className="ver-estado-badge">{propiedad.estado}</span>;
    }
  };

  const getTipoOperacionBadge = () => {
    return propiedad.tipo_operacion === 'alquiler' 
      ? <span className="ver-tipo-badge ver-tipo-alquiler">Alquiler</span>
      : <span className="ver-tipo-badge ver-tipo-venta">Venta</span>;
  };

  if (loading) {
    return (
      <Sidebar>
        <div className="ver-loading">
          <div className="ver-spinner"></div>
          <p>Cargando propiedad...</p>
        </div>
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      </Sidebar>
    );
  }

  if (!propiedad) {
    return (
      <Sidebar>
        <div className="ver-error">
          <h2>Propiedad no encontrada</h2>
          <button onClick={handleVolver} className="ver-btn-volver">
            Volver a Propiedades
          </button>
        </div>
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="ver-container">
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

        {/* Header */}
        <div className="ver-header">
          <div className="ver-header-left">
            <button onClick={handleVolver} className="ver-btn-volver" title="Volver">
              ←
            </button>
            <div>
              <h1 className="ver-titulo">{propiedad.titulo}</h1>
              <p className="ver-codigo">Código: {propiedad.codigo}</p>
            </div>
          </div>
          <div className="ver-header-right">
            {getEstadoBadge()}
            {getTipoOperacionBadge()}
            {propiedad.destacado && (
              <span className="ver-destacado-badge">★ Destacado</span>
            )}
          </div>
        </div>

        {/* Acciones principales */}
        <div className="ver-acciones">
          <button onClick={handleEditar} className="ver-btn-editar">
            ✏️ Editar propiedad
          </button>
          {!propiedad.esta_eliminada ? (
            <button 
              onClick={() => handleEliminarClick('eliminar')} 
              className="ver-btn-eliminar"
            >
              🗑️ Dar de baja
            </button>
          ) : (
            <>
              <button 
                onClick={() => handleEliminarClick('restaurar')} 
                className="ver-btn-restaurar"
              >
                🔄 Restaurar
              </button>
              <button 
                onClick={() => handleEliminarClick('eliminar_permanentemente')} 
                className="ver-btn-eliminar-perm"
              >
                🗑️ Eliminar permanentemente
              </button>
            </>
          )}
        </div>

        {/* Contenido principal */}
        <div className="ver-grid">
          {/* Columna izquierda - Imágenes */}
          <div className="ver-col-izquierda">
            <div className="ver-imagen-principal" onClick={() => handleAbrirModalImagen(imagenSeleccionada)}>
              <img 
                src={imagenSeleccionada?.url || construirUrlCompleta(propiedad.imagen_principal)} 
                alt={propiedad.titulo}
                onError={handleImageError}
              />
            </div>

            {propiedad.imagenes && propiedad.imagenes.length > 1 && (
              <div className="ver-miniaturas">
                {propiedad.imagenes.map((img) => (
                  <div 
                    key={img.id} 
                    className={`ver-miniatura ${imagenSeleccionada?.id === img.id ? 'activo' : ''}`}
                    onClick={() => handleImagenClick(img)}
                  >
                    <img 
                      src={img.url} 
                      alt={`${propiedad.titulo} - ${img.orden}`}
                      onError={handleImageError}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="ver-info-imagenes">
              <p>📷 {propiedad.total_imagenes} {propiedad.total_imagenes === 1 ? 'imagen' : 'imágenes'}</p>
            </div>
          </div>

          {/* Columna derecha - Detalles */}
          <div className="ver-col-derecha">
            {/* Precio */}
            <div className="ver-card ver-card-precio">
              <div className="ver-precio">
                <span className="ver-precio-moneda">{propiedad.moneda}</span>
                <span className="ver-precio-valor">{propiedad.precio_formateado}</span>
              </div>
              <div className="ver-precio-detalle">
                {propiedad.tipo_operacion === 'alquiler' ? '/ mes' : ''}
              </div>
            </div>

            {/* Características principales */}
            <div className="ver-card">
              <h3 className="ver-card-titulo">Características</h3>
              <div className="ver-caracteristicas-grid">
                <div className="ver-caracteristica">
                  <span className="ver-caracteristica-label">Tipo de campo</span>
                  <span className="ver-caracteristica-valor">{propiedad.tipo_campo?.nombre || 'No especificado'}</span>
                </div>
                <div className="ver-caracteristica">
                  <span className="ver-caracteristica-label">Superficie</span>
                  <span className="ver-caracteristica-valor">{propiedad.superficie} ha</span>
                </div>
                <div className="ver-caracteristica">
                  <span className="ver-caracteristica-label">Zona</span>
                  <span className="ver-caracteristica-valor">{propiedad.zona || 'No especificada'}</span>
                </div>
                <div className="ver-caracteristica">
                  <span className="ver-caracteristica-label">Publicado</span>
                  <span className="ver-caracteristica-valor">{propiedad.fecha_publicacion_formateada}</span>
                </div>
                <div className="ver-caracteristica">
                  <span className="ver-caracteristica-label">Antigüedad</span>
                  <span className="ver-caracteristica-valor">{propiedad.antiguedad?.texto || 'Reciente'}</span>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="ver-card">
              <h3 className="ver-card-titulo">Ubicación</h3>
              <div className="ver-ubicacion">
                <div className="ver-ubicacion-detalle">
                  <p><strong>Provincia:</strong> {propiedad.ubicacion?.provincia || 'No especificada'}</p>
                  <p><strong>Ciudad:</strong> {propiedad.ubicacion?.ciudad || 'No especificada'}</p>
                  {propiedad.zona && <p><strong>Zona:</strong> {propiedad.zona}</p>}
                </div>
                
                {propiedad.ubicacion?.latitud && propiedad.ubicacion?.longitud && (
                  <button 
                    className="ver-btn-mapa"
                    onClick={() => setMostrarMapa(!mostrarMapa)}
                  >
                    {mostrarMapa ? 'Ocultar mapa' : 'Ver en mapa'}
                  </button>
                )}

                {mostrarMapa && propiedad.ubicacion?.latitud && propiedad.ubicacion?.longitud && (
                  <div className="ver-mapa-container">
                    <iframe
                      title="Ubicación de la propiedad"
                      width="100%"
                      height="300"
                      frameBorder="0"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${propiedad.ubicacion.longitud - 0.01},${propiedad.ubicacion.latitud - 0.01},${propiedad.ubicacion.longitud + 0.01},${propiedad.ubicacion.latitud + 0.01}&layer=mapnik&marker=${propiedad.ubicacion.latitud},${propiedad.ubicacion.longitud}`}
                      style={{ border: '1px solid #ddd', borderRadius: '8px' }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="ver-card">
              <h3 className="ver-card-titulo">Descripción</h3>
              <div className="ver-descripcion">
                {propiedad.descripcion ? (
                  propiedad.descripcion.split('\n').map((parrafo, index) => (
                    <p key={index}>{parrafo}</p>
                  ))
                ) : (
                  <p>Sin descripción</p>
                )}
              </div>
            </div>

            {/* Servicios */}
            {propiedad.servicios && propiedad.servicios.length > 0 && (
              <div className="ver-card">
                <h3 className="ver-card-titulo">Servicios</h3>
                <div className="ver-servicios-grid">
                  {propiedad.servicios.map(servicio => (
                    <div key={servicio.id} className="ver-servicio">
                      <span className="ver-servicio-icono">•</span>
                      <span className="ver-servicio-nombre">{servicio.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estadísticas */}
            <div className="ver-card">
              <h3 className="ver-card-titulo">Estadísticas</h3>
              <div className="ver-estadisticas">
                <div className="ver-estadistica">
                  <span className="ver-estadistica-valor">{propiedad.estadisticas?.vistas || 0}</span>
                  <span className="ver-estadistica-label">Vistas</span>
                </div>
                <div className="ver-estadistica">
                  <span className="ver-estadistica-valor">{propiedad.estadisticas?.consultas || 0}</span>
                  <span className="ver-estadistica-label">Consultas</span>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="ver-card">
              <h3 className="ver-card-titulo">Información adicional</h3>
              <div className="ver-info-adicional">
                <p><strong>Fecha de creación:</strong> {propiedad.fechas?.creacion ? new Date(propiedad.fechas.creacion).toLocaleString() : 'No disponible'}</p>
                {propiedad.fechas?.actualizacion && (
                  <p><strong>Última actualización:</strong> {new Date(propiedad.fechas.actualizacion).toLocaleString()}</p>
                )}
                {propiedad.fechas?.eliminacion && (
                  <p><strong>Fecha de baja:</strong> {new Date(propiedad.fechas.eliminacion).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de imagen ampliada */}
        {modalImagen && imagenSeleccionada && (
          <div className="ver-modal-overlay" onClick={() => setModalImagen(false)}>
            <div className="ver-modal-imagen" onClick={e => e.stopPropagation()}>
              <button className="ver-modal-cerrar" onClick={() => setModalImagen(false)}>×</button>
              <img 
                src={imagenSeleccionada.url} 
                alt={propiedad.titulo}
                onError={handleImageError}
              />
            </div>
          </div>
        )}

        {/* Modal de confirmación para eliminar/restaurar */}
        {modalEliminar && (
          <div className="ver-modal-overlay" onClick={() => setModalEliminar(false)}>
            <div className="ver-modal" onClick={e => e.stopPropagation()}>
              <div className="ver-modal-header">
                <h3>
                  {accionEliminar === 'eliminar' && 'Confirmar baja'}
                  {accionEliminar === 'restaurar' && 'Confirmar restauración'}
                  {accionEliminar === 'eliminar_permanentemente' && 'Confirmar eliminación permanente'}
                </h3>
                <button className="ver-modal-cerrar" onClick={() => setModalEliminar(false)}>×</button>
              </div>
              
              <div className="ver-modal-body">
                <p>
                  {accionEliminar === 'eliminar' && `¿Estás seguro de dar de baja la propiedad "${propiedad.titulo}"?`}
                  {accionEliminar === 'restaurar' && `¿Restaurar la propiedad "${propiedad.titulo}"?`}
                  {accionEliminar === 'eliminar_permanentemente' && `⚠️ ¿ELIMINAR PERMANENTEMENTE "${propiedad.titulo}"? Esta acción no se puede deshacer.`}
                </p>
                <p className="ver-modal-info">Código: {propiedad.codigo}</p>
              </div>
              
              <div className="ver-modal-footer">
                <button className="ver-modal-btn-cancelar" onClick={() => setModalEliminar(false)}>
                  Cancelar
                </button>
                <button 
                  className={`ver-modal-btn-confirmar ${
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

export default VerPropiedad;