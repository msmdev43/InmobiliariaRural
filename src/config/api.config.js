// C:\xampp\htdocs\InmobiliariaRural\src\config\api.config.js
const API_CONFIG = {
  // URLs base
  BASE_URL: 'https://gustavobarberini.com',
  
  // Endpoints de admin
  ADMIN: {
    LOGIN: '/api/admin/login.php',
    LOGOUT: '/api/admin/logout.php',
    DASHBOARD: '/api/admin/dashboard.php',
    CHECK_SESSION: '/api/admin/check_session.php',
    ESTADISTICAS: '/api/admin/estadisticasDashboard.php',
     DEFAULT_IMAGE: '/api/admin/default.png',
  },
  
  // Endpoints de consultas
  CONSULTAS: {
    CREAR: '/api/consultas/crearConsulta.php',
    LISTAR: '/api/consultas/listarConsultas.php',
    ELIMINAR: '/api/consultas/eliminarConsulta.php',
    ULTIMAS: '/api/consultas/ultimasConsultas.php',
  },
  
  // Endpoints de propiedades
  PROPIEDADES: {
    LISTAR: '/api/propiedades/listarPropiedades.php', // Admin
    LISTAR_PUBLIC: '/api/propiedades/listarPropiedadesPublic.php', // Público
    CREAR: '/api/propiedades/crearPropiedad.php',
    MODIFICAR: '/api/propiedades/modificarPropiedad.php',
    ELIMINAR: '/api/propiedades/eliminarPropiedad.php',
    DETALLE: '/api/propiedades/obtenerPropiedadDetalle.php',
    ESTADISTICAS: '/api/propiedades/estadisticas/obtenerEstadisticas.php',
    DESTACADAS: '/api/propiedades/propiedadesDestacadas.php',
    ELIMINAR_IMAGEN: '/api/propiedades/imagenes/eliminarImagenes.php',
    ULTIMAS: '/api/propiedades/ultimasPropiedades.php',
    CONTAR_POR_TIPO_CAMPO: '/api/propiedades/contarPorTipoCampo.php', // Nuevo endpoint
  },
  
  // Endpoints de servicios
  SERVICIOS: {
    LISTAR: '/api/servicios/listarServicios.php',
    CREAR: '/api/servicios/crearServicio.php',
    MODIFICAR: '/api/servicios/modificarServicio.php',
    ELIMINAR: '/api/servicios/eliminarServicio.php',
  },
  
  // Endpoints de tipos de campos
  TIPOS_CAMPOS: {
    LISTAR: '/api/tipo_campos/listarTipos.php',
    CREAR: '/api/tipo_campos/crearTipo.php',
    MODIFICAR: '/api/tipo_campos/modificarTipo.php',
    ELIMINAR: '/api/tipo_campos/eliminarTipo.php',
  },
  
  // Endpoints de utilidades
  UTILS: {
    DOLAR: '/api/dolar/getDollarRate.php',
    NOTIFICACIONES: '/api/notificaciones/contarConsultas.php',
    WHATSAPP_DIRECTO: '/api/notificaciones/enviarWhatsAppDirecto.php',
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