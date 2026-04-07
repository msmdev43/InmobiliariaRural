// C:\xampp\htdocs\InmobiliariaRural\src\services\api.service.js
import ENDPOINTS, { 
  ADMIN_ENDPOINTS,
  PROPIEDADES_ENDPOINTS,
  SERVICIOS_ENDPOINTS,
  TIPOS_CAMPOS_ENDPOINTS,
  CONSULTAS_ENDPOINTS,
  UTILS_ENDPOINTS
} from '../config/endpoints';
import API_CONFIG from '../config/api.config';

class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultOptions = API_CONFIG.DEFAULT_OPTIONS;
    this.endpoints = ENDPOINTS;
  }

  async request(endpoint, options = {}) {
    try {
      console.log('Request to:', endpoint); // Debug
      
      const response = await fetch(endpoint, {
        ...this.defaultOptions,
        ...options,
        headers: {
          ...this.defaultOptions.headers,
          ...options.headers
        }
      });

      // Verificar si la respuesta tiene contenido
      const text = await response.text();
      console.log('Response text:', text.substring(0, 200)); // Debug: primeros 200 caracteres
      
      // Si la respuesta está vacía
      if (!text || text.trim() === '') {
        if (response.status === 401) {
          window.dispatchEvent(new Event('unauthorized'));
        }
        return response.ok ? { success: true } : { success: false };
      }

      // Intentar parsear como JSON
      try {
        const data = JSON.parse(text);
        
        if (response.status === 401) {
          window.dispatchEvent(new Event('unauthorized'));
          return { success: false, message: data.message || 'No autorizado' };
        }
        
        return data;
      } catch {
        console.error('Error parsing JSON:', text.substring(0, 200));
        // Si no es JSON pero la petición fue exitosa, devolver éxito
        if (response.ok) {
          return { success: true };
        }
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async getEstadisticasDashboard() {
    try {
      const url = `${ADMIN_ENDPOINTS.ESTADISTICAS}`;
      
      const response = await this.request(url, {
        method: 'GET'
      });
      
      return response;
    } catch (error) {
      console.error('Error en getEstadisticasDashboard:', error);
      return {
        success: false,
        data: {
          totalPropiedades: 0,
          propiedadesDestacadas: 0,
          consultasHoy: 0
        },
        message: error.message || 'Error al cargar estadísticas'
      };
    }
  }
  // Método específico para crear propiedad (con FormData)
  async crearPropiedad(formData) {
    try {
      const response = await fetch(PROPIEDADES_ENDPOINTS.CREAR, {
        method: 'POST',
        credentials: 'include',
        body: formData // No incluir Content-Type, el navegador lo setea automáticamente
      });

      const text = await response.text();
      console.log('Crear propiedad response:', text.substring(0, 200));
      
      if (!text || text.trim() === '') {
        throw new Error('Respuesta vacía del servidor');
      }

      const data = JSON.parse(text);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error al crear propiedad');
      }
      
      return data;
    } catch (error) {
      console.error('Error crear propiedad:', error);
      throw error;
    }
  }

  async modificarPropiedad(id, formData) {
    // Para FormData, no usar JSON.stringify
    const response = await fetch(`${PROPIEDADES_ENDPOINTS.MODIFICAR}?id=${id}`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    return response.json();
  }

  async eliminarImagen(imagenId, propiedadId) {
    // Cambiar a POST en lugar de DELETE
    return this.request(PROPIEDADES_ENDPOINTS.ELIMINAR_IMAGEN, {
      method: 'POST', // Cambiado de DELETE a POST
      body: JSON.stringify({ 
        imagen_id: imagenId, 
        propiedad_id: propiedadId 
      })
    });
  }

  // Autenticación
  async adminLogin(credentials) {
    return this.request(ADMIN_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async adminLogout() {
    return this.request(ADMIN_ENDPOINTS.LOGOUT, {
      method: 'POST'
    });
  }

  async checkSession() {
    try {
      const response = await this.request(ADMIN_ENDPOINTS.CHECK_SESSION, {
        method: 'GET'
      });
      
      return response.authenticated === true;
    } catch (error) {
      console.debug('Error checking session:', error);
      return false;
    }
  }

  // Tipos de campos
  async getTiposCampos() {
    return this.request(TIPOS_CAMPOS_ENDPOINTS.LISTAR, {
      method: 'GET'
    });
  }

  async crearTipoCampo(data) {
    return this.request(TIPOS_CAMPOS_ENDPOINTS.CREAR, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async modificarTipoCampo(id, data) {
    return this.request(TIPOS_CAMPOS_ENDPOINTS.MODIFICAR, {
      method: 'PUT',
      body: JSON.stringify({ id, ...data })
    });
  }

  async eliminarTipoCampo(id) {
    return this.request(TIPOS_CAMPOS_ENDPOINTS.ELIMINAR, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
  }

  // Servicios
  async getServicios() {
    return this.request(SERVICIOS_ENDPOINTS.LISTAR, {
      method: 'GET'
    });
  }

  async crearServicio(data) {
    return this.request(SERVICIOS_ENDPOINTS.CREAR, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async modificarServicio(id, data) {
    return this.request(SERVICIOS_ENDPOINTS.MODIFICAR, {
      method: 'PUT',
      body: JSON.stringify({ id, ...data })
    });
  }

  async eliminarServicio(id) {
    return this.request(SERVICIOS_ENDPOINTS.ELIMINAR, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
  }

  // Propiedades
  async getPropiedades(params = '') {
    try {
      const url = params 
        ? `${PROPIEDADES_ENDPOINTS.LISTAR}?${params}`
        : PROPIEDADES_ENDPOINTS.LISTAR;
      
      const response = await this.request(url, {
        method: 'GET'
      });
      
      // Asegurar estructura de respuesta
      return {
        success: response.success || false,
        data: response.data || [],
        paginacion: response.paginacion || {
          pagina_actual: 1,
          por_pagina: 20,
          total_registros: 0,
          total_paginas: 0
        },
        filtros_disponibles: response.filtros_disponibles || {
          provincias: [],
          ciudades: [],
          tipos_operacion: ['alquiler', 'venta'],
          estados: ['disponible', 'vendido', 'alquilado', 'reservado']
        },
        message: response.message || ''
      };
    } catch (error) {
      console.error('Error en getPropiedades:', error);
      return {
        success: false,
        data: [],
        paginacion: {
          pagina_actual: 1,
          por_pagina: 20,
          total_registros: 0,
          total_paginas: 0
        },
        filtros_disponibles: {
          provincias: [],
          ciudades: [],
          tipos_operacion: ['alquiler', 'venta'],
          estados: ['disponible', 'vendido', 'alquilado', 'reservado']
        },
        message: error.message || 'Error al cargar propiedades'
      };
    }
  }

  async getPropiedadDetalle(id) {
    return this.request(`${PROPIEDADES_ENDPOINTS.DETALLE}?id=${id}`, {
      method: 'GET'
    });
  }

  async eliminarPropiedad(id, accion = 'eliminar') {
    try {
      const response = await this.request(PROPIEDADES_ENDPOINTS.ELIMINAR, {
        method: 'POST', // Usamos POST para enviar datos en el body
        body: JSON.stringify({ 
          id, 
          accion // 'eliminar', 'restaurar', 'eliminar_permanentemente'
        })
      });
      
      return response;
    } catch (error) {
      console.error('Error en eliminarPropiedad:', error);
      return {
        success: false,
        message: error.message || 'Error al eliminar propiedad'
      };
    }
  }

  async getEstadisticasPropiedades() {
    return this.request(PROPIEDADES_ENDPOINTS.ESTADISTICAS, {
      method: 'GET'
    });
  }

  async getPropiedadesDestacadas() {
    try {
      const response = await this.request(PROPIEDADES_ENDPOINTS.DESTACADAS, {
        method: 'GET'
      });
      
      // Asegurar que la respuesta tenga la estructura esperada
      return {
        success: response.success || false,
        data: response.data || [],
        total: response.total || 0,
        message: response.message || ''
      };
    } catch (error) {
      console.error('Error en getPropiedadesDestacadas:', error);
      // Devolver un objeto con formato consistente en caso de error
      return {
        success: false,
        data: [],
        total: 0,
        message: error.message || 'Error al cargar propiedades destacadas'
      };
    }
  }

  async getPropiedadesPublic(filtros = {}) {
    try {
      // Construir query string
      const params = new URLSearchParams();
      
      if (filtros.pagina) params.append('pagina', filtros.pagina);
      if (filtros.por_pagina) params.append('por_pagina', filtros.por_pagina);
      if (filtros.buscar) params.append('buscar', filtros.buscar);
      if (filtros.tipo_operacion) params.append('tipo_operacion', filtros.tipo_operacion);
      if (filtros.tipo_campo) params.append('tipo_campo', filtros.tipo_campo);
      if (filtros.provincia) params.append('provincia', filtros.provincia);
      if (filtros.ciudad) params.append('ciudad', filtros.ciudad);
      if (filtros.precio_min) params.append('precio_min', filtros.precio_min);
      if (filtros.precio_max) params.append('precio_max', filtros.precio_max);
      if (filtros.superficie_min) params.append('superficie_min', filtros.superficie_min);
      if (filtros.superficie_max) params.append('superficie_max', filtros.superficie_max);
      if (filtros.servicios && filtros.servicios.length) params.append('servicios', filtros.servicios.join(','));
      if (filtros.ordenar_por) params.append('ordenar_por', filtros.ordenar_por);
      
      const url = `${PROPIEDADES_ENDPOINTS.LISTAR_PUBLIC}${params.toString() ? '?' + params.toString() : ''}`;
      
      console.log('Fetching properties from:', url); // Debug
      
      const response = await this.request(url, {
        method: 'GET'
      });
      
      // Asegurar estructura de respuesta
      return {
        success: response.success || false,
        data: response.data || [],
        paginacion: response.paginacion || {
          pagina_actual: 1,
          por_pagina: 12,
          total_registros: 0,
          total_paginas: 0,
          tiene_siguiente: false,
          tiene_anterior: false
        },
        filtros_disponibles: response.filtros_disponibles || {
          provincias: [],
          ciudades: [],
          tipos_campos: [],
          tipos_operacion: ['alquiler', 'venta']
        },
        filtros_aplicados: response.filtros_aplicados || {},
        message: response.message || ''
      };
    } catch (error) {
      console.error('Error en getPropiedadesPublic:', error);
      return {
        success: false,
        data: [],
        paginacion: {
          pagina_actual: 1,
          por_pagina: 12,
          total_registros: 0,
          total_paginas: 0,
          tiene_siguiente: false,
          tiene_anterior: false
        },
        filtros_disponibles: {
          provincias: [],
          ciudades: [],
          tipos_campos: [],
          tipos_operacion: ['alquiler', 'venta']
        },
        message: error.message || 'Error al cargar propiedades'
      };
    }
  }

  // En api.service.js
  async getPropiedadPorCodigo(codigo) {
    try {
      const response = await this.request(`${PROPIEDADES_ENDPOINTS.DETALLE}?codigo=${encodeURIComponent(codigo)}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error en getPropiedadPorCodigo:', error);
      return {
        success: false,
        message: error.message || 'Error al cargar la propiedad'
      };
    }
  }

  async getUltimasPropiedades(limite = 10) {
    try {
      const params = new URLSearchParams();
      params.append('limite', limite);
      
      const url = `${PROPIEDADES_ENDPOINTS.ULTIMAS}?${params.toString()}`;
      
      const response = await this.request(url, {
        method: 'GET'
      });
      
      return response;
    } catch (error) {
      console.error('Error en getUltimasPropiedades:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Error al cargar últimas propiedades'
      };
    }
  }

  async getConteosPorTipoCampo() {
  try {
    const url = PROPIEDADES_ENDPOINTS.CONTAR_POR_TIPO_CAMPO;
    console.log('Obteniendo conteos desde:', url);
    
    const response = await this.request(url, {
      method: 'GET'
    });
    
    console.log('Respuesta conteos:', response);
    return response;
  } catch (error) {
    console.error('Error en getConteosPorTipoCampo:', error);
    return {
      success: false,
      data: {},
      message: error.message || 'Error al cargar conteos'
    };
  }
}

  async enviarConsulta(datos) {
    try {
      // Transformar datos para el formato que espera crearConsulta.php
      const payload = {
        nombrecompleto: datos.name,
        telefono: datos.phone,
        email: datos.email,
        mensaje: datos.message,
        tipo: 'contacto' // Tipo de consulta para el header
      };
      
      console.log('Enviando consulta:', payload);
      
      const response = await fetch(CONSULTAS_ENDPOINTS.CREAR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const text = await response.text();
      console.log('Respuesta crearConsulta:', text);
      
      if (!text || text.trim() === '') {
        throw new Error('Respuesta vacía del servidor');
      }
      
      const data = JSON.parse(text);
      return data;
    } catch (error) {
      console.error('Error enviando consulta:', error);
      throw error;
    }
  }

  async crearConsulta(data) {
    return this.request(CONSULTAS_ENDPOINTS.CREAR, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getConsultas(params = '') {
    const url = params 
      ? `${CONSULTAS_ENDPOINTS.LISTAR}?${params}`
      : CONSULTAS_ENDPOINTS.LISTAR;
      
    return this.request(url, {
      method: 'GET'
    });
  }

  async getUltimasConsultas(limite = 10, tipo = null) {
    const params = new URLSearchParams();
    params.append('limite', limite);
    if (tipo) params.append('tipo', tipo);
    
    const url = `${CONSULTAS_ENDPOINTS.ULTIMAS}?${params.toString()}`;
    
    return this.request(url, {
      method: 'GET'
    });
  }

  async eliminarConsulta(id) {
    return this.request(CONSULTAS_ENDPOINTS.ELIMINAR, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
  }

  // Utilidades
  async getDolarRate() {
    return this.request(UTILS_ENDPOINTS.DOLAR, {
      method: 'GET'
    });
  }

  async contarConsultasNoLeidas() {
    try {
      const response = await this.request(UTILS_ENDPOINTS.NOTIFICACIONES, {
        method: 'GET'
      });
      
      // Si la respuesta es exitosa y tiene total, devolver el número
      if (response.success && typeof response.total === 'number') {
        return response.total;
      }
      
      // Si la respuesta tiene data y es un array, devolver la longitud
      if (response.success && Array.isArray(response.data)) {
        return response.data.length;
      }
      
      // Si la respuesta tiene success pero no hay total, devolver 0
      if (response.success) {
        return 0;
      }
      
      // Si hay error, devolver 0
      console.error('Error en contarConsultasNoLeidas:', response.message);
      return 0;
    } catch (error) {
      console.error('Error en contarConsultasNoLeidas:', error);
      return 0;
    }
  }

  async enviarWhatsAppDirecto(consultaId) {
    return this.request(`${UTILS_ENDPOINTS.WHATSAPP_DIRECTO}`, {
      method: 'POST',
      body: JSON.stringify({ consulta_id: consultaId })
    });
  }
}

const apiService = new ApiService();
export default apiService;