// C:\xampp\htdocs\InmobiliariaRural\src\config\api.config.js
const API_CONFIG = {
  // URLs base
  BASE_URL: 'http://localhost/BackInmobiliariaRural',
  
  // Endpoints de admin
  ADMIN: {
    LOGIN: '/admin/login.php',
    LOGOUT: '/admin/logout.php',
    DASHBOARD: '/admin/dashboard.php',
    CHECK_SESSION: '/admin/check_session.php',
  },
  
  // Endpoints de consultas
  CONSULTAS: {
    CREAR: '/consultas/crearConsulta.php',
    LISTAR: '/consultas/listarConsultas.php',
    ELIMINAR: '/consultas/eliminarConsulta.php',
  },
  
  // Endpoints de propiedades
  PROPIEDADES: {
    LISTAR: '/propiedades/listarPropiedades.php', // Admin
    LISTAR_PUBLIC: '/propiedades/listarPropiedadesPublic.php', // Público
    CREAR: '/propiedades/crearPropiedad.php',
    MODIFICAR: '/propiedades/modificarPropiedad.php',
    ELIMINAR: '/propiedades/eliminarPropiedad.php',
    DETALLE: '/propiedades/obtenerPropiedadDetalle.php',
    ESTADISTICAS: '/propiedades/estadisticas/obtenerEstadisticas.php',
    DESTACADAS: '/propiedades/propiedadesDestacadas.php',
    ELIMINAR_IMAGEN: '/propiedades/imagenes/eliminarImagenes.php',
  },
  
  // Endpoints de servicios
  SERVICIOS: {
    LISTAR: '/servicios/listarServicios.php',
    CREAR: '/servicios/crearServicio.php',
    MODIFICAR: '/servicios/modificarServicio.php',
    ELIMINAR: '/servicios/eliminarServicio.php',
  },
  
  // Endpoints de tipos de campos
  TIPOS_CAMPOS: {
    LISTAR: '/tipo_campos/listarTipos.php',
    CREAR: '/tipo_campos/crearTipo.php',
    MODIFICAR: '/tipo_campos/modificarTipo.php',
    ELIMINAR: '/tipo_campos/eliminarTipo.php',
  },
  
  // Endpoints de utilidades
  UTILS: {
    DOLAR: '/dolar/getDollarRate.php',
    NOTIFICACIONES: '/notificaciones/contarConsultas.php',
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