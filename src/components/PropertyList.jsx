// C:\xampp\htdocs\InmobiliariaRural\src\components\PropertyList.jsx (versión simplificada para prueba)
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

  if (loading) return <div>Cargando propiedades...</div>;
  if (error) return <div>Error: {error}</div>;
  if (properties.length === 0) return <div>No hay propiedades disponibles</div>;

  return (
    <div>
      <h2>Propiedades ({properties.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {properties.map(prop => (
          <div key={prop.id} style={{ border: '1px solid #ccc', padding: '15px' }}>
            <img 
              src={prop.imagen_principal} 
              alt={prop.titulo}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              onError={(e) => e.target.src = 'http://localhost/BackInmobiliariaRural/uploads/propiedades/default.png'}
            />
            <h3>{prop.titulo}</h3>
            <p>{prop.ubicacion}</p>
            <p><strong>{prop.moneda} {prop.precio_formateado}</strong></p>
            <button onClick={() => window.location.href = `/propiedad/${prop.id}`}>
              Ver más
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}