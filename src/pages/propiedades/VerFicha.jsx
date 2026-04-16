// C:\xampp\htdocs\InmobiliariaRural\src\pages\propiedades\VerFicha.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Ruler, Home, Maximize, Calendar, Eye, MessageCircle, ArrowLeft, Share2 } from "lucide-react";
import Navbar from '../../components/PropertiesHeader';
import Footer from '../../components/PropertyFooter';
import apiService from '../../services/api.service';
import ENDPOINTS from '../../config/endpoints';
import ImageModal from '../../components/UI/ImageModal'; // ✅ Importar el nuevo modal
import '../../styles/pages/propiedades/VerFicha.css';

// Usar constantes desde la configuración
const BASE_URL = ENDPOINTS.BASE_URL;
const DEFAULT_IMAGE = ENDPOINTS.ADMIN.DEFAULT_IMAGE;

const VerFicha = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [propiedad, setPropiedad] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // ✅ Nuevo estado para el modal
  const [modalImageIndex, setModalImageIndex] = useState(0); // ✅ Índice de imagen seleccionada
  const [mostrarMapa, setMostrarMapa] = useState(false);

  // FORZAR SCROLL AL INICIO DE LA PÁGINA
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);

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

  // Función para construir URL completa usando BASE_URL
  const construirUrlCompleta = (url) => {
    if (!url) return DEFAULT_IMAGE;
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    let urlLimpia = url;
    if (urlLimpia.startsWith('/api')) {
      urlLimpia = urlLimpia.replace('/api', '');
    }
    
    if (!urlLimpia.startsWith('/')) {
      urlLimpia = '/' + urlLimpia;
    }
    
    return `${BASE_URL}${urlLimpia}`;
  };

  // Función para manejar errores de imagen
  const handleImageError = (e) => {
    if (e.target.src !== DEFAULT_IMAGE) {
      e.target.src = DEFAULT_IMAGE;
      e.target.onerror = null;
    }
  };

  // ✅ Función para abrir el modal con la imagen seleccionada
  const handleOpenModal = (index = 0) => {
    setModalImageIndex(index);
    setModalOpen(true);
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
              {/* ✅ Imagen principal - abre modal en índice 0 */}
              <div 
                className="vf-imagen-principal"
                onClick={() => handleOpenModal(0)}
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

              {/* Miniaturas */}
              {propiedad.imagenes && propiedad.imagenes.length > 0 && (
                <div className="vf-miniaturas">
                  {propiedad.imagenes.map((img, index) => (
                    <div
                      key={img.id}
                      className={`vf-miniatura ${imagenSeleccionada?.id === img.id ? 'activo' : ''}`}
                      onClick={() => {
                        setImagenSeleccionada(img);
                        handleOpenModal(index); // ✅ Abre modal en el índice de la miniatura
                      }}
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

        {/* ✅ Nuevo Modal de imágenes */}
        {modalOpen && propiedad?.imagenes && propiedad.imagenes.length > 0 && (
          <ImageModal
            images={propiedad.imagenes}
            initialIndex={modalImageIndex}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default VerFicha;