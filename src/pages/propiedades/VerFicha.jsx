// C:\xampp\htdocs\InmobiliariaRural\src\pages\propiedades\VerFicha.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Ruler, Home, Maximize, Calendar, Eye, MessageCircle, ArrowLeft, Share2 } from "lucide-react";
import Navbar from '../../components/PropertiesHeader';
import Footer from '../../components/PropertyFooter';
import apiService from '../../services/api.service';
import '../../styles/pages/propiedades/VerFicha.css';

const VerFicha = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [propiedad, setPropiedad] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [modalImagen, setModalImagen] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false);

  const DEFAULT_IMAGE = 'http://localhost/BackInmobiliariaRural/admin/default.png';

  // ✅ FORZAR SCROLL AL INICIO DE LA PÁGINA
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // 'auto' o 'instant' para que sea inmediato
    });
  }, []); // Solo al montar el componente

  const cargarPropiedad = async () => {
    try {
      setLoading(true);
      
      console.log('Buscando propiedad con código:', codigo);
      
      const response = await apiService.getPropiedadPorCodigo(codigo);
      
      console.log('Respuesta:', response);
      
      if (response.success && response.data) {
        const data = response.data;
        
        const imagenesProcesadas = data.imagenes?.map(img => ({
          ...img,
          url: construirUrlCompleta(img.url)
        })) || [];
        
        setPropiedad({
          ...data,
          imagenes: imagenesProcesadas
        });
        
        if (imagenesProcesadas.length > 0) {
          setImagenSeleccionada(imagenesProcesadas[0]);
        } else {
          setImagenSeleccionada({
            id: 'default',
            url: DEFAULT_IMAGE,
            nombre: 'default.png',
            orden: 0
          });
        }
      } else {
        console.error('Propiedad no encontrada:', response.message);
        navigate('/propiedades');
      }
    } catch (error) {
      console.error('Error cargando propiedad:', error);
      navigate('/propiedades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codigo) {
      cargarPropiedad();
    }
  }, [codigo]);

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

  const handleVolver = () => {
    navigate(-1);
  };

  const handleCompartir = () => {
    const shareUrl = `${window.location.origin}/propiedad/${propiedad.codigo}`;
    
    if (navigator.share) {
      navigator.share({
        title: propiedad.titulo,
        text: propiedad.descripcion_corta || propiedad.descripcion,
        url: shareUrl
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleContactar = () => {
    navigate(`/contacto?propiedad=${propiedad.codigo}&titulo=${encodeURIComponent(propiedad.titulo)}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="vf-loading">
          <div className="vf-spinner"></div>
          <p>Cargando propiedad...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!propiedad) {
    return (
      <>
        <Navbar />
        <div className="vf-error">
          <h2>Propiedad no encontrada</h2>
          <p>La propiedad que buscas no existe o ha sido eliminada.</p>
          <button onClick={handleVolver} className="vf-btn-volver">
            <ArrowLeft size={20} />
            Volver
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const tieneServicios = () => {
    if (!propiedad.servicios) return false;
    if (!Array.isArray(propiedad.servicios)) return false;
    if (propiedad.servicios.length === 0) return false;
    const tieneServicioValido = propiedad.servicios.some(s => 
      s && typeof s === 'object' && s.nombre && s.nombre.trim() !== ''
    );
    return tieneServicioValido;
  };

  const obtenerServiciosValidos = () => {
    if (!propiedad.servicios || !Array.isArray(propiedad.servicios)) return [];
    return propiedad.servicios.filter(s => 
      s && typeof s === 'object' && s.nombre && s.nombre.trim() !== ''
    );
  };

  const serviciosValidos = obtenerServiciosValidos();
  const mostrarServicios = tieneServicios();
  const imagenParaMostrar = imagenSeleccionada?.url || DEFAULT_IMAGE;

  return (
    <>
      <Navbar />
      <div className="vf-container">
        <div className="vf-header">
          <div className="vf-header-titulo">
            <h1>{propiedad.titulo}</h1>
            <p className="vf-codigo">Código: {propiedad.codigo}</p>
          </div>
          <div className="vf-header-acciones">
            <button onClick={handleCompartir} className="vf-btn-icon" title="Compartir">
              <Share2 size={22} />
              <span className="vf-btn-text">Compartir</span>
            </button>
          </div>
        </div>

        <div className="vf-grid">
          <div className="vf-col-izquierda">
            <div className="vf-galeria">
              <div 
                className="vf-imagen-principal"
                onClick={() => setModalImagen(true)}
              >
                <img 
                  src={imagenParaMostrar}
                  alt={propiedad.titulo}
                  onError={handleImageError}
                />
                {propiedad.destacado && (
                  <span className="vf-badge-destacado">Destacado</span>
                )}
              </div>

              {propiedad.imagenes && propiedad.imagenes.length > 0 && (
                <div className="vf-miniaturas">
                  {propiedad.imagenes.map((img) => (
                    <div
                      key={img.id}
                      className={`vf-miniatura ${imagenSeleccionada?.id === img.id ? 'activo' : ''}`}
                      onClick={() => setImagenSeleccionada(img)}
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
            </div>
          </div>

          <div className="vf-col-derecha">
            {/* Resto del contenido igual */}
            <div className="vf-card vf-card-precio">
              <div className="vf-precio">
                <span className="vf-moneda">{propiedad.moneda}</span>
                <span className="vf-valor">{propiedad.precio_formateado}</span>
              </div>
              <span className="vf-tipo-operacion">
                {propiedad.tipo_operacion === 'alquiler' ? 'EN ALQUILER' : 'EN VENTA'}
              </span>
            </div>

            <div className="vf-card">
              <h3 className="vf-card-titulo">Características</h3>
              <div className="vf-caracteristicas">
                <div className="vf-caracteristica">
                  <Home size={20} />
                  <div>
                    <span className="vf-label">Tipo</span>
                    <span className="vf-valor">{propiedad.tipo_campo?.nombre || 'Campo'}</span>
                  </div>
                </div>
                <div className="vf-caracteristica">
                  <Maximize size={20} />
                  <div>
                    <span className="vf-label">Superficie</span>
                    <span className="vf-valor">{propiedad.superficie} ha</span>
                  </div>
                </div>
                <div className="vf-caracteristica">
                  <MapPin size={20} />
                  <div>
                    <span className="vf-label">Ubicación</span>
                    <span className="vf-valor">{propiedad.ubicacion?.texto || propiedad.ubicacion?.ciudad || propiedad.ciudad || 'No especificada'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="vf-card">
              <h3 className="vf-card-titulo">Descripción</h3>
              <div className="vf-descripcion">
                {propiedad.descripcion?.split('\n').map((parrafo, i) => (
                  <p key={i}>{parrafo}</p>
                ))}
              </div>
            </div>

            {mostrarServicios && serviciosValidos.length > 0 && (
              <div className="vf-card">
                <h3 className="vf-card-titulo">Servicios e Infraestructura</h3>
                <div className="vf-servicios">
                  {serviciosValidos.map((servicio, index) => (
                    <span key={servicio.id || index} className="vf-servicio-tag">
                      {servicio.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {propiedad.ubicacion?.latitud && propiedad.ubicacion?.longitud && (
              <div className="vf-card">
                <h3 className="vf-card-titulo">Ubicación</h3>
                <div className="vf-mapa">
                  <button 
                    className="vf-btn-mapa"
                    onClick={() => setMostrarMapa(!mostrarMapa)}
                  >
                    {mostrarMapa ? 'Ocultar mapa' : 'Ver ubicación en mapa'}
                  </button>
                  
                  {mostrarMapa && (
                    <div className="vf-mapa-container">
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
            )}

            <div className="vf-card vf-card-contacto">
              <button onClick={handleContactar} className="vf-btn-contacto">
                <MessageCircle size={20} />
                Contactar por esta propiedad
              </button>
            </div>

            <div className="vf-card vf-card-estadisticas">
              <div className="vf-estadistica">
                <Eye size={16} />
                <span>{propiedad.estadisticas?.vistas || 0} vistas</span>
              </div>
              <div className="vf-estadistica">
                <Calendar size={16} />
                <span>Publicado: {propiedad.fecha_publicacion_formateada || propiedad.fecha_formateada || 'Fecha no disponible'}</span>
              </div>
            </div>
          </div>
        </div>

        {modalImagen && (
          <div className="vf-modal-overlay" onClick={() => setModalImagen(false)}>
            <div className="vf-modal" onClick={e => e.stopPropagation()}>
              <button className="vf-modal-cerrar" onClick={() => setModalImagen(false)}>×</button>
              <img 
                src={imagenParaMostrar}
                alt={propiedad.titulo}
                onError={handleImageError}
              />
              {propiedad.imagenes && propiedad.imagenes.length > 0 && (
                <div className="vf-modal-miniaturas">
                  {propiedad.imagenes.map((img) => (
                    <div
                      key={img.id}
                      className={`vf-modal-miniatura ${imagenSeleccionada?.id === img.id ? 'activo' : ''}`}
                      onClick={() => setImagenSeleccionada(img)}
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
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VerFicha;