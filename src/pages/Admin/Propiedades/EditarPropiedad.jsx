// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Propiedades\EditarPropiedad.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Admin/Sidebar';
import apiService from '../../../services/api.service';
import { useToast, ToastContainer } from '../../../components/UI/Toast';
import MapaUbicacion from '../../../components/UI/MapaUbicacion';
import '../../../styles/pages/Admin/propiedades/PublicarPropiedad.css';
import 'leaflet/dist/leaflet.css';

const EditarPropiedad = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [tiposCampos, setTiposCampos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [imagenesPreview, setImagenesPreview] = useState([]);
  const [imagenesFiles, setImagenesFiles] = useState([]);
  const [imagenesExistentes, setImagenesExistentes] = useState([]);
  const [erroresValidacion, setErroresValidacion] = useState({});
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  const [formData, setFormData] = useState({
    id: '',
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
    fecha: '',
    campos_idtipocampos: '',
    destacado: false
  });

  // Cargar datos de la propiedad - SOLO UNA VEZ
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargandoDatos(true);
        
        // Cargar tipos de campos y servicios en paralelo
        const [tiposResponse, serviciosResponse] = await Promise.all([
          apiService.getTiposCampos(),
          apiService.getServicios()
        ]);

        setTiposCampos(tiposResponse.data || []);
        setServicios(serviciosResponse.data || []);

        // Cargar datos de la propiedad
        const propiedadResponse = await apiService.getPropiedadDetalle(id);
        console.log('Respuesta completa:', propiedadResponse);
        
        if (propiedadResponse.success && propiedadResponse.data) {
          const prop = propiedadResponse.data;
          console.log('Datos de propiedad:', prop);
          console.log('Servicios recibidos:', prop.servicios);
          console.log('Imágenes recibidas:', prop.imagenes);
          
          // Extraer datos
          const latitud = prop.ubicacion?.latitud || '';
          const longitud = prop.ubicacion?.longitud || '';
          const ciudad = prop.ubicacion?.ciudad || '';
          const provincia = prop.ubicacion?.provincia || '';
          const tipoCampoId = prop.tipo_campo?.id || '';
          
          // Extraer servicios IDs
          const serviciosIds = prop.servicios && Array.isArray(prop.servicios) 
            ? prop.servicios.map(s => s.id) 
            : [];
          
          console.log('Servicios IDs extraídos:', serviciosIds);
          
          // Formatear fecha
          let fechaFormateada = '';
          if (prop.fecha_publicacion) {
            fechaFormateada = prop.fecha_publicacion.split(' ')[0];
          } else if (prop.fecha) {
            fechaFormateada = prop.fecha.split(' ')[0];
          }
          
          // Actualizar formData
          setFormData({
            id: prop.id,
            codigo: prop.codigo || '',
            titulo: prop.titulo || '',
            alquilerventa: prop.tipo_operacion || 'venta',
            superficie: prop.superficie?.toString() || '',
            zona: prop.zona || '',
            precio: prop.precio?.toString() || '',
            moneda: prop.moneda || 'USD',
            descripcion: prop.descripcion || '',
            longitud: longitud,
            latitud: latitud,
            ciudad: ciudad,
            provincia: provincia,
            estado: prop.estado || 'disponible',
            fecha: fechaFormateada,
            campos_idtipocampos: tipoCampoId,
            destacado: prop.destacado || false
          });
          
          // Actualizar servicios seleccionados
          setServiciosSeleccionados(serviciosIds);
          console.log('Servicios seleccionados seteados:', serviciosIds);
          
          // Actualizar imágenes existentes - asegurando URL completa
          if (prop.imagenes && Array.isArray(prop.imagenes) && prop.imagenes.length > 0) {
            const imagenesConUrlCompleta = prop.imagenes.map(img => ({
                ...img,
                url: img.url.startsWith('http') 
                ? img.url 
                : `http://localhost${img.url}` // Asegurar que use localhost sin puerto
            }));
            setImagenesExistentes(imagenesConUrlCompleta);
            console.log('Imágenes existentes con URL corregida:', imagenesConUrlCompleta);
          }
        } else {
          toast.error(propiedadResponse.message || 'No se pudo cargar la propiedad');
          navigate('/admin/propiedades');
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
        toast.error('Error al cargar los datos de la propiedad');
        navigate('/admin/propiedades');
      } finally {
        setCargandoDatos(false);
      }
    };

    if (id) {
      cargarDatos();
    } else {
      navigate('/admin/propiedades');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (erroresValidacion[name]) {
      setErroresValidacion(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImagenes = (e) => {
    const files = Array.from(e.target.files);
    
    if (imagenesFiles.length + files.length > 10) {
      toast.warning('Máximo 10 imágenes permitidas');
      return;
    }

    const previews = files.map(file => URL.createObjectURL(file));
    setImagenesPreview(prev => [...prev, ...previews]);
    setImagenesFiles(prev => [...prev, ...files]);
    
    if (files.length > 0) {
      toast.success(`${files.length} ${files.length === 1 ? 'imagen agregada' : 'imágenes agregadas'} correctamente`, 2000);
    }
  };

  const eliminarImagenExistente = async (imagenId, index) => {
    try {
      const response = await apiService.eliminarImagen(imagenId, formData.id);
      if (response.success) {
        setImagenesExistentes(prev => prev.filter((_, i) => i !== index));
        toast.success('Imagen eliminada');
      } else {
        toast.error('Error al eliminar la imagen');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  const eliminarImagenNueva = (index) => {
    URL.revokeObjectURL(imagenesPreview[index]);
    setImagenesPreview(prev => prev.filter((_, i) => i !== index));
    setImagenesFiles(prev => prev.filter((_, i) => i !== index));
    toast.info('Imagen eliminada', 2000);
  };

  const handleCoordenadasChange = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitud: lat,
      longitud: lng
    }));
    
    if (erroresValidacion.latitud || erroresValidacion.longitud) {
      setErroresValidacion(prev => ({
        ...prev,
        latitud: null,
        longitud: null
      }));
    }
  };

  const handleImagenError = (imgId, url) => {
    if (!imageErrors[imgId]) {
      console.error('Error cargando imagen:', url);
      setImageErrors(prev => ({ ...prev, [imgId]: true }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.titulo?.trim()) nuevosErrores.titulo = 'El título es obligatorio';
    if (!formData.alquilerventa) nuevosErrores.alquilerventa = 'El tipo de operación es obligatorio';
    
    if (!formData.superficie?.trim()) {
      nuevosErrores.superficie = 'La superficie es obligatoria';
    } else if (Number(formData.superficie) <= 0) {
      nuevosErrores.superficie = 'La superficie debe ser mayor a 0';
    }
    
    if (!formData.zona?.trim()) nuevosErrores.zona = 'La zona es obligatoria';
    
    if (!formData.precio?.trim()) {
      nuevosErrores.precio = 'El precio es obligatorio';
    } else if (Number(formData.precio) <= 0) {
      nuevosErrores.precio = 'El precio debe ser mayor a 0';
    }
    
    if (!formData.descripcion?.trim()) nuevosErrores.descripcion = 'La descripción es obligatoria';
    if (!formData.ciudad?.trim()) nuevosErrores.ciudad = 'La ciudad es obligatoria';
    if (!formData.provincia?.trim()) nuevosErrores.provincia = 'La provincia es obligatoria';
    
    if (!formData.campos_idtipocampos) {
      nuevosErrores.campos_idtipocampos = 'El tipo de campo es obligatorio';
    } else if (isNaN(Number(formData.campos_idtipocampos))) {
      nuevosErrores.campos_idtipocampos = 'Selecciona un tipo de campo válido';
    }

    setErroresValidacion(nuevosErrores);
    
    if (Object.keys(nuevosErrores).length > 0) {
      const primerError = Object.values(nuevosErrores)[0];
      toast.error(primerError);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('id', formData.id);
      formDataToSend.append('codigo', formData.codigo || '');
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('alquilerventa', formData.alquilerventa);
      formDataToSend.append('superficie', formData.superficie);
      formDataToSend.append('zona', formData.zona);
      formDataToSend.append('precio', formData.precio);
      formDataToSend.append('moneda', formData.moneda);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('ciudad', formData.ciudad);
      formDataToSend.append('provincia', formData.provincia);
      formDataToSend.append('estado', formData.estado);
      formDataToSend.append('fecha', formData.fecha);
      formDataToSend.append('campos_idtipocampos', formData.campos_idtipocampos);
      formDataToSend.append('destacado', formData.destacado ? '1' : '0');
      
      formDataToSend.append('latitud', formData.latitud || 0);
      formDataToSend.append('longitud', formData.longitud || 0);
      
      const serviciosValidos = serviciosSeleccionados.filter(s => !isNaN(s)).map(Number);
      formDataToSend.append('servicios', JSON.stringify(serviciosValidos));

      imagenesFiles.forEach((imagen) => {
        formDataToSend.append('imagenes[]', imagen);
      });

      const response = await apiService.modificarPropiedad(formData.id, formDataToSend);
      
      if (response.success) {
        toast.success('¡Propiedad actualizada con éxito!');
        setTimeout(() => {
          navigate('/admin/propiedades');
        }, 1500);
      } else {
        toast.error(response.message || 'Error al actualizar la propiedad');
      }
    } catch (error) {
      console.error('Error completo:', error);
      
      let mensajeError = 'Error al conectar con el servidor';
      if (error.message) {
        if (error.message.includes('Failed to fetch')) {
          mensajeError = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else if (error.message.includes('JSON')) {
          mensajeError = 'Error en la respuesta del servidor. Intenta nuevamente.';
        } else {
          mensajeError = error.message;
        }
      }
      
      toast.error(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const getErrorClass = (campo) => {
    return erroresValidacion[campo] ? 'publicar-input-error-unique' : '';
  };

  if (cargandoDatos) {
    return (
      <Sidebar>
        <div className="publicar-loading-unique">
          <div className="publicar-spinner-unique"></div>
          <p className="publicar-loading-text-unique">Cargando datos de la propiedad...</p>
        </div>
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="publicar-page-unique">
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
        
        <div className="publicar-header-unique">
          <div className="publicar-header-content-unique">
            <h1 className="publicar-title-unique">Editar Propiedad</h1>
            <p className="publicar-subtitle-unique">
              Modificando: <strong>{formData.codigo}</strong> - {formData.titulo}
            </p>
          </div>
        </div>

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
                  className={`publicar-input-unique ${getErrorClass('codigo')}`}
                  readOnly
                />
                <small className="publicar-ayuda-unique">El código no se puede modificar</small>
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">
                  Título <span className="publicar-required-unique">*</span>
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Campo Santa Irene - 500 hectáreas"
                  className={`publicar-input-unique ${getErrorClass('titulo')}`}
                />
                {erroresValidacion.titulo && (
                  <small className="publicar-error-mensaje-unique">{erroresValidacion.titulo}</small>
                )}
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">
                  Tipo de Operación <span className="publicar-required-unique">*</span>
                </label>
                <select 
                  name="alquilerventa" 
                  value={formData.alquilerventa} 
                  onChange={handleChange} 
                  className={`publicar-select-unique ${getErrorClass('alquilerventa')}`}
                >
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                  <option value="alquiler_venta">Alquiler con opción a venta</option>
                </select>
                {erroresValidacion.alquilerventa && (
                  <small className="publicar-error-mensaje-unique">{erroresValidacion.alquilerventa}</small>
                )}
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">
                  Tipo de Campo <span className="publicar-required-unique">*</span>
                </label>
                <select 
                  name="campos_idtipocampos"
                  value={formData.campos_idtipocampos} 
                  onChange={handleChange} 
                  className={`publicar-select-unique ${getErrorClass('campos_idtipocampos')}`}
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposCampos.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                {erroresValidacion.campos_idtipocampos && (
                  <small className="publicar-error-mensaje-unique">{erroresValidacion.campos_idtipocampos}</small>
                )}
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">
                  Superficie (ha) <span className="publicar-required-unique">*</span>
                </label>
                <input
                  type="number"
                  name="superficie"
                  value={formData.superficie}
                  onChange={handleChange}
                  placeholder="Ej: 500"
                  min="0.01"
                  step="0.01"
                  className={`publicar-input-unique ${getErrorClass('superficie')}`}
                />
                {erroresValidacion.superficie && (
                  <small className="publicar-error-mensaje-unique">{erroresValidacion.superficie}</small>
                )}
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

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">Destacado</label>
                <label className="publicar-checkbox-label">
                  <input
                    type="checkbox"
                    name="destacado"
                    checked={formData.destacado}
                    onChange={handleChange}
                  />
                  <span>Marcar como propiedad destacada</span>
                </label>
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
                <label className="publicar-label-unique">
                  Precio <span className="publicar-required-unique">*</span>
                </label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Ej: 250000"
                  min="0.01"
                  step="0.01"
                  className={`publicar-input-unique ${getErrorClass('precio')}`}
                />
                {erroresValidacion.precio && (
                  <small className="publicar-error-mensaje-unique">{erroresValidacion.precio}</small>
                )}
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">
                  Moneda <span className="publicar-required-unique">*</span>
                </label>
                <select name="moneda" value={formData.moneda} onChange={handleChange} className="publicar-select-unique">
                  <option value="USD">USD - Dólar</option>
                  <option value="ARS">ARS - Pesos Argentinos</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              <div className="publicar-campo-full-unique">
                <label className="publicar-label-unique">
                  Descripción <span className="publicar-required-unique">*</span>
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe la propiedad, sus características, accesos, etc."
                  rows="4"
                  className={`publicar-textarea-unique ${getErrorClass('descripcion')}`}
                />
                {erroresValidacion.descripcion && (
                  <small className="publicar-error-mensaje-unique">{erroresValidacion.descripcion}</small>
                )}
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: Ubicación */}
          <div className="publicar-seccion-unique">
            <div className="publicar-seccion-titulo-unique">
              <span className="publicar-seccion-numero-unique">3</span>
              <h2 className="publicar-seccion-heading-unique">Ubicación</h2>
            </div>
            
            <div className="publicar-grid-3columnas-unique">
              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">
                  Provincia <span className="publicar-required-unique">*</span>
                </label>
                <select 
                  name="provincia" 
                  value={formData.provincia} 
                  onChange={handleChange} 
                  className={`publicar-select-unique ${getErrorClass('provincia')}`}
                >
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
                {erroresValidacion.provincia && (
                  <small className="publicar-error-mensaje-unique">{erroresValidacion.provincia}</small>
                )}
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">
                  Localidad <span className="publicar-required-unique">*</span>
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Ej: San Carlos"
                  className={`publicar-input-unique ${getErrorClass('ciudad')}`}
                />
                {erroresValidacion.ciudad && (
                  <small className="publicar-error-mensaje-unique">{erroresValidacion.ciudad}</small>
                )}
              </div>

              <div className="publicar-campo-unique">
                <label className="publicar-label-unique">
                  Zona<span className="publicar-required-unique">*</span>
                </label>
                <input
                  type="text"
                  name="zona"
                  value={formData.zona}
                  onChange={handleChange}
                  placeholder="Ej: La Ballenera"
                  className={`publicar-input-unique ${getErrorClass('zona')}`}
                />
                {erroresValidacion.zona && (
                  <small className="publicar-error-mensaje-unique">{erroresValidacion.zona}</small>
                )}
              </div>
            </div>

            <div className="publicar-fila-mapa-unique">
              <div className="publicar-coordenadas-columna-unique">
                <div className="publicar-campo-unique">
                  <label className="publicar-label-unique">
                    Longitud
                    <span className="publicar-ayuda-unique">(Haz clic en el mapa)</span>
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    name="longitud"
                    value={formData.longitud}
                    onChange={handleChange}
                    placeholder="Ej: -57.833279"
                    className={`publicar-input-unique publicar-coordenada-input-unique ${getErrorClass('longitud')}`}
                    readOnly
                  />
                </div>

                <div className="publicar-campo-unique">
                  <label className="publicar-label-unique">
                    Latitud
                    <span className="publicar-ayuda-unique">(Haz clic en el mapa)</span>
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    name="latitud"
                    value={formData.latitud}
                    onChange={handleChange}
                    placeholder="Ej: -38.258451"
                    className={`publicar-input-unique publicar-coordenada-input-unique ${getErrorClass('latitud')}`}
                    readOnly
                  />
                </div>

                {formData.latitud && formData.longitud && (
                  <div className="publicar-coordenadas-preview-unique">
                    <span className="publicar-coordenadas-preview-label-unique">Ubicación seleccionada:</span>
                    <span className="publicar-coordenadas-preview-valor-unique">
                      {parseFloat(formData.latitud).toFixed(6)}, {parseFloat(formData.longitud).toFixed(6)}
                    </span>
                  </div>
                )}
              </div>

              <div className="publicar-mapa-columna-unique">
                <div className="publicar-mapa-container-unique">
                  <MapaUbicacion 
                    lat={formData.latitud ? parseFloat(formData.latitud) : -38.2743}
                    lng={formData.longitud ? parseFloat(formData.longitud) : -57.8395}
                    onCoordenadasChange={handleCoordenadasChange}
                  />
                </div>
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
              {servicios.map((servicio) => {
                const seleccionado = serviciosSeleccionados.includes(servicio.id);
                
                return (
                  <label key={servicio.id} className="publicar-servicio-item-unique">
                    <input
                      type="checkbox"
                      checked={seleccionado}
                      onChange={() => {
                        if (seleccionado) {
                          setServiciosSeleccionados(prev => 
                            prev.filter(id => id !== servicio.id)
                          );
                        } else {
                          setServiciosSeleccionados(prev => 
                            [...prev, servicio.id]
                          );
                        }
                      }}
                      className="publicar-servicio-checkbox-unique"
                    />
                    <span className="publicar-servicio-checkmark-unique"></span>
                    <span className="publicar-servicio-nombre-unique">{servicio.nombre}</span>
                  </label>
                );
              })}
            </div>
            
            {serviciosSeleccionados.length > 0 && (
              <div className="publicar-servicios-seleccionados-unique">
                <span className="publicar-servicios-seleccionados-label-unique">
                  Servicios marcados:
                </span>
                <div className="publicar-servicios-seleccionados-lista-unique">
                  {servicios
                    .filter(s => serviciosSeleccionados.includes(s.id))
                    .map(s => (
                      <span key={s.id} className="publicar-servicio-seleccionado-item-unique">
                        {s.nombre}
                      </span>
                    ))}
                </div>
              </div>
            )}
            
            {servicios.length === 0 && (
              <p className="publicar-sin-servicios-unique">No hay servicios disponibles</p>
            )}
          </div>

          {/* SECCIÓN 5: Imágenes */}
          <div className="publicar-seccion-unique">
            <div className="publicar-seccion-titulo-unique">
              <span className="publicar-seccion-numero-unique">5</span>
              <h2 className="publicar-seccion-heading-unique">Imágenes</h2>
            </div>
            
            <div className="publicar-imagenes-section-unique">
              {/* Imágenes existentes */}
              {imagenesExistentes.length > 0 && (
                <div className="publicar-imagenes-existentes-unique">
                  <h4>Imágenes actuales ({imagenesExistentes.length})</h4>
                  <div className="publicar-preview-grid-unique">
                    {imagenesExistentes.map((img, index) => (
                      <div key={img.id} className="publicar-preview-item-unique">
                        <img 
                          src={img.url} 
                          alt={img.nombre} 
                          className="publicar-preview-img-unique"
                          onError={(e) => {
                            handleImagenError(img.id, img.url);
                            e.target.src = '/img/default-propiedad.jpg';
                          }}
                        />
                        <div className="publicar-preview-actions-unique">
                          <button
                            type="button"
                            onClick={() => eliminarImagenExistente(img.id, index)}
                            className="publicar-preview-btn-unique publicar-preview-btn-delete-unique"
                            title="Eliminar imagen"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subir nuevas imágenes */}
              <div className="publicar-upload-section-unique">
                <h4>Agregar nuevas imágenes</h4>
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
              </div>

              {/* Preview de nuevas imágenes */}
              {imagenesPreview.length > 0 && (
                <div className="publicar-preview-grid-unique">
                  {imagenesPreview.map((img, index) => (
                    <div key={index} className="publicar-preview-item-unique">
                      <img src={img} alt={`Preview ${index}`} className="publicar-preview-img-unique" />
                      <span className="publicar-preview-order-unique">{index + 1}</span>
                      <div className="publicar-preview-actions-unique">
                        <button
                          type="button"
                          onClick={() => eliminarImagenNueva(index)}
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
                  Guardando cambios...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
};

export default EditarPropiedad;