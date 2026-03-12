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
      const response = await fetch(endpoint, {
        ...this.defaultOptions,
        ...options,
        headers: {
          ...this.defaultOptions.headers,
          ...options.headers
        }
      });

      // Si la respuesta es 401 (No autorizado), podríamos manejar el logout automático
      if (response.status === 401) {
        // Podríamos emitir un evento para logout
        window.dispatchEvent(new Event('unauthorized'));
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
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
      // Podrías tener un endpoint específico para verificar sesión
      // o usar una petición simple al dashboard
      const response = await fetch(ADMIN_ENDPOINTS.DASHBOARD, {
        ...this.defaultOptions,
        method: 'GET'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

const apiService = new ApiService();
export default apiService;