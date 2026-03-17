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
      } catch (parseError) {
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
  async getPropiedades() {
    return this.request(PROPIEDADES_ENDPOINTS.LISTAR, {
      method: 'GET'
    });
  }

  async getPropiedadDetalle(id) {
    return this.request(`${PROPIEDADES_ENDPOINTS.DETALLE}?id=${id}`, {
      method: 'GET'
    });
  }

  async modificarPropiedad(id, data) {
    return this.request(PROPIEDADES_ENDPOINTS.MODIFICAR, {
      method: 'PUT',
      body: JSON.stringify({ id, ...data })
    });
  }

  async eliminarPropiedad(id) {
    return this.request(PROPIEDADES_ENDPOINTS.ELIMINAR, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
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

  // Consultas
  async getConsultas() {
    return this.request(CONSULTAS_ENDPOINTS.LISTAR, {
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
    return this.request(UTILS_ENDPOINTS.NOTIFICACIONES, {
      method: 'GET'
    });
  }
}

const apiService = new ApiService();
export default apiService;