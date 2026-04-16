// C:\xampp\htdocs\InmobiliariaRural\src\config\api.config.js
const API_CONFIG = {
  // URLs base
  BASE_URL: 'https://gustavobarberini.com',
  
  // Endpoints de admin
  ADMIN: {
    LOGIN: '/BackInmobiliariaRural/admin/login.php',
    LOGOUT: '/BackInmobiliariaRural/admin/logout.php',
    DASHBOARD: '/BackInmobiliariaRural/admin/dashboard.php',
    CHECK_SESSION: '/BackInmobiliariaRural/admin/check_session.php',
    ESTADISTICAS: '/BackInmobiliariaRural/admin/estadisticasDashboard.php',
     DEFAULT_IMAGE: '/BackInmobiliariaRural/admin/default.png',
  },
  
  // Endpoints de consultas
  CONSULTAS: {
    CREAR: '/BackInmobiliariaRural/consultas/crearConsulta.php',
    LISTAR: '/BackInmobiliariaRural/consultas/listarConsultas.php',
    ELIMINAR: '/BackInmobiliariaRural/consultas/eliminarConsulta.php',
    ULTIMAS: '/BackInmobiliariaRural/consultas/ultimasConsultas.php',
  },
  
  // Endpoints de propiedades
  PROPIEDADES: {
    LISTAR: '/BackInmobiliariaRural/propiedades/listarPropiedades.php', // Admin
    LISTAR_PUBLIC: '/BackInmobiliariaRural/propiedades/listarPropiedadesPublic.php', // Público
    CREAR: '/BackInmobiliariaRural/propiedades/crearPropiedad.php',
    MODIFICAR: '/BackInmobiliariaRural/propiedades/modificarPropiedad.php',
    ELIMINAR: '/BackInmobiliariaRural/propiedades/eliminarPropiedad.php',
    DETALLE: '/BackInmobiliariaRural/propiedades/obtenerPropiedadDetalle.php',
    ESTADISTICAS: '/BackInmobiliariaRural/propiedades/estadisticas/obtenerEstadisticas.php',
    DESTACADAS: '/BackInmobiliariaRural/propiedades/propiedadesDestacadas.php',
    ELIMINAR_IMAGEN: '/BackInmobiliariaRural/propiedades/imagenes/eliminarImagenes.php',
    ULTIMAS: '/BackInmobiliariaRural/propiedades/ultimasPropiedades.php',
    CONTAR_POR_TIPO_CAMPO: '/BackInmobiliariaRural/propiedades/contarPorTipoCampo.php', // Nuevo endpoint
  },
  
  // Endpoints de servicios
  SERVICIOS: {
    LISTAR: '/BackInmobiliariaRural/servicios/listarServicios.php',
    CREAR: '/BackInmobiliariaRural/servicios/crearServicio.php',
    MODIFICAR: '/BackInmobiliariaRural/servicios/modificarServicio.php',
    ELIMINAR: '/BackInmobiliariaRural/servicios/eliminarServicio.php',
  },
  
  // Endpoints de tipos de campos
  TIPOS_CAMPOS: {
    LISTAR: '/BackInmobiliariaRural/tipo_campos/listarTipos.php',
    CREAR: '/BackInmobiliariaRural/tipo_campos/crearTipo.php',
    MODIFICAR: '/BackInmobiliariaRural/tipo_campos/modificarTipo.php',
    ELIMINAR: '/BackInmobiliariaRural/tipo_campos/eliminarTipo.php',
  },
  
  // Endpoints de utilidades
  UTILS: {
    DOLAR: '/BackInmobiliariaRural/dolar/getDollarRate.php',
    NOTIFICACIONES: '/BackInmobiliariaRural/notificaciones/contarConsultas.php',
    WHATSAPP_DIRECTO: '/BackInmobiliariaRural/notificaciones/enviarWhatsAppDirecto.php',
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