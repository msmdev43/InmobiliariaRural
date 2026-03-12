const API_CONFIG = {
  // URLs base
  BASE_URL: 'https://miramarinmobiliario.com.ar',
  
  // Endpoints de admin
  ADMIN: {
    LOGIN: '/admin/login.php',
    LOGOUT: '/admin/logout.php',
    DASHBOARD: '/admin/dashboard.php',
    // Puedes agregar más endpoints aquí
    PROPIEDADES: '/admin/propiedades.php',
    USUARIOS: '/admin/usuarios.php',
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