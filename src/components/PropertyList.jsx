// C:\xampp\htdocs\InmobiliariaRural\src\components\PropertyList.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiService from '../services/api.service';
import ShareModal from './UI/ShareModal';
// ✅ Eliminar import de ContactModal
// import ContactModal from './UI/ContactPropModal';
import ENDPOINTS from '../config/endpoints';
import "../styles/components/propiedades/propertyList.css";

// Imagen del Hero
const HERO_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

const DEFAULT_IMAGE = ENDPOINTS.ADMIN.DEFAULT_IMAGE;

export default function PropertyList({ showHero = true }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareModal, setShareModal] = useState({ isOpen: false, propiedad: null });
  // ✅ Eliminar estado de contactModal
  // const [contactModal, setContactModal] = useState({ isOpen: false, propiedad: null });

    const handleImageError = (e) => {
    if (e.target.src !== DEFAULT_IMAGE) {
      e.target.src = DEFAULT_IMAGE;
      e.target.onerror = null;
    }
  };
  
  // Referencia para la sección de resultados
  const resultsRef = useRef(null);
  const filtersBarRef = useRef(null);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    provincia: '',
    ciudad: '',
    tipo_campo: '',
    tipo_operacion: ''
  });
  
  const [availableFilters, setAvailableFilters] = useState({
    provincias: [],
    ciudades: [],
    todosLosTiposCampos: [],
    tipos_operacion: ['venta', 'alquiler']
  });
  
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  
  // Flag para controlar el scroll inicial
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  // ✅ Configuración de contacto (reemplazar con datos reales)
  const CONTACT_CONFIG = {
    whatsappNumber: "5492291510406", // Reemplazar con número real
    email: "contacto@inmobiliaria.com" // Reemplazar con email real
  };

  // Función para hacer scroll hasta los resultados
  const scrollToResults = (behavior = 'smooth', delay = 2000) => {
    setTimeout(() => {
      if (resultsRef.current) {
        const offset = 80;
        const elementPosition = resultsRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: behavior
        });
      } else if (filtersBarRef.current) {
        filtersBarRef.current.scrollIntoView({ behavior: behavior, block: 'start' });
      }
    }, delay);
  };

  useEffect(() => {
    cargarFiltrosIniciales();
  }, []);

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
    } else {
      cargarPropiedades();
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && properties.length > 0 && !initialScrollDone && showHero) {
      const isPropertiesPage = window.location.pathname === '/propiedades';
      if (isPropertiesPage) {
        scrollToResults('smooth', 2000);
      }
      setInitialScrollDone(true);
    }
  }, [loading, properties, initialScrollDone, showHero]);

  const cargarFiltrosIniciales = async () => {
    try {
      const response = await apiService.getPropiedadesPublic({ pagina: 1, por_pagina: 1 });
      console.log('Filtros iniciales response:', response);
      
      if (response.success && response.filtros_disponibles) {
        setAvailableFilters(prev => ({
          ...prev,
          provincias: response.filtros_disponibles.provincias || [],
          todosLosTiposCampos: response.filtros_disponibles.tipos_campos || [],
          tipos_operacion: response.filtros_disponibles.tipos_operacion || ['venta', 'alquiler']
        }));
      }
    } catch (error) {
      console.error('Error cargando filtros iniciales:', error);
    }
  };

  const cargarCiudadesPorProvincia = async (provincia) => {
    if (!provincia) {
      setAvailableFilters(prev => ({ ...prev, ciudades: [] }));
      return;
    }

    setLoadingCities(true);
    try {
      const response = await apiService.getPropiedadesPublic({ 
        provincia: provincia,
        pagina: 1, 
        por_pagina: 1 
      });
      
      if (response.success && response.filtros_disponibles?.ciudades) {
        setAvailableFilters(prev => ({
          ...prev,
          ciudades: response.filtros_disponibles.ciudades || []
        }));
      } else {
        setAvailableFilters(prev => ({ ...prev, ciudades: [] }));
      }
    } catch (error) {
      console.error('Error cargando ciudades:', error);
      setAvailableFilters(prev => ({ ...prev, ciudades: [] }));
    } finally {
      setLoadingCities(false);
    }
  };

  const cargarPropiedades = async (filtrosAplicados = null) => {
    try {
      setLoading(true);
      const filtros = filtrosAplicados || filters;
      
      const params = {
        pagina: 1,
        por_pagina: 12
      };
      
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
        
        if (filtros.provincia) {
          await cargarCiudadesPorProvincia(filtros.provincia);
        }
      } else {
        setError(response.message || 'Error al cargar propiedades');
        setProperties([]);
      }
    } catch (error) {
      console.error('Error cargando propiedades:', error);
      setError('Error de conexión con el servidor');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    
    const nuevosFiltros = {
      ...filters,
      [name]: value,
      ...(name === 'provincia' && { ciudad: '' })
    };
    
    setFilters(nuevosFiltros);
    
    if (name === 'provincia') {
      await cargarCiudadesPorProvincia(value);
    }
    
    await cargarPropiedades(nuevosFiltros);
    scrollToResults('smooth', 2000);
  };

  const aplicarFiltros = async () => {
    setApplyingFilters(true);
    await cargarPropiedades(filters);
    setApplyingFilters(false);
    scrollToResults('smooth', 2000);
  };

  const limpiarFiltros = async () => {
    const filtrosVacios = {
      provincia: '',
      ciudad: '',
      tipo_campo: '',
      tipo_operacion: ''
    };
    setFilters(filtrosVacios);
    setAvailableFilters(prev => ({ ...prev, ciudades: [] }));
    await cargarPropiedades(filtrosVacios);
    scrollToResults('smooth', 2000);
  };

  const handleShare = (e, propiedad) => {
    e.stopPropagation();
    setShareModal({ isOpen: true, propiedad });
  };

  // ✅ Nuevas funciones de contacto (sin modal)
  const handleContactarWhatsApp = (e, propiedad) => {
    e.stopPropagation();
    const message = `Hola, estoy interesado en la propiedad "${propiedad.titulo}" (Código: ${propiedad.codigo}). ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleContactarEmail = (e, propiedad) => {
    e.stopPropagation();
    const subject = `Consulta sobre propiedad: ${propiedad.titulo} (Código: ${propiedad.codigo})`;
    const body = `Hola, me comunico por la propiedad "${propiedad.titulo}" con código ${propiedad.codigo}. Me gustaría recibir más información.\n\nSaludos cordiales.`;
    const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  // ✅ Eliminar handleContact antiguo
  // const handleContact = (e, propiedad) => {
  //   e.stopPropagation();
  //   setContactModal({ isOpen: true, propiedad });
  // };

  const openInNewTab = (e, propiedadCodigo) => {
    e.stopPropagation();
    window.open(`/propiedad/${propiedadCodigo}`, '_blank');
  };

  const closeShareModal = () => {
    setShareModal({ isOpen: false, propiedad: null });
  };

  // ✅ Eliminar closeContactModal
  // const closeContactModal = () => {
  //   setContactModal({ isOpen: false, propiedad: null });
  // };

  if (loading && properties.length === 0) {
    return (
      <div className="pl-property-list-container">
        {showHero && (
          <div 
            className="pl-hero-section"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          >
            <div className="pl-hero-overlay"></div>
            <div className="pl-hero-content">
              <h1 className="pl-hero-title">Propiedades Rurales</h1>
              <p className="pl-hero-subtitle">Encuentra el campo ideal para tu proyecto</p>
            </div>
          </div>
        )}
        <div className="pl-container">
          <div className="pl-loading-container">
            <div className="pl-loading-spinner"></div>
            <p>Cargando propiedades...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="pl-property-list-container">
        {showHero && (
          <div 
            className="pl-hero-section"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          >
            <div className="pl-hero-overlay"></div>
            <div className="pl-hero-content">
              <h1 className="pl-hero-title">Propiedades Rurales</h1>
              <p className="pl-hero-subtitle">Encuentra el campo ideal para tu proyecto</p>
            </div>
          </div>
        )}
        <div className="pl-container">
          <div className="pl-error-container">
            <p>Error: {error}</p>
            <button className="pl-retry-btn" onClick={() => cargarPropiedades()}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-property-list-container">
      {/* Solo el modal de compartir */}
      {shareModal.isOpen && shareModal.propiedad && (
        <ShareModal propiedad={shareModal.propiedad} onClose={closeShareModal} />
      )}
      {/* ✅ Eliminar ContactModal */}

      {showHero && (
        <div 
          className="pl-hero-section"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          <div className="pl-hero-overlay"></div>
          <div className="pl-hero-content">
            <h1 className="pl-hero-title">Propiedades Rurales</h1>
            <p className="pl-hero-subtitle">
              Descubre las propiedades rurales, chacras, campos y estancias
            </p>
          </div>
        </div>
      )}

      <div className="pl-filters-bar" ref={filtersBarRef}>
        <div className="pl-filters-wrapper">
          <div className="pl-filters-grid">
            <div className="pl-filter-group">
              <label className="pl-filter-label">Provincia</label>
              <select
                name="provincia"
                value={filters.provincia}
                onChange={handleFilterChange}
                className="pl-filter-select"
              >
                <option value="">Todas las provincias</option>
                {availableFilters.provincias.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            <div className="pl-filter-group">
              <label className="pl-filter-label">Ciudad / Localidad</label>
              <select
                name="ciudad"
                value={filters.ciudad}
                onChange={handleFilterChange}
                className="pl-filter-select"
                disabled={!filters.provincia || loadingCities}
              >
                <option value="">
                  {loadingCities ? 'Cargando ciudades...' : 'Todas las ciudades'}
                </option>
                {availableFilters.ciudades.map(ciudad => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))}
              </select>
            </div>

            <div className="pl-filter-group">
              <label className="pl-filter-label">Tipo de campo</label>
              <select
                name="tipo_campo"
                value={filters.tipo_campo}
                onChange={handleFilterChange}
                className="pl-filter-select"
              >
                <option value="">Todos los tipos</option>
                {availableFilters.todosLosTiposCampos.map(tipo => (
                  <option key={tipo.id || tipo} value={tipo.id || tipo}>
                    {tipo.nombre || tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="pl-filter-group">
              <label className="pl-filter-label">Operación</label>
              <select
                name="tipo_operacion"
                value={filters.tipo_operacion}
                onChange={handleFilterChange}
                className="pl-filter-select"
              >
                <option value="">Todos</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>

            <div className="pl-filters-actions">
              <button 
                className="pl-filter-btn pl-filter-clear"
                onClick={limpiarFiltros}
                disabled={applyingFilters}
              >
                Limpiar filtros
              </button>
              <button 
                className="pl-filter-btn pl-filter-apply"
                onClick={aplicarFiltros}
                disabled={applyingFilters}
              >
                {applyingFilters ? 'Aplicando...' : 'Aplicar filtros'}
              </button>
            </div>
          </div>          
        </div>
      </div>

      <div className="pl-container" ref={resultsRef}>
        <div className="pl-results-info">
          <p>
            {loading ? 'Cargando...' : properties.length === 0 
              ? 'No se encontraron propiedades con los filtros seleccionados'
              : `Mostrando ${properties.length} propiedades disponibles`}
          </p>
          {(filters.provincia || filters.ciudad || filters.tipo_campo || filters.tipo_operacion) && (
            <span className="pl-active-filters-badge">
              Filtros activos
            </span>
          )}
        </div>
        
        {!loading && properties.length === 0 ? (
          <div className="pl-no-results">
            <svg className="pl-no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" />
            </svg>
            <h3>No encontramos propiedades</h3>
            <p>Intenta con otros filtros o elimina algunos para ver más resultados</p>
            <button className="pl-clear-filters-btn" onClick={limpiarFiltros}>
              Limpiar todos los filtros
            </button>
          </div>
        ) : (
          <div className="pl-properties-list-view">
            {properties.map(prop => {
              const totalImagenes = prop.total_imagenes || prop.imagenes?.length || 0;
              
              return (
                <div 
                  key={prop.id} 
                  className="pl-property-list-item"
                >
                  <div 
                    className="pl-list-item-image"
                    onClick={(e) => openInNewTab(e, prop.codigo)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src={prop.imagen_principal} 
                      alt={prop.titulo}
                      className="pl-item-image"
                      onError={handleImageError}  
                    />
                    {prop.destacado && (
                      <span className="pl-destacado-badge">Destacado</span>
                    )}
                    {totalImagenes > 1 && (
                      <span className="pl-image-count-badge">
                        📷 {totalImagenes}
                      </span>
                    )}
                  </div>
                  
                  <div className="pl-list-item-info">
                    <div className="pl-item-header">
                      <h3 
                        className="pl-item-title"
                        onClick={(e) => openInNewTab(e, prop.codigo)}
                        style={{ cursor: 'pointer' }}
                      >
                        {prop.titulo}
                      </h3>
                      <span className={`pl-operation-badge ${prop.tipo_operacion === 'venta' ? 'pl-operation-venta' : 'pl-operation-alquiler'}`}>
                        {prop.tipo_operacion === 'venta' ? 'EN VENTA' : 'EN ALQUILER'}
                      </span>
                    </div>
                    
                    <div className="pl-item-location">
                      <svg className="pl-location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{prop.ubicacion}</span>
                    </div>
                    
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
                          {prop.servicios.slice(0, 6).map((servicio, idx) => (
                            <span key={idx} className="pl-servicio-tag">
                              {servicio}
                            </span>
                          ))}
                          {prop.servicios.length > 6 && (
                            <span className="pl-servicio-tag pl-servicio-mas">
                              +{prop.servicios.length - 6}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="pl-item-footer">
                      <div className="pl-item-price">
                        <span className="pl-price-amount">{prop.moneda} {prop.precio_formateado}</span>
                      </div>
                      
                      {/* ✅ Botones de contacto rediseñados */}
                      <div className="pl-action-buttons">
                        <button 
                          className="pl-action-btn pl-share-btn"
                          onClick={(e) => handleShare(e, prop)}
                          title="Compartir propiedad"
                        >
                          <svg className="pl-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                          </svg>
                          Compartir
                        </button>
                        
                        {/* ✅ Botón de WhatsApp */}
                        <button 
                          className="pl-action-btn pl-whatsapp-btn"
                          onClick={(e) => handleContactarWhatsApp(e, prop)}
                          title="Contactar por WhatsApp"
                        >
                          <svg className="pl-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                          </svg>
                          WhatsApp
                        </button>
                        
                        {/* ✅ Botón de Email */}
                        <button 
                          className="pl-action-btn pl-email-btn"
                          onClick={(e) => handleContactarEmail(e, prop)}
                          title="Contactar por Email"
                        >
                          <svg className="pl-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          Email
                        </button>
                        
                        <button 
                          className="pl-view-details-btn"
                          onClick={(e) => openInNewTab(e, prop.codigo)}
                          title="Ver detalles"
                        >
                          Ver Ficha
                          <svg className="pl-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}