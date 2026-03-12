import ENDPOINTS, { ADMIN_ENDPOINTS } from '../config/endpoints';
import API_CONFIG from '../config/api.config';

class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.defaultOptions = API_CONFIG.DEFAULT_OPTIONS;
    this.endpoints = ENDPOINTS;
  }

  // Método genérico para peticiones
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Métodos específicos para admin
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

  // Verificar si la sesión está activa
  async checkSession() {
    try {
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

// Crear una instancia única
const apiService = new ApiService();
export default apiService;