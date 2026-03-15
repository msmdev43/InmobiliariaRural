// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Propiedades\PublicarPropiedad.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Admin/Sidebar';
import apiService from '../../../services/api.service';
import '../../../styles/pages/Admin/PublicarPropiedad.css';

const PublicarPropiedad = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [tiposCampos, setTiposCampos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [imagenesPreview, setImagenesPreview] = useState([]);
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    codigo: '',
    titulo: '',
    alquilerventa: 'venta',
    superficie: '',
    zona: '',
    precio: '',
    moneda: 'USD',
    descripcion: '',
    longitud: '',
    latitud: '',
    ciudad: '',
    provincia: '',
    estado: 'disponible',
    fecha: new Date().toISOString().split('T')[0],
    campos_idtipocampos: '',
    servicios: [] // Array vacío, no [null]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargandoDatos(true);
        setError('');
        
        const [tiposResponse, serviciosResponse] = await Promise.all([
          apiService.getTiposCampos(),
          apiService.getServicios()
        ]);

        setTiposCampos(tiposResponse.data || []);
        setServicios(serviciosResponse.data || []);
        
      } catch (error) {
        console.error('Error cargando datos:', error);
        setError('Error al cargar datos. Por favor, recarga la página.');
        
        // Datos de respaldo solo para desarrollo
        if (process.env.NODE_ENV === 'development') {
          setTiposCampos([
            { id: 1, nombre: 'Campo Agrícola' },
            { id: 2, nombre: 'Campo Ganadero' },
            { id: 3, nombre: 'Estancia' },
            { id: 4, nombre: 'Chacra' }
          ]);
          setServicios([
            { id: 1, nombre: 'Agua Corriente' },
            { id: 2, nombre: 'Energía Eléctrica' },
            { id: 3, nombre: 'Internet' }
          ]);
        }
      } finally {
        setCargandoDatos(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicioChange = (servicioId) => {
    setFormData(prev => {
      // Asegurar que servicioId sea número y eliminar nulls
      const id = Number(servicioId);
      const serviciosActuales = prev.servicios.filter(s => s !== null);
      
      const nuevosServicios = serviciosActuales.includes(id)
        ? serviciosActuales.filter(s => s !== id)
        : [...serviciosActuales, id];
      
      return {
        ...prev,
        servicios: nuevosServicios
      };
    });
  };

  const handleImagenes = (e) => {
    const files = Array.from(e.target.files);
    
    if (imagenesFiles.length + files.length > 10) {
      alert('Máximo 10 imágenes permitidas');
      return;
    }

    const previews = files.map(file => URL.createObjectURL(file));
    setImagenesPreview(prev => [...prev, ...previews]);
    setImagenesFiles(prev => [...prev, ...files]);
  };

  const eliminarImagen = (index) => {
    URL.revokeObjectURL(imagenesPreview[index]);
    setImagenesPreview(prev => prev.filter((_, i) => i !== index));
    setImagenesFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moverImagen = (index, direccion) => {
    if (
      (direccion === 'up' && index === 0) ||
      (direccion === 'down' && index === imagenesFiles.length - 1)
    ) {
      return;
    }

    const nuevoIndex = direccion === 'up' ? index - 1 : index + 1;
    
    const nuevasPreviews = [...imagenesPreview];
    const nuevosFiles = [...imagenesFiles];

    [nuevasPreviews[index], nuevasPreviews[nuevoIndex]] = [nuevasPreviews[nuevoIndex], nuevasPreviews[index]];
    [nuevosFiles[index], nuevosFiles[nuevoIndex]] = [nuevosFiles[nuevoIndex], nuevosFiles[index]];

    setImagenesPreview(nuevasPreviews);
    setImagenesFiles(nuevosFiles);
  };

  const generarCodigo = () => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const codigo = `CAM-${año}${mes}-${random}`;
    
    setFormData(prev => ({
      ...prev,
      codigo: codigo
    }));
  };

  const validarFormulario = () => {
    // Validar campos obligatorios
    const camposRequeridos = [
      { campo: 'titulo', mensaje: 'título' },
      { campo: 'alquilerventa', mensaje: 'tipo de operación' },
      { campo: 'superficie', mensaje: 'superficie' },
      { campo: 'zona', mensaje: 'zona' },
      { campo: 'precio', mensaje: 'precio' },
      { campo: 'descripcion', mensaje: 'descripción' },
      { campo: 'ciudad', mensaje: 'ciudad' },
      { campo: 'provincia', mensaje: 'provincia' },
      { campo: 'campos_idtipocampos', mensaje: 'tipo de campo' }
    ];

    for (let item of camposRequeridos) {
      if (!formData[item.campo]) {
        alert(`Por favor completa el campo: ${item.mensaje}`);
        return false;
      }
    }

    // Validar que el tipo de campo sea un número válido
    if (isNaN(Number(formData.campos_idtipocampos))) {
      alert('Por favor selecciona un tipo de campo válido');
      return false;
    }

    // Validar que superficie sea positiva
    if (Number(formData.superficie) <= 0) {
      alert('La superficie debe ser mayor a 0');
      return false;
    }

    // Validar que precio sea positivo
    if (Number(formData.precio) <= 0) {
      alert('El precio debe ser mayor a 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Agregar todos los campos del formulario con el tipo correcto
      Object.keys(formData).forEach(key => {
        let valor = formData[key];
        
        if (key === 'servicios') {
          // Filtrar nulls y enviar como JSON string
          const serviciosValidos = (valor || []).filter(s => s !== null).map(Number);
          formDataToSend.append('servicios', JSON.stringify(serviciosValidos));
        } 
        else if (key === 'campos_idtipocampos') {
          // Asegurar que se envíe como número
          formDataToSend.append(key, Number(valor));
        }
        else if (key === 'superficie' || key === 'precio') {
          formDataToSend.append(key, Number(valor));
        }
        else if (key === 'longitud' || key === 'latitud') {
          // Solo enviar si tienen valor
          if (valor && valor !== '') {
            formDataToSend.append(key, Number(valor));
          }
        }
        else if (valor !== null && valor !== undefined && valor !== '') {
          formDataToSend.append(key, valor);
        }
      });

      // Agregar imágenes (como array)
      imagenesFiles.forEach((imagen, index) => {
        formDataToSend.append('imagenes[]', imagen);
      });

      // Debug: ver qué se está enviando
      console.log('=== FORM DATA ENVIADO ===');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await apiService.crearPropiedad(formDataToSend);
      
      if (response.success) {
        alert('¡Propiedad publicada con éxito!');
        navigate('/admin/propiedades');
      } else {
        setError(response.message || 'Error al publicar la propiedad');
        alert(response.message || 'Error al publicar la propiedad');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message || 'Error al conectar con el servidor');
      alert(error.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (cargandoDatos) {
    return (
      <Sidebar>
        <div className="publicar-loading-unique">
          <div className="publicar-spinner-unique"></div>
          <p className="publicar-loading-text-unique">Cargando formulario...</p>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="publicar-page-unique">
        {/* Header */}
        <div className="publicar-header-unique">
          <div className="publicar-header-content-unique">
            <h1 className="publicar-title-unique">Publicar Nueva Propiedad</h1>
            <p className="publicar-subtitle-unique">Completa todos los datos de la propiedad rural</p>
          </div>
          <button type="button" onClick={generarCodigo} className="publicar-btn-codigo-unique">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generar Código
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="publicar-error-unique">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="publicar-form-unique">
          {/* SECCIÓN 1: Información Básica */}
          <div className="publicar-seccion-unique">
            <div className="publicar-seccion-titulo-unique">
              <span className="publicar-seccion-numero-unique">1</span>
              <h2 className="publicar-seccion-heading-unique">Información Básica</h2>
            </div>
            
            <div className="publicar-grid-unique">
              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Código</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="CAM-2026-001"
                  className="publicar-input-unique"
                />
                <small className="publicar-ayuda-unique">Si se deja vacío, se generará automáticamente</small>
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Título <span className="publicar-required-unique">*</span></label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Campo Santa Irene - 500 hectáreas"
                  className="publicar-input-unique"
                />
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Tipo de Operación <span className="publicar-required-unique">*</span></label>
                <select name="alquilerventa" value={formData.alquilerventa} onChange={handleChange} className="publicar-select-unique">
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                  <option value="alquiler_venta">Alquiler con opción a venta</option>
                </select>
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Tipo de Campo <span className="publicar-required-unique">*</span></label>
                <select 
                  name="campos_idtipocampos" 
                  value={formData.campos_idtipocampos} 
                  onChange={handleChange} 
                  className="publicar-select-unique"
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposCampos.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Superficie (ha) <span className="publicar-required-unique">*</span></label>
                <input
                  type="number"
                  name="superficie"
                  value={formData.superficie}
                  onChange={handleChange}
                  placeholder="Ej: 500"
                  min="0.01"
                  step="0.01"
                  className="publicar-input-unique"
                />
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Estado</label>
                <select name="estado" value={formData.estado} onChange={handleChange} className="publicar-select-unique">
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                  <option value="alquilado">Alquilado</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Precio y Descripción */}
          <div className="publicar-seccion-unique">
            <div className="publicar-seccion-titulo-unique">
              <span className="publicar-seccion-numero-unique">2</span>
              <h2 className="publicar-seccion-heading-unique">Precio y Descripción</h2>
            </div>
            
            <div className="publicar-grid-unique">
              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Precio <span className="publicar-required-unique">*</span></label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Ej: 250000"
                  min="0.01"
                  step="0.01"
                  className="publicar-input-unique"
                />
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Moneda <span className="publicar-required-unique">*</span></label>
                <select name="moneda" value={formData.moneda} onChange={handleChange} className="publicar-select-unique">
                  <option value="USD">USD - Dólar</option>
                  <option value="ARG">ARG - Peso Argentino</option>
                </select>
              </div>

              <div className="publicar-campo-unique publicar-campo-full-unique">
                <label className="publicar-label-unique">Descripción <span className="publicar-required-unique">*</span></label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe la propiedad, sus características, accesos, etc."
                  rows="4"
                  className="publicar-textarea-unique"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Ubicación */}
          <div className="publicar-seccion-unique">
            <div className="publicar-seccion-titulo-unique">
              <span className="publicar-seccion-numero-unique">3</span>
              <h2 className="publicar-seccion-heading-unique">Ubicación</h2>
            </div>
            
            <div className="publicar-grid-unique">
              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Provincia <span className="publicar-required-unique">*</span></label>
                <select name="provincia" value={formData.provincia} onChange={handleChange} className="publicar-select-unique">
                  <option value="">Seleccionar provincia</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Catamarca">Catamarca</option>
                  <option value="Chaco">Chaco</option>
                  <option value="Chubut">Chubut</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Corrientes">Corrientes</option>
                  <option value="Entre Ríos">Entre Ríos</option>
                  <option value="Formosa">Formosa</option>
                  <option value="Jujuy">Jujuy</option>
                  <option value="La Pampa">La Pampa</option>
                  <option value="La Rioja">La Rioja</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Misiones">Misiones</option>
                  <option value="Neuquén">Neuquén</option>
                  <option value="Río Negro">Río Negro</option>
                  <option value="Salta">Salta</option>
                  <option value="San Juan">San Juan</option>
                  <option value="San Luis">San Luis</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Santiago del Estero">Santiago del Estero</option>
                  <option value="Tierra del Fuego">Tierra del Fuego</option>
                  <option value="Tucumán">Tucumán</option>
                </select>
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Ciudad/Localidad <span className="publicar-required-unique">*</span></label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Ej: San Carlos"
                  className="publicar-input-unique"
                />
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Zona/Paraje <span className="publicar-required-unique">*</span></label>
                <input
                  type="text"
                  name="zona"
                  value={formData.zona}
                  onChange={handleChange}
                  placeholder="Ej: Paraje La Ballenera"
                  className="publicar-input-unique"
                />
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Latitud</label>
                <input
                  type="number"
                  step="0.000001"
                  name="latitud"
                  value={formData.latitud}
                  onChange={handleChange}
                  placeholder="Ej: -34.123456"
                  className="publicar-input-unique"
                />
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Longitud</label>
                <input
                  type="number"
                  step="0.000001"
                  name="longitud"
                  value={formData.longitud}
                  onChange={handleChange}
                  placeholder="Ej: -54.123456"
                  className="publicar-input-unique"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: Servicios */}
          <div className="publicar-seccion-unique">
            <div className="publicar-seccion-titulo-unique">
              <span className="publicar-seccion-numero-unique">4</span>
              <h2 className="publicar-seccion-heading-unique">Servicios Disponibles</h2>
            </div>
            
            <div className="publicar-servicios-grid-unique">
              {servicios.map(servicio => (
                <label key={servicio.id} className="publicar-servicio-item-unique">
                  <input
                    type="checkbox"
                    checked={formData.servicios.includes(servicio.id)}
                    onChange={() => handleServicioChange(servicio.id)}
                    className="publicar-servicio-checkbox-unique"
                  />
                  <span className="publicar-servicio-checkmark-unique"></span>
                  <span className="publicar-servicio-nombre-unique">{servicio.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SECCIÓN 5: Imágenes */}
          <div className="publicar-seccion-unique">
            <div className="publicar-seccion-titulo-unique">
              <span className="publicar-seccion-numero-unique">5</span>
              <h2 className="publicar-seccion-heading-unique">Imágenes</h2>
            </div>
            
            <div className="publicar-imagenes-section-unique">
              <input
                type="file"
                id="publicar-imagenes-unique"
                multiple
                accept="image/*"
                onChange={handleImagenes}
                className="publicar-file-input-unique"
              />
              <label htmlFor="publicar-imagenes-unique" className="publicar-upload-area-unique">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p className="publicar-upload-text-unique">Haz clic para subir imágenes</p>
                <span className="publicar-upload-hint-unique">Máximo 10 imágenes (JPG, PNG)</span>
              </label>

              {imagenesPreview.length > 0 && (
                <div className="publicar-preview-grid-unique">
                  {imagenesPreview.map((img, index) => (
                    <div key={index} className="publicar-preview-item-unique">
                      <img src={img} alt={`Preview ${index}`} className="publicar-preview-img-unique" />
                      <span className="publicar-preview-order-unique">{index + 1}</span>
                      <div className="publicar-preview-actions-unique">
                        <button
                          type="button"
                          onClick={() => moverImagen(index, 'up')}
                          disabled={index === 0}
                          className="publicar-preview-btn-unique publicar-preview-btn-up-unique"
                          title="Mover arriba"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moverImagen(index, 'down')}
                          disabled={index === imagenesFiles.length - 1}
                          className="publicar-preview-btn-unique publicar-preview-btn-down-unique"
                          title="Mover abajo"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminarImagen(index)}
                          className="publicar-preview-btn-unique publicar-preview-btn-delete-unique"
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="publicar-acciones-unique">
            <button 
              type="button" 
              className="publicar-btn-cancelar-unique"
              onClick={() => navigate('/admin/propiedades')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="publicar-btn-publicar-unique"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="publicar-spinner-small-unique"></span>
                  Publicando...
                </>
              ) : (
                'Publicar Propiedad'
              )}
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
};

export default PublicarPropiedad;