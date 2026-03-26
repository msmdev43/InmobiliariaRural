// C:\xampp\htdocs\InmobiliariaRural\src\components\FeaturedProperties.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Ruler, ArrowRight } from "lucide-react";
import apiService from '../services/api.service';
import "../styles/components/featuredProp.css";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL de la imagen por defecto (ahora como constante)
  const DEFAULT_IMAGE = 'http://localhost/BackInmobiliariaRural/uploads/propiedades/default.png';

  useEffect(() => {
    cargarPropiedadesDestacadas();
  }, []);

  const cargarPropiedadesDestacadas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getPropiedadesDestacadas();
      console.log('Propiedades cargadas:', response); // Debug
      
      if (response.success) {
        setProperties(response.data || []);
      } else {
        setError(response.message || 'Error al cargar propiedades');
      }
    } catch (error) {
      console.error('Error cargando propiedades destacadas:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    console.log('Error cargando imagen, usando default:', e.target.src);
    e.target.src = DEFAULT_IMAGE;
    e.target.onerror = null; // Prevenir bucle infinito
  };

  const handleViewMore = (id) => {
    window.location.href = `/propiedad/${id}`;
  };

  const handleViewAll = () => {
    window.location.href = '/propiedades';
  };

  if (loading) {
    return (
      <section id="propiedades" className="featured-section">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Destacadas</p>
            <h2 className="section-title">Propiedades seleccionadas</h2>
            <p className="section-description">
              Cargando nuestras mejores propiedades...
            </p>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="propiedades" className="featured-section">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Destacadas</p>
            <h2 className="section-title">Propiedades seleccionadas</h2>
            <p className="section-description">
              {error}
            </p>
          </div>
          <div className="error-container">
            <button 
              className="retry-button"
              onClick={cargarPropiedadesDestacadas}
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section id="propiedades" className="featured-section">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Destacadas</p>
            <h2 className="section-title">Propiedades seleccionadas</h2>
            <p className="section-description">
              No hay propiedades destacadas disponibles en este momento.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="propiedades" className="featured-section">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Destacadas</p>
          <h2 className="section-title">Propiedades seleccionadas</h2>
          <p className="section-description">
            Ingrese a las propiedades rurales disponibles en este momento.
          </p>
        </div>

        <div className="properties-grid">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className="property-card"
              onClick={() => handleViewMore(property.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleViewMore(property.id);
                }
              }}
            >
              <div className="card-image-container">
                <img
                  src={property.image}
                  alt={property.title}
                  className="card-image"
                  onError={handleImageError}
                  loading="lazy"
                />
                <span className="property-type-badge">{property.type}</span>
                {property.total_imagenes > 1 && (
                  <span className="image-count-badge">
                    📷 {property.total_imagenes}
                  </span>
                )}
              </div>
              
              <div className="card-content">
                <h3 className="property-title">{property.title}</h3>
                
                <div className="property-location">
                  <MapPin className="location-icon" />
                  <span className="location-text">{property.location}</span>
                </div>
                
                <div className="property-features">
                  <div className="prop-feature-item">
                    <Ruler className="feature-icon" />
                    <span>{property.area}</span>
                  </div>
                  {property.servicios && property.servicios.length > 0 && (
                    <div className="servicios-preview">
                      {property.servicios.slice(0, 2).map((servicio, idx) => (
                        <span key={idx} className="servicio-tag">{servicio}</span>
                      ))}
                      {property.servicios.length > 2 && (
                        <span className="servicio-tag">+{property.servicios.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="card-footer">
                  <p className="property-price">
                    {property.moneda} {property.price}
                  </p>
                  <button
                    className="view-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que se dispare el click de la tarjeta
                      handleViewMore(property.id);
                    }}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <button className="view-all-button" onClick={handleViewAll}>
            Ver todas las propiedades
            <ArrowRight className="button-icon" />
          </button>
        </div>
      </div>
    </section>
  );
}