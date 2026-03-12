// src/pages/Admin/Propiedades/NuevaPropiedad.jsx (simplificado)
import React, { useState } from 'react';
import './PropiedadForm.css';

const NuevaPropiedad = () => {
  const [formData, setFormData] = useState({
    codigo: '',
    titulo: '',
    alquilerventa: 'venta',
    superficie: '',
    zona: '',
    precio: '',
    moneda: 'ARS',
    descripcion: '',
    longitud: '',
    latitud: '',
    ciudad: '',
    provincia: 'Buenos Aires',
    estado: 'disponible',
    fecha: new Date().toISOString().split('T')[0],
    campos_idtipocampos: 1,
    servicios: [],
    imagenes: []
  });

  const provincias = [
    'Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Entre Ríos',
    'La Pampa', 'San Luis', 'Corrientes', 'Misiones', 'Tucumán'
  ];

  const tiposCampos = [
    { id: 1, nombre: 'Campo' },
    { id: 2, nombre: 'Chacra' },
    { id: 3, nombre: 'Estancia' },
    { id: 4, nombre: 'Quinta' },
    { id: 5, nombre: 'Lote' }
  ];

  const servicios = [
    { id: 1, nombre: 'Agua corriente' },
    { id: 2, nombre: 'Energía eléctrica' },
    { id: 3, nombre: 'Gas natural' },
    { id: 4, nombre: 'Internet' },
    { id: 5, nombre: 'Camino pavimentado' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica para guardar
    console.log('Guardar propiedad:', formData);
  };

  return (
    <div className="propiedad-form-container">
      <h2>Nueva Propiedad Rural</h2>
      
      <form onSubmit={handleSubmit} className="propiedad-form">
        {/* Datos básicos */}
        <div className="form-section">
          <h3>Datos básicos</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Código:</label>
              <input 
                type="text" 
                value={formData.codigo}
                placeholder="INM-2024-001"
                onChange={(e) => setFormData({...formData, codigo: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Título:</label>
              <input 
                type="text" 
                value={formData.titulo}
                placeholder="Campo en venta en..."
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo:</label>
              <select 
                value={formData.alquilerventa}
                onChange={(e) => setFormData({...formData, alquilerventa: e.target.value})}
              >
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Estado:</label>
              <select 
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
              >
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
                <option value="destacado">Destacado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="form-section">
          <h3>Ubicación</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Provincia:</label>
              <select 
                value={formData.provincia}
                onChange={(e) => setFormData({...formData, provincia: e.target.value})}
              >
                {provincias.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label>Ciudad/Partido:</label>
              <input 
                type="text" 
                value={formData.ciudad}
                onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Zona/Paraje:</label>
            <input 
              type="text" 
              value={formData.zona}
              placeholder="Ej: Ruta 226 km 12"
              onChange={(e) => setFormData({...formData, zona: e.target.value})}
            />
          </div>
        </div>

        {/* Características */}
        <div className="form-section">
          <h3>Características</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Superficie:</label>
              <input 
                type="text" 
                value={formData.superficie}
                placeholder="Ej: 50 ha"
                onChange={(e) => setFormData({...formData, superficie: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Tipo de campo:</label>
              <select 
                value={formData.campos_idtipocampos}
                onChange={(e) => setFormData({...formData, campos_idtipocampos: e.target.value})}
              >
                {tiposCampos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio:</label>
              <input 
                type="number" 
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Moneda:</label>
              <select 
                value={formData.moneda}
                onChange={(e) => setFormData({...formData, moneda: e.target.value})}
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Servicios */}
        <div className="form-section">
          <h3>Servicios</h3>
          <div className="checkbox-group">
            {servicios.map(serv => (
              <label key={serv.id}>
                <input 
                  type="checkbox" 
                  value={serv.id}
                  onChange={(e) => {
                    const newServicios = e.target.checked 
                      ? [...formData.servicios, serv.id]
                      : formData.servicios.filter(s => s !== serv.id);
                    setFormData({...formData, servicios: newServicios});
                  }}
                />
                {serv.nombre}
              </label>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div className="form-section">
          <h3>Descripción</h3>
          <textarea 
            rows="6"
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            placeholder="Descripción detallada de la propiedad..."
            required
          ></textarea>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Guardar Propiedad
          </button>
          <button type="button" className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevaPropiedad;