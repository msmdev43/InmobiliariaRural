// C:\xampp\htdocs\InmobiliariaRural\src\components\PropertyList.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiService from '../services/api.service';
import ShareModal from './UI/ShareModal';
import { useToast, ToastContainer } from './UI/Toast';
import { X, User, Mail, Phone, MessageSquare } from 'lucide-react';
import ENDPOINTS from '../config/endpoints';
import "../styles/components/propiedades/propertyList.css";

const HERO_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
const DEFAULT_IMAGE = ENDPOINTS.ADMIN.DEFAULT_IMAGE;

export default function PropertyList({ showHero = true }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareModal, setShareModal] = useState({ isOpen: false, propiedad: null });

  // Modal de consulta
  const [consultaModalOpen, setConsultaModalOpen] = useState(false);
  const [selectedPropiedad, setSelectedPropiedad] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombrecompleto: "",
    email: "",
    telefono: "",
    mensaje: ""
  });

  const handleImageError = (e) => {
    if (e.target.src !== DEFAULT_IMAGE) {
      e.target.src = DEFAULT_IMAGE;
      e.target.onerror = null;
    }
  };

  const resultsRef = useRef(null);
  const filtersBarRef = useRef(null);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const [filters, setFilters] = useState({
    provincia: '', ciudad: '', tipo_campo: '', tipo_operacion: ''
  });
  const [availableFilters, setAvailableFilters] = useState({
    provincias: [], ciudades: [], todosLosTiposCampos: [], tipos_operacion: ['venta', 'alquiler']
  });
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const CONTACT_CONFIG = { whatsappNumber: "5492291510406" };

  const scrollToResults = (behavior = 'smooth', delay = 2000) => {
    setTimeout(() => {
      if (resultsRef.current) {
        const offset = 80;
        const elementPosition = resultsRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior });
      }
    }, delay);
  };

  useEffect(() => { cargarFiltrosIniciales(); }, []);

  useEffect(() => {
    const tipoCampoFromUrl = searchParams.get('tipo_campo');
    const provinciaFromUrl = searchParams.get('provincia');
    const ciudadFromUrl = searchParams.get('ciudad');
    const operacionFromUrl = searchParams.get('tipo_operacion');
    const nuevosFiltros = {};
    if (tipoCampoFromUrl) nuevosFiltros.tipo_campo = tipoCampoFromUrl;
    if (provinciaFromUrl) nuevosFiltros.provincia = provinciaFromUrl;
    if (ciudadFromUrl) nuevosFiltros.ciudad = ciudadFromUrl;
    if (operacionFromUrl) nuevosFiltros.tipo_operacion = operacionFromUrl;
    if (Object.keys(nuevosFiltros).length > 0) {
      setFilters(prev => ({ ...prev, ...nuevosFiltros }));
      cargarPropiedades({ ...filters, ...nuevosFiltros });
    } else { cargarPropiedades(); }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && properties.length > 0 && !initialScrollDone && showHero) {
      if (window.location.pathname === '/propiedades') scrollToResults('smooth', 2000);
      setInitialScrollDone(true);
    }
  }, [loading, properties, initialScrollDone, showHero]);

  const cargarFiltrosIniciales = async () => {
    try {
      const response = await apiService.getPropiedadesPublic({ pagina: 1, por_pagina: 1 });
      if (response.success && response.filtros_disponibles) {
        setAvailableFilters(prev => ({
          ...prev,
          provincias: response.filtros_disponibles.provincias || [],
          todosLosTiposCampos: response.filtros_disponibles.tipos_campos || [],
          tipos_operacion: response.filtros_disponibles.tipos_operacion || ['venta', 'alquiler']
        }));
      }
    } catch (error) { console.error('Error cargando filtros iniciales:', error); }
  };

  const cargarCiudadesPorProvincia = async (provincia) => {
    if (!provincia) { setAvailableFilters(prev => ({ ...prev, ciudades: [] })); return; }
    setLoadingCities(true);
    try {
      const response = await apiService.getPropiedadesPublic({ provincia, pagina: 1, por_pagina: 1 });
      if (response.success && response.filtros_disponibles?.ciudades) {
        setAvailableFilters(prev => ({ ...prev, ciudades: response.filtros_disponibles.ciudades || [] }));
      } else { setAvailableFilters(prev => ({ ...prev, ciudades: [] })); }
    } catch (error) { console.error('Error cargando ciudades:', error); }
    finally { setLoadingCities(false); }
  };

  const cargarPropiedades = async (filtrosAplicados = null) => {
    try {
      setLoading(true);
      const filtros = filtrosAplicados || filters;
      const params = { pagina: 1, por_pagina: 12 };
      if (filtros.provincia) params.provincia = filtros.provincia;
      if (filtros.ciudad) params.ciudad = filtros.ciudad;
      if (filtros.tipo_campo) params.tipo_campo = filtros.tipo_campo;
      if (filtros.tipo_operacion) params.tipo_operacion = filtros.tipo_operacion;
      const response = await apiService.getPropiedadesPublic(params);
      if (response.success) {
        setProperties(response.data || []);
        const newParams = new URLSearchParams();
        if (filtros.tipo_campo) newParams.set('tipo_campo', filtros.tipo_campo);
        if (filtros.provincia) newParams.set('provincia', filtros.provincia);
        if (filtros.ciudad) newParams.set('ciudad', filtros.ciudad);
        if (filtros.tipo_operacion) newParams.set('tipo_operacion', filtros.tipo_operacion);
        setSearchParams(newParams);
        if (filtros.provincia) await cargarCiudadesPorProvincia(filtros.provincia);
      } else { setError(response.message || 'Error al cargar propiedades'); setProperties([]); }
    } catch (error) { console.error('Error cargando propiedades:', error); setError('Error de conexión'); setProperties([]); }
    finally { setLoading(false); }
  };

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    const nuevosFiltros = { ...filters, [name]: value, ...(name === 'provincia' && { ciudad: '' }) };
    setFilters(nuevosFiltros);
    if (name === 'provincia') await cargarCiudadesPorProvincia(value);
    await cargarPropiedades(nuevosFiltros);
    scrollToResults('smooth', 2000);
  };

  const aplicarFiltros = async () => { setApplyingFilters(true); await cargarPropiedades(filters); setApplyingFilters(false); scrollToResults('smooth', 2000); };
  const limpiarFiltros = async () => {
    const filtrosVacios = { provincia: '', ciudad: '', tipo_campo: '', tipo_operacion: '' };
    setFilters(filtrosVacios); setAvailableFilters(prev => ({ ...prev, ciudades: [] }));
    await cargarPropiedades(filtrosVacios); scrollToResults('smooth', 2000);
  };

  const handleShare = (e, propiedad) => { e.stopPropagation(); setShareModal({ isOpen: true, propiedad }); };
  const closeShareModal = () => setShareModal({ isOpen: false, propiedad: null });

  // WhatsApp
  const handleContactarWhatsApp = (e, propiedad) => {
    e.stopPropagation();
    const message = `Hola, estoy interesado en la propiedad "${propiedad.titulo}" (Código: ${propiedad.codigo}). ¿Podrían darme más información?`;
    window.open(`https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Modal Email
  const openConsultaModal = (e, propiedad) => {
    e.stopPropagation();
    setSelectedPropiedad(propiedad);
    const mensaje = `Hola, estoy interesado/a en la propiedad "${propiedad.titulo}" (Código: ${propiedad.codigo}). ¿Podrían darme más información?`;
    setFormData({ nombrecompleto: "", email: "", telefono: "", mensaje });
    setConsultaModalOpen(true);
  };

  const closeConsultaModal = () => {
    setConsultaModalOpen(false);
    setSelectedPropiedad(null);
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
    if (validationErrors.length > 0) { validationErrors.forEach(err => toast.error(err)); return; }
    setIsSubmitting(true);
    try {
      const data = {
        nombrecompleto: formData.nombrecompleto.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        mensaje: formData.mensaje.trim(),
        tipo: 'propiedad',
        propiedad_id: selectedPropiedad?.id
      };
      const response = await apiService.crearConsulta(data);
      setIsSubmitting(false);
      if (response.success) toast.success("✅ Consulta enviada con éxito. Te contactaremos pronto.", { duration: 2000 });
      else toast.warning("⚠️ Consulta guardada, pero hubo un pequeño error.", { duration: 2000 });
      setTimeout(() => closeConsultaModal(), 1500);
    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false);
      toast.error("❌ Error al enviar la consulta.", { duration: 2000 });
      setTimeout(() => closeConsultaModal(), 1500);
    }
  };

  const openInNewTab = (e, propiedadCodigo) => { e.stopPropagation(); window.open(`/propiedad/${propiedadCodigo}`, '_blank'); };

  if (loading && properties.length === 0) {
    return (
      <div className="pl-property-list-container">
        {showHero && (
          <div className="pl-hero-section" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
            <div className="pl-hero-overlay"></div>
            <div className="pl-hero-content"><h1 className="pl-hero-title">Propiedades Rurales</h1><p className="pl-hero-subtitle">Encuentra el campo ideal para tu proyecto</p></div>
          </div>
        )}
        <div className="pl-container"><div className="pl-loading-container"><div className="pl-loading-spinner"></div><p>Cargando propiedades...</p></div></div>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="pl-property-list-container">
        {showHero && (
          <div className="pl-hero-section" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
            <div className="pl-hero-overlay"></div>
            <div className="pl-hero-content"><h1 className="pl-hero-title">Propiedades Rurales</h1><p className="pl-hero-subtitle">Encuentra el campo ideal para tu proyecto</p></div>
          </div>
        )}
        <div className="pl-container"><div className="pl-error-container"><p>Error: {error}</p><button className="pl-retry-btn" onClick={() => cargarPropiedades()}>Reintentar</button></div></div>
      </div>
    );
  }

  return (
    <div className="pl-property-list-container">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      {shareModal.isOpen && shareModal.propiedad && <ShareModal propiedad={shareModal.propiedad} onClose={closeShareModal} />}

      {showHero && (
        <div className="pl-hero-section" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
          <div className="pl-hero-overlay"></div>
          <div className="pl-hero-content"><h1 className="pl-hero-title">Propiedades Rurales</h1><p className="pl-hero-subtitle">Descubre las propiedades rurales, chacras, campos y estancias</p></div>
        </div>
      )}

      <div className="pl-filters-bar" ref={filtersBarRef}>
        <div className="pl-filters-wrapper">
          <div className="pl-filters-grid">
            <div className="pl-filter-group"><label className="pl-filter-label">Provincia</label><select name="provincia" value={filters.provincia} onChange={handleFilterChange} className="pl-filter-select"><option value="">Todas las provincias</option>{availableFilters.provincias.map(prov => <option key={prov} value={prov}>{prov}</option>)}</select></div>
            <div className="pl-filter-group"><label className="pl-filter-label">Ciudad / Localidad</label><select name="ciudad" value={filters.ciudad} onChange={handleFilterChange} className="pl-filter-select" disabled={!filters.provincia || loadingCities}><option value="">{loadingCities ? 'Cargando ciudades...' : 'Todas las ciudades'}</option>{availableFilters.ciudades.map(ciudad => <option key={ciudad} value={ciudad}>{ciudad}</option>)}</select></div>
            <div className="pl-filter-group"><label className="pl-filter-label">Tipo de campo</label><select name="tipo_campo" value={filters.tipo_campo} onChange={handleFilterChange} className="pl-filter-select"><option value="">Todos los tipos</option>{availableFilters.todosLosTiposCampos.map(tipo => <option key={tipo.id || tipo} value={tipo.id || tipo}>{tipo.nombre || tipo}</option>)}</select></div>
            <div className="pl-filter-group"><label className="pl-filter-label">Operación</label><select name="tipo_operacion" value={filters.tipo_operacion} onChange={handleFilterChange} className="pl-filter-select"><option value="">Todos</option><option value="venta">Venta</option><option value="alquiler">Alquiler</option></select></div>
            <div className="pl-filters-actions"><button className="pl-filter-btn pl-filter-clear" onClick={limpiarFiltros} disabled={applyingFilters}>Limpiar filtros</button><button className="pl-filter-btn pl-filter-apply" onClick={aplicarFiltros} disabled={applyingFilters}>{applyingFilters ? 'Aplicando...' : 'Aplicar filtros'}</button></div>
          </div>
        </div>
      </div>

      <div className="pl-container" ref={resultsRef}>
        <div className="pl-results-info">
          <p>{loading ? 'Cargando...' : properties.length === 0 ? 'No se encontraron propiedades con los filtros seleccionados' : `Mostrando ${properties.length} propiedades disponibles`}</p>
          {(filters.provincia || filters.ciudad || filters.tipo_campo || filters.tipo_operacion) && <span className="pl-active-filters-badge">Filtros activos</span>}
        </div>
        {!loading && properties.length === 0 ? (
          <div className="pl-no-results">
            <svg className="pl-no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" /></svg>
            <h3>No encontramos propiedades</h3><p>Intenta con otros filtros o elimina algunos para ver más resultados</p><button className="pl-clear-filters-btn" onClick={limpiarFiltros}>Limpiar todos los filtros</button>
          </div>
        ) : (
          <div className="pl-properties-list-view">
            {properties.map(prop => (
              <div key={prop.id} className="pl-property-list-item">
                <div className="pl-list-item-image" onClick={(e) => openInNewTab(e, prop.codigo)} style={{ cursor: 'pointer' }}>
                  <img src={prop.imagen_principal} alt={prop.titulo} className="pl-item-image" onError={handleImageError} />
                  {prop.destacado && <span className="pl-destacado-badge">Destacado</span>}
                  {(prop.total_imagenes || prop.imagenes?.length || 0) > 1 && <span className="pl-image-count-badge">📷 {prop.total_imagenes || prop.imagenes?.length}</span>}
                </div>
                <div className="pl-list-item-info">
                  <div className="pl-item-header">
                    <h3 className="pl-item-title" onClick={(e) => openInNewTab(e, prop.codigo)} style={{ cursor: 'pointer' }}>{prop.titulo}</h3>
                    <span className={`pl-operation-badge ${prop.tipo_operacion === 'venta' ? 'pl-operation-venta' : 'pl-operation-alquiler'}`}>{prop.tipo_operacion === 'venta' ? 'EN VENTA' : 'EN ALQUILER'}</span>
                  </div>
                  <div className="pl-item-location"><svg className="pl-location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg><span>{prop.ubicacion}</span></div>
                  <div className="pl-item-features">
                    <div className="pl-feature-item">
                      <svg className="pl-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-6 9 6-9 6-9-6z" />
                        <path d="M3 15l9 6 9-6" />
                      </svg>
                      <span>{prop.superficie} ha</span>
                    </div>
                    {prop.servicios && prop.servicios.length > 0 && (
                      <div className="pl-servicios-tags">
                        {prop.servicios.slice(0, 6).map((s, idx) => (
                          <span key={idx} className="pl-servicio-tag">{s.nombre}</span>  // ← Cambiado de {s} a {s.nombre}
                        ))}
                        {prop.servicios.length > 6 && (
                          <span className="pl-servicio-tag pl-servicio-mas">+{prop.servicios.length - 6}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="pl-item-footer">
                    <div className="pl-item-price"><span className="pl-price-amount">{prop.moneda} {prop.precio_formateado}</span></div>
                    <div className="pl-action-buttons">
                      <button className="pl-action-btn pl-share-btn" onClick={(e) => handleShare(e, prop)} title="Compartir">🔗 Compartir</button>
                      <button className="pl-action-btn pl-whatsapp-btn" onClick={(e) => handleContactarWhatsApp(e, prop)} title="WhatsApp">💬 WhatsApp</button>
                      <button className="pl-action-btn pl-email-btn" onClick={(e) => openConsultaModal(e, prop)} title="Email">✉️ Email</button>
                      <button className="pl-view-details-btn" onClick={(e) => openInNewTab(e, prop.codigo)} title="Ver detalles">Ver Ficha →</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE CONSULTA */}
      {consultaModalOpen && selectedPropiedad && (
        <div className="pl-modal-overlay" onClick={closeConsultaModal}>
          <div className="pl-consulta-modal" onClick={e => e.stopPropagation()}>
            <div className="pl-consulta-header">
              <h3>Consultar por {selectedPropiedad.titulo}</h3>
              <button className="pl-consulta-close" onClick={closeConsultaModal}><X size={20} /></button>
            </div>
            <p className="pl-consulta-codigo">Código: {selectedPropiedad.codigo}</p>
            <form onSubmit={handleSubmitConsulta} className="pl-consulta-form">
              <div className="pl-form-group"><label><User size={16} /> Nombre completo *</label><input type="text" name="nombrecompleto" value={formData.nombrecompleto} onChange={handleChange} required placeholder="Ingresá tu nombre completo" disabled={isSubmitting} /></div>
              <div className="pl-form-group"><label><Mail size={16} /> Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="tuemail@ejemplo.com" disabled={isSubmitting} /></div>
              <div className="pl-form-group"><label><Phone size={16} /> Teléfono *</label><input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="Ej: +54 9 223 123-4567" disabled={isSubmitting} /></div>
              <div className="pl-form-group"><label><MessageSquare size={16} /> Consulta *</label><textarea name="mensaje" value={formData.mensaje} onChange={handleChange} required rows="4" disabled={isSubmitting} /></div>
              <div className="pl-form-actions">
                <button type="button" onClick={closeConsultaModal} className="pl-btn-cancelar" disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="pl-btn-enviar" disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'Enviar consulta'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};