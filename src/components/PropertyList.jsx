// C:\xampp\htdocs\InmobiliariaRural\src\components\PropertyList.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../services/api.service';
import "../styles/components/propiedades/propertyList.css";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="pl-container">
        <div className="pl-results-info">
          <p>Mostrando {properties.length} propiedades disponibles</p>
        </div>
        
        {/* VISTA DE LISTA - ESTILO ZONAPROP */}
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
                      <div className="pl-feature-item pl-servicios">
                        <svg className="pl-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.04.04A10 10 0 0 0 12 17.66a10 10 0 0 0 6.36-2.62z" />
                        </svg>
                        <span>{prop.servicios.slice(0, 3).join(', ')}{prop.servicios.length > 3 && '...'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pl-item-footer">
                    <div className="pl-item-price">
                      <span className="pl-price-amount">{prop.moneda} {prop.precio_formateado}</span>
                    </div>
                    <button 
                      className="pl-view-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/propiedad/${prop.id}`;
                      }}
                    >
                      Ver detalles
                      <svg className="pl-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
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