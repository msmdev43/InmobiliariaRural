import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Admin/Sidebar';
import apiService from '../../../services/api.service';
import { useToast, ToastContainer } from '../../../components/UI/Toast';
import MapaUbicacion from '../../../components/UI/MapaUbicacion';
import ENDPOINTS from '../../../config/endpoints';
import '../../../styles/pages/Admin/propiedades/PublicarPropiedad.css';
import 'leaflet/dist/leaflet.css';

const BASE_URL = ENDPOINTS.BASE_URL;
const DEFAULT_IMAGE = ENDPOINTS.ADMIN.DEFAULT_IMAGE;

// ==================== FUNCIONES DE COMPRESIÓN ====================

const comprimirImagen = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const esPNG = file.type === 'image/png';
    const reader = new FileReader();
    
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (esPNG) {
          ctx.clearRect(0, 0, width, height);
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        const mimeType = esPNG ? 'image/png' : 'image/jpeg';
        const quality = esPNG ? 0.9 : 0.8;
        
        canvas.toBlob(
          (blob) => {
            const extension = esPNG ? '.png' : '.jpg';
            const newFileName = file.name.replace(/\.[^.]+$/, extension);
            const compressedFile = new File([blob], newFileName, {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          mimeType,
          quality
        );
      };
      
      img.onerror = (err) => {
        console.error('Error loading image:', err);
        reject(err);
      };
    };
    
    reader.onerror = (err) => {
      console.error('Error reading file:', err);
      reject(err);
    };
  });
};

const procesarImagenes = async (files, onProgress) => {
  const MAX_SIZE_MB = 10;
  const imagenesComprimidas = [];
  
  console.log(`Iniciando compresión de ${files.length} imágenes`);
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Comprimiendo imagen ${i + 1}/${files.length}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
    
    const imagenComprimida = await comprimirImagen(file);
    
    const sizeMB = imagenComprimida.size / (1024 * 1024);
    console.log(`Imagen comprimida: ${sizeMB.toFixed(2)}MB (original: ${(file.size / 1024 / 1024).toFixed(2)}MB) - Reducción: ${((1 - sizeMB / (file.size / 1024 / 1024)) * 100).toFixed(1)}%`);
    
    if (sizeMB > MAX_SIZE_MB) {
      throw new Error(`La imagen "${file.name}" aún es muy grande (${sizeMB.toFixed(2)}MB) después de comprimir`);
    }
    
    imagenesComprimidas.push(imagenComprimida);
  }
  
  console.log(`Compresión completada. Total: ${imagenesComprimidas.length} imágenes`);
  return imagenesComprimidas;
};

// ==================== COMPONENTE PRINCIPAL ====================

const EditarPropiedad = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [comprimiendoImagenes, setComprimiendoImagenes] = useState(false);
  const [progresoCompresion, setProgresoCompresion] = useState({ actual: 0, total: 0 });
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

  const formatearPrecio = (precio, moneda) => {
    if (!precio && precio !== 0) return '';
    if (isNaN(precio)) return '';
    
    const formateado = new Intl.NumberFormat('es-AR').format(precio);
    
    switch (moneda) {
      case 'ARS': return `$ ${formateado}`;
      case 'USD': return `USD$ ${formateado}`;
      case 'EUR': return `€ ${formateado}`;
      default: return `${formateado}`;
    }
  };

  // Cargar datos de la propiedad
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargandoDatos(true);
        
        const [tiposResponse, serviciosResponse] = await Promise.all([
          apiService.getTiposCampos(),
          apiService.getServicios()
        ]);

        const tiposData = tiposResponse.data || [];
        const serviciosData = serviciosResponse.data || [];
        
        setTiposCampos(tiposData);
        setServicios(serviciosData);
        console.log('Servicios disponibles cargados:', serviciosData);

        const propiedadResponse = await apiService.getPropiedadDetalle(id);
        console.log('Respuesta completa:', propiedadResponse);
        
        if (propiedadResponse.success && propiedadResponse.data) {
          const prop = propiedadResponse.data;
          console.log('Datos de propiedad:', prop);
          console.log('Servicios de la propiedad:', prop.servicios);
          
          const latitud = prop.ubicacion?.latitud || '';
          const longitud = prop.ubicacion?.longitud || '';
          const ciudad = prop.ubicacion?.ciudad || '';
          const provincia = prop.ubicacion?.provincia || '';
          const tipoCampoId = prop.tipo_campo?.id || '';
          
          let serviciosIds = [];
          if (prop.servicios && Array.isArray(prop.servicios)) {
            serviciosIds = prop.servicios.map(s => {
              return s.id || s.idservicios;
            }).filter(id => id !== undefined);
          }
          
          console.log('Servicios IDs extraídos:', serviciosIds);
          
          let fechaFormateada = '';
          if (prop.fecha_publicacion) {
            fechaFormateada = prop.fecha_publicacion.split(' ')[0];
          } else if (prop.fecha) {
            fechaFormateada = prop.fecha.split(' ')[0];
          }
          
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
          
          setServiciosSeleccionados(serviciosIds);
          console.log('Servicios seleccionados seteados en estado:', serviciosIds);
          
          if (prop.imagenes && Array.isArray(prop.imagenes) && prop.imagenes.length > 0) {
            const imagenesOrdenadas = [...prop.imagenes].sort((a, b) => (a.orden || 0) - (b.orden || 0));
            
            const imagenesConUrlCompleta = imagenesOrdenadas.map(img => ({
                ...img,
                url: img.url.startsWith('http') 
                ? img.url 
                : `${BASE_URL}${img.url}`
            }));
            setImagenesExistentes(imagenesConUrlCompleta);
            console.log('Imágenes existentes ordenadas:', imagenesConUrlCompleta);
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
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (erroresValidacion[name]) {
      setErroresValidacion(prev => ({ ...prev, [name]: null }));
    }
    
    if (name === 'precio') {
      const numeros = value.replace(/[^\d]/g, '');
      const numero = numeros === '' ? 0 : parseFloat(numeros);
      
      setFormData(prev => ({
        ...prev,
        [name]: numero
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImagenes = async (e) => {
    const files = Array.from(e.target.files);
    
    console.log('Archivos seleccionados:', files.length);
    
    if (files.length === 0) return;
    
    if (imagenesFiles.length + files.length > 10) {
      toast.warning('Máximo 10 imágenes permitidas');
      return;
    }

    setComprimiendoImagenes(true);
    setProgresoCompresion({ actual: 0, total: files.length });
    
    toast.info(`Comprimiendo ${files.length} imagen(es)...`, 0);
    
    try {
      const imagenesComprimidas = await procesarImagenes(files, (actual, total) => {
        console.log(`Progreso: ${actual}/${total}`);
        setProgresoCompresion({ actual, total });
      });
      
      const previews = await Promise.all(
        imagenesComprimidas.map(file => URL.createObjectURL(file))
      );
      
      setImagenesPreview(prev => [...prev, ...previews]);
      setImagenesFiles(prev => [...prev, ...imagenesComprimidas]);
      
      const totalSizeMB = imagenesComprimidas.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);
      
      toast.success(`${imagenesComprimidas.length} ${imagenesComprimidas.length === 1 ? 'imagen' : 'imágenes'} comprimidas (${totalSizeMB.toFixed(1)}MB total)`, 3000);
      
    } catch (error) {
      console.error('Error comprimiendo imágenes:', error);
      toast.error(error.message || 'Error al comprimir imágenes');
      setImagenesPreview([]);
      setImagenesFiles([]);
    } finally {
      setComprimiendoImagenes(false);
      setProgresoCompresion({ actual: 0, total: 0 });
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

  const moverImagenExistente = (index, direccion) => {
    if (
      (direccion === 'up' && index === 0) ||
      (direccion === 'down' && index === imagenesExistentes.length - 1)
    ) {
      return;
    }

    const nuevoIndex = direccion === 'up' ? index - 1 : index + 1;
    
    const nuevasImagenes = [...imagenesExistentes];
    [nuevasImagenes[index], nuevasImagenes[nuevoIndex]] = [nuevasImagenes[nuevoIndex], nuevasImagenes[index]];

    setImagenesExistentes(nuevasImagenes);
  };

  const moverImagenNueva = (index, direccion) => {
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

  const handleImageLoadError = (e, imgId, url) => {
    handleImagenError(imgId, url);
    e.target.src = DEFAULT_IMAGE; 
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
      console.log('Enviando servicios:', serviciosValidos);

      const ordenImagenes = imagenesExistentes.map((img, idx) => ({
        id: img.id,
        orden: idx + 1
      }));
      formDataToSend.append('orden_imagenes', JSON.stringify(ordenImagenes));

      imagenesFiles.forEach((imagen) => {
        formDataToSend.append('imagenes[]', imagen);
      });

      const response = await apiService.modificarPropiedad(formData.id, formDataToSend);
      console.log('Respuesta modificar:', response);
      
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
                  placeholder="CAM-0001"
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
                  type="text"
                  name="precio"
                  value={formatearPrecio(formData.precio, formData.moneda)}
                  onChange={handleChange}
                  placeholder="Ej: 250000"
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
              {servicios && servicios.length > 0 ? (
                servicios.map((servicio) => {
                  const servicioId = Number(servicio.id);
                  const estaSeleccionado = serviciosSeleccionados.some(id => Number(id) === servicioId);
                  
                  return (
                    <label key={servicioId} className="publicar-servicio-item-unique">
                      <input
                        type="checkbox"
                        checked={estaSeleccionado}
                        onChange={() => {
                          if (estaSeleccionado) {
                            setServiciosSeleccionados(prev => 
                              prev.filter(id => Number(id) !== servicioId)
                            );
                          } else {
                            setServiciosSeleccionados(prev => 
                              [...prev, servicioId]
                            );
                          }
                        }}
                        className="publicar-servicio-checkbox-unique"
                      />
                      <span className="publicar-servicio-checkmark-unique"></span>
                      <span className="publicar-servicio-nombre-unique">{servicio.nombre}</span>
                    </label>
                  );
                })
              ) : (
                <p className="publicar-sin-servicios-unique">Cargando servicios...</p>
              )}
            </div>
            
            {serviciosSeleccionados.length > 0 && (
              <div className="publicar-servicios-seleccionados-unique">
                <span className="publicar-servicios-seleccionados-label-unique">
                  Servicios marcados:
                </span>
                <div className="publicar-servicios-seleccionados-lista-unique">
                  {servicios
                    .filter(s => serviciosSeleccionados.some(id => Number(id) === Number(s.id)))
                    .map(s => (
                      <span key={s.id} className="publicar-servicio-seleccionado-item-unique">
                        {s.nombre}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 5: Imágenes - CON COMPRESIÓN Y ORDENAMIENTO */}
          <div className="publicar-seccion-unique">
            <div className="publicar-seccion-titulo-unique">
              <span className="publicar-seccion-numero-unique">5</span>
              <h2 className="publicar-seccion-heading-unique">Imágenes</h2>
            </div>
            
            <div className="publicar-imagenes-section-unique">
              {/* Imágenes existentes con ordenamiento */}
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
                          onError={(e) => handleImageLoadError(e, img.id, img.url)}  
                        />
                        <span className="publicar-preview-order-unique">{index + 1}</span>
                        <div className="publicar-preview-actions-unique">
                          <button
                            type="button"
                            onClick={() => moverImagenExistente(index, 'up')}
                            disabled={index === 0}
                            className="publicar-preview-btn-unique publicar-preview-btn-up-unique"
                            title="Mover arriba"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moverImagenExistente(index, 'down')}
                            disabled={index === imagenesExistentes.length - 1}
                            className="publicar-preview-btn-unique publicar-preview-btn-down-unique"
                            title="Mover abajo"
                          >
                            ↓
                          </button>
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

              {/* Subir nuevas imágenes con compresión */}
              <div className="publicar-upload-section-unique">
                <h4>Agregar nuevas imágenes</h4>
                <input
                  type="file"
                  id="editar-imagenes-unique"
                  multiple
                  accept="image/*"
                  onChange={handleImagenes}
                  className="publicar-file-input-unique"
                />
                <label htmlFor="editar-imagenes-unique" className="publicar-upload-area-unique">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p className="publicar-upload-text-unique">Haz clic para subir imágenes</p>
                  <span className="publicar-upload-hint-unique">Máximo 10 imágenes (JPG, PNG)</span>
                </label>
              </div>

              {/* Indicador de compresión */}
              {comprimiendoImagenes && (
                <div className="publicar-compresion-indicador-unique">
                  <div className="publicar-spinner-small-unique"></div>
                  <span>
                    Comprimiendo imágenes... 
                    {progresoCompresion.total > 0 ? (
                      ` ${progresoCompresion.actual}/${progresoCompresion.total}`
                    ) : (
                      ' procesando...'
                    )}
                  </span>
                </div>
              )}

              {/* Preview de nuevas imágenes con ordenamiento */}
              {imagenesPreview.length > 0 && (
                <div>
                  <h4>Nuevas imágenes ({imagenesPreview.length})</h4>
                  <div className="publicar-preview-grid-unique">
                    {imagenesPreview.map((img, index) => (
                      <div key={index} className="publicar-preview-item-unique">
                        <img src={img} alt={`Preview ${index}`} className="publicar-preview-img-unique" />
                        <span className="publicar-preview-order-unique">{index + 1}</span>
                        <div className="publicar-preview-actions-unique">
                          <button
                            type="button"
                            onClick={() => moverImagenNueva(index, 'up')}
                            disabled={index === 0}
                            className="publicar-preview-btn-unique publicar-preview-btn-up-unique"
                            title="Mover arriba"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moverImagenNueva(index, 'down')}
                            disabled={index === imagenesFiles.length - 1}
                            className="publicar-preview-btn-unique publicar-preview-btn-down-unique"
                            title="Mover abajo"
                          >
                            ↓
                          </button>
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
              disabled={loading || comprimiendoImagenes}
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