// C:\xampp\htdocs\InmobiliariaRural\src\config\api.config.js
const API_CONFIG = {
  // URLs base - Cambiamos a localhost para pruebas
  BASE_URL: 'http://localhost/BackInmobiliariaRural',
  
  // Endpoints de admin
  ADMIN: {
    LOGIN: '/admin/login.php',
    LOGOUT: '/admin/logout.php',
    DASHBOARD: '/admin/dashboard.php',
    PROPIEDADES: '/admin/propiedades.php',
    PUBLICAR_PROPIEDAD: '/admin/publicarPropiedad.php',
    CONFIGURACION: '/admin/configuracion.php'
  },
  
  // Endpoints públicos
  PUBLIC: {
    PROPIEDADES: '/api/propiedades.php',
    CATEGORIAS: '/api/categorias.php',
    CONTACTO: '/api/contacto.php'
  },
  
  // Configuración de fetch
  DEFAULT_OPTIONS: {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  }
};

export default API_CONFIG;