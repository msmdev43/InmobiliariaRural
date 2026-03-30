// C:\xampp\htdocs\InmobiliariaRural\src\components\Admin\UltimasConsultas.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UltimasConsultas = ({ consultas, loading, onVerConsulta }) => {
  const navigate = useNavigate();

  // Función para obtener el color del badge según el tipo
  const getTipoColor = (tipo) => {
    const colores = {
      propiedad: '#4CAF50',
      arrendamiento: '#2196F3',
      tasacion: '#FF9800',
      venta: '#9C27B0',
      soporte: '#F44336'
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

  const handleVerConsulta = (consultaId) => {
    if (onVerConsulta) {
      onVerConsulta(consultaId);
    } else {
      navigate(`/admin/consultas?consulta=${consultaId}`);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-card-unique">
        <div className="dashboard-card-header-unique">
          <h2 className="dashboard-card-title-unique">Últimas Consultas</h2>
          <button 
            className="dashboard-card-link-unique"
            onClick={() => navigate('/admin/consultas')}
          >
            Ver todas
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <div className="dashboard-card-content-unique">
          <div className="dashboard-loading-consultas-unique">
            <div className="dashboard-spinner-small-unique"></div>
            <p>Cargando consultas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card-unique">
      <div className="dashboard-card-header-unique">
        <h2 className="dashboard-card-title-unique">Últimas Consultas</h2>
        <button 
          className="dashboard-card-link-unique"
          onClick={() => navigate('/admin/consultas')}
        >
          Ver todas
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="dashboard-card-content-unique">
        {consultas.length > 0 ? (
          <div className="dashboard-table-container-unique">
            <table className="dashboard-table-unique">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {consultas.map(consulta => (
                  <tr key={consulta.id} className="dashboard-table-row-unique">
                    <td>
                      <div className="dashboard-contact-info-unique">
                        <span className="dashboard-contact-name-unique">{consulta.nombre}</span>
                        {consulta.email && (
                          <span className="dashboard-contact-email-unique">{consulta.email}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span 
                        className="dashboard-consulta-tipo-unique"
                        style={{ 
                          backgroundColor: `${consulta.tipo_color}15`,
                          color: consulta.tipo_color,
                          border: `1px solid ${consulta.tipo_color}30`
                        }}
                      >
                        {consulta.tipo_texto}
                      </span>
                    </td>
                    <td>
                      <div className="dashboard-consulta-mensaje-unique" title={consulta.mensaje}>
                        {consulta.mensaje_corto}
                      </div>
                    </td>
                    <td>
                      <div className="dashboard-consulta-fecha-unique">
                        <span className="dashboard-fecha-unique">{consulta.fecha_formateada}</span>
                        <span className="dashboard-tiempo-unique">{consulta.tiempo_transcurrido}</span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="dashboard-table-btn-unique"
                        onClick={() => handleVerConsulta(consulta.id)}
                        title="Ver detalle"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dashboard-empty-unique">
            <p>No hay consultas recientes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UltimasConsultas;