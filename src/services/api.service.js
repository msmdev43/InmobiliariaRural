// C:\xampp\htdocs\InmobiliariaRural\src\services\api.service.js
import ENDPOINTS, { ADMIN_ENDPOINTS } from '../config/endpoints';
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

      // Para peticiones que esperamos JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (response.status === 401) {
          window.dispatchEvent(new Event('unauthorized'));
          return { success: false, message: data.message || 'No autorizado' };
        }
        
        return data;
      }
      
      if (response.status === 401) {
        window.dispatchEvent(new Event('unauthorized'));
      }
      
      return { success: response.ok };
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Método específico para publicar propiedad (con FormData)
  async publicarPropiedad(formData) {
    try {
      // No incluir Content-Type, el navegador lo setea automáticamente con boundary
      const response = await fetch(ADMIN_ENDPOINTS.PUBLICAR_PROPIEDAD, {
        method: 'POST',
        credentials: 'include', // Importante para mantener la sesión
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error al publicar propiedad');
      }
      
      return data;
    } catch (error) {
      console.error('Error publicar propiedad:', error);
      throw error;
    }
  }

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
      const response = await fetch(`${this.baseUrl}/admin/check_session.php`, {
        ...this.defaultOptions,
        method: 'GET'
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      return data.authenticated === true;
    } catch (error) {
      console.debug('Error checking session:', error);
      return false;
    }
  }

  // Obtener tipos de campos
  async getTiposCampos() {
    return this.request(`${this.baseUrl}/api/tipos_campos.php`, {
      method: 'GET'
    });
  }

  // Obtener servicios
  async getServicios() {
    return this.request(`${this.baseUrl}/api/servicios.php`, {
      method: 'GET'
    });
  }
}

const apiService = new ApiService();
export default apiService;