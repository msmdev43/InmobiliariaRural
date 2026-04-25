// C:\xampp\htdocs\InmobiliariaRural\src\pages\propiedades\VerFicha.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Ruler, Home, Maximize, Calendar, Eye, MessageCircle, ArrowLeft, Share2, Mail, X, User, Phone, MessageSquare } from "lucide-react";
import Navbar from '../../components/PropertiesHeader';
import Footer from '../../components/PropertyFooter';
import apiService from '../../services/api.service';
import ENDPOINTS from '../../config/endpoints';
import ImageModal from '../../components/UI/ImageModal';
import { useToast, ToastContainer } from '../../components/UI/Toast';
import '../../styles/pages/propiedades/VerFicha.css';

const BASE_URL = ENDPOINTS.BASE_URL;
const DEFAULT_IMAGE = ENDPOINTS.ADMIN.DEFAULT_IMAGE;

const VerFicha = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [propiedad, setPropiedad] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  
  const [consultaModalOpen, setConsultaModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombrecompleto: "",
    email: "",
    telefono: "",
    mensaje: ""
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const cargarPropiedad = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPropiedadPorCodigo(codigo);
      
      if (response.success && response.data) {
        const data = response.data;
        const imagenesProcesadas = data.imagenes?.map(img => ({
          ...img, url: construirUrlCompleta(img.url)
        })) || [];
        
        setPropiedad({ ...data, imagenes: imagenesProcesadas });
        
        if (imagenesProcesadas.length > 0) {
          setImagenSeleccionada(imagenesProcesadas[0]);
        } else {
          setImagenSeleccionada({ id: 'default', url: DEFAULT_IMAGE, nombre: 'default.png', orden: 0 });
        }
      } else {
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
    if (codigo) cargarPropiedad();
  }, [codigo]);

  const construirUrlCompleta = (url) => {
    if (!url) return DEFAULT_IMAGE;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    let urlLimpia = url;
    if (urlLimpia.startsWith('/BackInmobiliariaRural')) urlLimpia = urlLimpia.replace('/BackInmobiliariaRural', '');
    if (!urlLimpia.startsWith('/')) urlLimpia = '/' + urlLimpia;
    return `${BASE_URL}${urlLimpia}`;
  };

  const handleImageError = (e) => {
    if (e.target.src !== DEFAULT_IMAGE) { e.target.src = DEFAULT_IMAGE; e.target.onerror = null; }
  };

  const handleOpenModal = (index = 0) => { setModalImageIndex(index); setModalOpen(true); };
  const handleVolver = () => navigate(-1);

  const handleCompartir = () => {
    const shareUrl = `${window.location.origin}/propiedad/${propiedad.codigo}`;
    if (navigator.share) {
      navigator.share({ title: propiedad.titulo, text: propiedad.descripcion_corta || propiedad.descripcion, url: shareUrl }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleContactarWhatsApp = () => {
    const whatsappNumber = "5492291510406";
    const message = `Hola, estoy interesado en la propiedad "${propiedad.titulo}" (Código: ${propiedad.codigo}). ¿Podrían darme más información?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // MODAL DE CONSULTA
  const openConsultaModal = () => {
    const mensaje = `Hola, estoy interesado/a en la propiedad "${propiedad.titulo}" (Código: ${propiedad.codigo}). ¿Podrían darme más información?`;
    setFormData(prev => ({ ...prev, mensaje }));
    setConsultaModalOpen(true);
  };

  const closeConsultaModal = () => {
    setConsultaModalOpen(false);
    setFormData({ nombrecompleto: "", email: "", telefono: "", mensaje: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.nombrecompleto.trim()) errors.push("Nombre completo requerido");
    if (!formData.email.trim()) errors.push("Email requerido");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push("Email inválido");
    if (!formData.telefono.trim()) errors.push("Teléfono requerido");
    if (!formData.mensaje.trim()) errors.push("Mensaje requerido");
    return errors;
  };

  const handleSubmitConsulta = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }
    setIsSubmitting(true);
    try {
      const data = {
        nombrecompleto: formData.nombrecompleto.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        mensaje: formData.mensaje.trim(),
        tipo: 'propiedad',
        propiedad_id: propiedad.id
      };
      const response = await apiService.crearConsulta(data);
      setIsSubmitting(false);
      if (response.success) {
        toast.success("✅ Consulta enviada con éxito. Te contactaremos pronto.", { duration: 2000 });
      } else {
        toast.warning("⚠️ Consulta guardada, pero hubo un pequeño error.", { duration: 2000 });
      }
      setTimeout(() => closeConsultaModal(), 1500);
    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false);
      toast.error("❌ Error al enviar la consulta.", { duration: 2000 });
      setTimeout(() => closeConsultaModal(), 1500);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="vf-loading"><div className="vf-spinner"></div><p>Cargando propiedad...</p></div>
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
          <button onClick={handleVolver} className="vf-btn-volver"><ArrowLeft size={20} />Volver</button>
        </div>
        <Footer />
      </>
    );
  }

  const tieneServicios = () => {
    if (!propiedad.servicios || !Array.isArray(propiedad.servicios) || propiedad.servicios.length === 0) return false;
    return propiedad.servicios.some(s => s && typeof s === 'object' && s.nombre && s.nombre.trim() !== '');
  };

  const serviciosValidos = propiedad.servicios?.filter(s => s && typeof s === 'object' && s.nombre && s.nombre.trim() !== '') || [];
  const mostrarServicios = tieneServicios();
  const imagenParaMostrar = imagenSeleccionada?.url || DEFAULT_IMAGE;

  return (
    <>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <Navbar />
      <div className="vf-container">
        <div className="vf-header">
          <div className="vf-header-titulo">
            <h1>{propiedad.titulo}</h1>
            <p className="vf-codigo">Código: {propiedad.codigo}</p>
          </div>
          <div className="vf-header-acciones">
            <button onClick={handleCompartir} className="vf-btn-icon" title="Compartir">
              <Share2 size={22} /><span className="vf-btn-text">Compartir</span>
            </button>
          </div>
        </div>

        <div className="vf-grid">
          <div className="vf-col-izquierda">
            <div className="vf-galeria">
              <div className="vf-imagen-principal" onClick={() => handleOpenModal(0)}>
                <img src={imagenParaMostrar} alt={propiedad.titulo} onError={handleImageError} />
                {propiedad.destacado && <span className="vf-badge-destacado">Destacado</span>}
              </div>
              {propiedad.imagenes && propiedad.imagenes.length > 0 && (
                <div className="vf-miniaturas">
                  {propiedad.imagenes.map((img, index) => (
                    <div key={img.id} className={`vf-miniatura ${imagenSeleccionada?.id === img.id ? 'activo' : ''}`}
                      onClick={() => { setImagenSeleccionada(img); handleOpenModal(index); }}>
                      <img src={img.url} alt={`${propiedad.titulo} - ${img.orden}`} onError={handleImageError} />
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
              <span className="vf-tipo-operacion">{propiedad.tipo_operacion === 'alquiler' ? 'EN ALQUILER' : 'EN VENTA'}</span>
            </div>

            <div className="vf-card vf-card-contacto">
              <h3 className="vf-card-titulo">Contactar por esta propiedad</h3>
              <div className="vf-botones-contacto">
                <button onClick={handleContactarWhatsApp} className="vf-btn-whatsapp">
                  <MessageCircle size={20} /> WhatsApp
                </button>
                <button onClick={openConsultaModal} className="vf-btn-email">
                  <Mail size={20} /> Email
                </button>
              </div>
            </div>

            <div className="vf-card">
              <h3 className="vf-card-titulo">Características</h3>
              <div className="vf-caracteristicas">
                <div className="vf-caracteristica"><Home size={20} /><div><span className="vf-label">Tipo</span><span className="vf-valor">{propiedad.tipo_campo?.nombre || 'Campo'}</span></div></div>
                <div className="vf-caracteristica"><Maximize size={20} /><div><span className="vf-label">Superficie</span><span className="vf-valor">{propiedad.superficie} ha</span></div></div>
                <div className="vf-caracteristica"><MapPin size={20} /><div><span className="vf-label">Ubicación</span><span className="vf-valor">{propiedad.ubicacion?.texto || propiedad.ubicacion?.ciudad || propiedad.ciudad || 'No especificada'}</span></div></div>
              </div>
            </div>

            <div className="vf-card">
              <h3 className="vf-card-titulo">Descripción</h3>
              <div className="vf-descripcion">{propiedad.descripcion?.split('\n').map((p, i) => <p key={i}>{p}</p>)}</div>
            </div>

            {mostrarServicios && serviciosValidos.length > 0 && (
              <div className="vf-card">
                <h3 className="vf-card-titulo">Servicios e Infraestructura</h3>
                <div className="vf-servicios">{serviciosValidos.map((s, i) => <span key={s.id || i} className="vf-servicio-tag">{s.nombre}</span>)}</div>
              </div>
            )}

            {propiedad.ubicacion?.latitud && propiedad.ubicacion?.longitud && (
              <div className="vf-card">
                <h3 className="vf-card-titulo">Ubicación</h3>
                <div className="vf-mapa">
                  <button className="vf-btn-mapa" onClick={() => setMostrarMapa(!mostrarMapa)}>{mostrarMapa ? 'Ocultar mapa' : 'Ver ubicación en mapa'}</button>
                  {mostrarMapa && (
                    <div className="vf-mapa-container">
                      <iframe title="Ubicación" width="100%" height="300" frameBorder="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${propiedad.ubicacion.longitud - 0.01},${propiedad.ubicacion.latitud - 0.01},${propiedad.ubicacion.longitud + 0.01},${propiedad.ubicacion.latitud + 0.01}&layer=mapnik&marker=${propiedad.ubicacion.latitud},${propiedad.ubicacion.longitud}`}
                        style={{ border: '1px solid #ddd', borderRadius: '8px' }} allowFullScreen loading="lazy" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="vf-card vf-card-estadisticas">
              <div className="vf-estadistica"><Eye size={16} /><span>{propiedad.estadisticas?.vistas || 0} vistas</span></div>
              <div className="vf-estadistica"><Calendar size={16} /><span>Publicado: {propiedad.fecha_publicacion_formateada || propiedad.fecha_formateada || 'Fecha no disponible'}</span></div>
            </div>
          </div>
        </div>

        {modalOpen && propiedad?.imagenes && propiedad.imagenes.length > 0 && (
          <ImageModal images={propiedad.imagenes} initialIndex={modalImageIndex} onClose={() => setModalOpen(false)} />
        )}
      </div>

      {/* MODAL DE CONSULTA */}
      {consultaModalOpen && (
        <div className="vf-modal-overlay" onClick={closeConsultaModal}>
          <div className="vf-consulta-modal" onClick={e => e.stopPropagation()}>
            <div className="vf-consulta-header">
              <h3>Consultar por {propiedad.titulo}</h3>
              <button className="vf-consulta-close" onClick={closeConsultaModal}><X size={20} /></button>
            </div>
            <p className="vf-consulta-codigo">Código: {propiedad.codigo}</p>
            <form onSubmit={handleSubmitConsulta} className="vf-consulta-form">
              <div className="vf-form-group">
                <label><User size={16} /> Nombre completo *</label>
                <input type="text" name="nombrecompleto" value={formData.nombrecompleto} onChange={handleChange} required placeholder="Ingresá tu nombre completo" disabled={isSubmitting} />
              </div>
              <div className="vf-form-group">
                <label><Mail size={16} /> Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="tuemail@ejemplo.com" disabled={isSubmitting} />
              </div>
              <div className="vf-form-group">
                <label><Phone size={16} /> Teléfono *</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="Ej: +54 9 223 123-4567" disabled={isSubmitting} />
              </div>
              <div className="vf-form-group">
                <label><MessageSquare size={16} /> Consulta *</label>
                <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} required rows="4" disabled={isSubmitting} />
              </div>
              <div className="vf-form-actions">
                <button type="button" onClick={closeConsultaModal} className="vf-btn-cancelar" disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="vf-btn-enviar" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default VerFicha;