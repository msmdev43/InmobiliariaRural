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
      <div className="property-list-container">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando propiedades...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-list-container">
        <div className="container">
          <div className="error-container">
            <p>Error: {error}</p>
            <button className="retry-btn" onClick={cargarPropiedades}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="property-list-container">
        <div className="container">
          <div className="no-results">
            <p>No hay propiedades disponibles en este momento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="property-list-container">
      <div className="container">
        <div className="results-info">
          <p>Mostrando {properties.length} propiedades disponibles</p>
        </div>
        
        <div className="properties-grid">
          {properties.map(prop => {
            // Determinar el total de imágenes correctamente
            const totalImagenes = prop.total_imagenes || prop.imagenes?.length || 0;
            
            return (
              <div 
                key={prop.id} 
                className="property-card"
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
                <div className="card-image-container">
                  <img 
                    src={prop.imagen_principal} 
                    alt={prop.titulo}
                    className="card-image"
                    onError={(e) => e.target.src = 'http://localhost/BackInmobiliariaRural/uploads/propiedades/default.png'}
                  />
                  {prop.destacado && (
                    <span className="destacado-badge">Destacado</span>
                  )}
                  <span className={`operation-badge ${prop.tipo_operacion === 'venta' ? 'operation-venta' : 'operation-alquiler'}`}>
                    {prop.tipo_operacion === 'venta' ? 'EN VENTA' : 'EN ALQUILER'}
                  </span>
                  {totalImagenes > 1 && (
                    <span className="property-list-image-count-badge">
                      📷 {totalImagenes}
                    </span>
                  )}
                </div>
                
                <div className="card-content">
                  <h3 className="property-title">{prop.titulo}</h3>
                  
                  <div className="property-location">
                    <svg className="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="location-text">{prop.ubicacion}</span>
                  </div>
                  
                  <div className="property-features">
                    <div className="feature-item">
                      <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-6 9 6-9 6-9-6z" />
                        <path d="M3 15l9 6 9-6" />
                      </svg>
                      <span>{prop.superficie} ha</span>
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <p className="property-price">
                      {prop.moneda} {prop.precio_formateado}
                    </p>
                    <button 
                      className="view-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/propiedad/${prop.id}`;
                      }}
                    >
                      Ver más
                      <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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