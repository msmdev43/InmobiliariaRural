// C:\xampp\htdocs\InmobiliariaRural\src\components\Admin\UltimasPropiedades.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UltimasPropiedades = ({ propiedades, loading, onVerPropiedad }) => {
  const navigate = useNavigate();

  const handleVerPropiedad = (propiedadId) => {
    if (onVerPropiedad) {
      onVerPropiedad(propiedadId);
    } else {
      navigate(`/admin/propiedades/${propiedadId}`);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-card-unique">
        <div className="dashboard-card-header-unique">
          <h2 className="dashboard-card-title-unique">Últimas Propiedades</h2>
          <button 
            className="dashboard-card-link-unique"
            onClick={() => navigate('/admin/propiedades')}
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
            <p>Cargando propiedades...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card-unique">
      <div className="dashboard-card-header-unique">
        <h2 className="dashboard-card-title-unique">Últimas Propiedades</h2>
        <button 
          className="dashboard-card-link-unique"
          onClick={() => navigate('/admin/propiedades')}
        >
          Ver todas
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="dashboard-card-content-unique">
        {propiedades.length > 0 ? (
          <div className="dashboard-table-container-unique">
            <table className="dashboard-table-unique">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Zona</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {propiedades.map(prop => (
                  <tr key={prop.id} className="dashboard-table-row-unique">
                    <td>
                      <span className="dashboard-propiedad-codigo-unique">
                        {prop.codigo}
                      </span>
                    </td>
                    <td>
                      <div className="dashboard-propiedad-info-unique">
                        <span className="dashboard-propiedad-titulo-unique">{prop.titulo}</span>
                        {prop.destacado && (
                          <span className="dashboard-destacado-badge-unique"> ★</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="dashboard-propiedad-ubicacion-unique">
                        <span>{prop.zona}</span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="dashboard-table-btn-unique"
                        onClick={() => handleVerPropiedad(prop.id)}
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
            <p>No hay propiedades cargadas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UltimasPropiedades;