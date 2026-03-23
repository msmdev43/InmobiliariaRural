import React, { useEffect } from 'react';
import '../../../styles/pages/Admin/VerConsulta.css';

const VerConsulta = ({ consulta, onClose }) => {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!consulta) return null;

  // Función para obtener el color del tipo
  const getTipoColor = (tipo) => {
    const colores = {
      propiedad: '#006A4E',
      arrendamiento: '#0369a1',
      tasacion: '#b85e00',
      venta: '#7e22ce',
      soporte: '#dc2626'
    };
    return colores[tipo] || '#64748b';
  };

  // Función para obtener el texto del tipo
  const getTipoTexto = (tipo) => {
    const textos = {
      propiedad: '🏠 Propiedad',
      arrendamiento: '📄 Arrendamiento',
      tasacion: '💰 Tasación',
      venta: '🤝 Venta',
      soporte: '🔧 Soporte'
    };
    return textos[tipo] || tipo;
  };

  // Función para formatear fecha en zona horaria de Argentina
  const formatearFechaArgentina = (fechaISO) => {
    const fecha = new Date(fechaISO);
    
    // Formato completo con día de la semana
    const fechaFormateada = fecha.toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // Capitalizar primera letra del día
    const fechaCapitalizada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    
    // Calcular hace cuánto tiempo fue
    const ahora = new Date();
    const fechaLocal = new Date(fecha.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    const diferenciaMs = ahora - fechaLocal;
    const diferenciaMinutos = Math.floor(diferenciaMs / 60000);
    const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
    const diferenciaDias = Math.floor(diferenciaHoras / 24);
    
    let haceTexto = '';
    if (diferenciaMinutos < 1) {
      haceTexto = 'Hace unos segundos';
    } else if (diferenciaMinutos < 60) {
      haceTexto = `Hace ${diferenciaMinutos} minuto${diferenciaMinutos !== 1 ? 's' : ''}`;
    } else if (diferenciaHoras < 24) {
      haceTexto = `Hace ${diferenciaHoras} hora${diferenciaHoras !== 1 ? 's' : ''}`;
    } else if (diferenciaDias < 7) {
      haceTexto = `Hace ${diferenciaDias} día${diferenciaDias !== 1 ? 's' : ''}`;
    } else {
      haceTexto = '';
    }
    
    // Formato para hora
    const horaFormateada = fecha.toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // Formato para fecha corta
    const fechaCorta = fecha.toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    return {
      fechaCompleta: fechaCapitalizada,
      hora: horaFormateada,
      fechaCorta: fechaCorta,
      haceTexto: haceTexto
    };
  };

  const fechaArgentina = formatearFechaArgentina(consulta.fecha);

  return (
    <div className="ver-consulta-overlay" onClick={onClose}>
      <div className="ver-consulta-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ver-consulta-header">
          <div className="ver-consulta-header-info">
            <h2 className="ver-consulta-titulo">
              Consulta de {consulta.nombrecompleto}
            </h2>
            <span 
              className="ver-consulta-tipo-badge"
              style={{ backgroundColor: getTipoColor(consulta.tipo) }}
            >
              {getTipoTexto(consulta.tipo)}
            </span>
          </div>
          <button className="ver-consulta-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="ver-consulta-body">
          {/* Datos del contacto */}
          <div className="ver-consulta-seccion">
            <h3 className="ver-consulta-seccion-titulo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Datos de contacto
            </h3>
            <div className="ver-consulta-grid">
              <div className="ver-consulta-campo">
                <label>Nombre completo</label>
                <span>{consulta.nombrecompleto}</span>
              </div>
              {consulta.email && (
                <div className="ver-consulta-campo">
                  <label>Email</label>
                  <a href={`mailto:${consulta.email}`} className="ver-consulta-link">
                    {consulta.email}
                  </a>
                </div>
              )}
              {consulta.telefono && (
                <div className="ver-consulta-campo">
                  <label>Teléfono</label>
                  <a href={`tel:${consulta.telefono}`} className="ver-consulta-link">
                    {consulta.telefono}
                  </a>
                </div>
              )}
              <div className="ver-consulta-campo">
                <label>Fecha de recepción</label>
                <div className="fecha-detalle">
                  <span className="fecha-completa">{fechaArgentina.fechaCompleta}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Propiedades asociadas */}
          {consulta.propiedades?.length > 0 && (
            <div className="ver-consulta-seccion">
              <h3 className="ver-consulta-seccion-titulo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Propiedades consultadas
              </h3>
              <div className="ver-consulta-propiedades">
                {consulta.propiedades.map(prop => (
                  <div key={prop.id} className="ver-consulta-propiedad">
                    <span className="ver-consulta-propiedad-codigo">{prop.codigo}</span>
                    <span className="ver-consulta-propiedad-titulo">{prop.titulo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje completo */}
          <div className="ver-consulta-seccion">
            <h3 className="ver-consulta-seccion-titulo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Mensaje
            </h3>
            <div className="ver-consulta-mensaje">
              {consulta.mensaje}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ver-consulta-footer">
          <button className="ver-consulta-btn-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerConsulta;