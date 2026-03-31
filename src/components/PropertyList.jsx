// C:\xampp\htdocs\InmobiliariaRural\src\components\PropertyList.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../services/api.service';
import ShareModal from './UI/ShareModal';
import ContactModal from './UI/ContactModal';
import "../styles/components/propiedades/propertyList.css";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareModal, setShareModal] = useState({ isOpen: false, propiedad: null });
  const [contactModal, setContactModal] = useState({ isOpen: false, propiedad: null });

  useEffect(() => {
    cargarPropiedades();
  }, []);

  const cargarPropiedades = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPropiedadesPublic({ pagina: 1, por_pagina: 12 });
      console.log('Respuesta completa:', response);
      
      if (response.success) {
        setProperties(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (e, propiedad) => {
    e.stopPropagation();
    setShareModal({ isOpen: true, propiedad });
  };

  const handleContact = (e, propiedad) => {
    e.stopPropagation();
    setContactModal({ isOpen: true, propiedad });
  };

  const closeShareModal = () => {
    setShareModal({ isOpen: false, propiedad: null });
  };

  const closeContactModal = () => {
    setContactModal({ isOpen: false, propiedad: null });
  };

  if (loading) {
    return (
      <div className="pl-property-list-container">
        <div className="pl-container">
          <div className="pl-loading-container">
            <div className="pl-loading-spinner"></div>
            <p>Cargando propiedades...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pl-property-list-container">
        <div className="pl-container">
          <div className="pl-error-container">
            <p>Error: {error}</p>
            <button className="pl-retry-btn" onClick={cargarPropiedades}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="pl-property-list-container">
        <div className="pl-container">
          <div className="pl-no-results">
            <p>No hay propiedades disponibles en este momento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-property-list-container">
      {/* Modales */}
      {shareModal.isOpen && shareModal.propiedad && (
        <ShareModal propiedad={shareModal.propiedad} onClose={closeShareModal} />
      )}
      {contactModal.isOpen && contactModal.propiedad && (
        <ContactModal propiedad={contactModal.propiedad} onClose={closeContactModal} />
      )}

      <div className="pl-container">
        <div className="pl-results-info">
          <p>Mostrando {properties.length} propiedades disponibles</p>
        </div>
        
        <div className="pl-properties-list-view">
          {properties.map(prop => {
            const totalImagenes = prop.total_imagenes || prop.imagenes?.length || 0;
            
            return (
              <div 
                key={prop.id} 
                className="pl-property-list-item"
                onClick={() => window.location.href = `/propiedad/${prop.id}`}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = `/propiedad/${prop.id}`;
                  }
                }}
              >
                {/* Columna de imagen */}
                <div className="pl-list-item-image">
                  <img 
                    src={prop.imagen_principal} 
                    alt={prop.titulo}
                    className="pl-item-image"
                    onError={(e) => e.target.src = 'http://localhost/BackInmobiliariaRural/uploads/propiedades/default.png'}
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
                
                {/* Columna de información */}
                <div className="pl-list-item-info">
                  <div className="pl-item-header">
                    <h3 className="pl-item-title">{prop.titulo}</h3>
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
                      <button 
                        className="pl-action-btn pl-contact-btn"
                        onClick={(e) => handleContact(e, prop)}
                        title="Contactar por esta propiedad"
                      >
                        <svg className="pl-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Contactar
                      </button>
                      <button 
                        className="pl-view-details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/propiedad/${prop.id}`;
                        }}
                        title="Ver detalles"
                      >
                        Ver más
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
      </div>
    </div>
  );
}