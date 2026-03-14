// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Configuracion\Configuracion.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Admin/Sidebar';
import '../../../styles/pages/Admin/Configuracion.css';

const Configuracion = () => {
  const navigate = useNavigate();

  const opcionesConfiguracion = [
    {
      id: 1,
      titulo: 'Tipos de Campos',
      descripcion: 'Gestioná los tipos de campos que pueden tener las propiedades',
      icono: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      ruta: '/admin/configuracion/tipos-campos',
      color: '#006A4E'
    },
    {
      id: 2,
      titulo: 'Servicios',
      descripcion: 'Gestioná los servicios disponibles en las propiedades',
      icono: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      ),
      ruta: '/admin/configuracion/servicios',
      color: '#006A4E'
    }
  ];

  return (
    <Sidebar>
      <div className="configuracion-page-unique">
        <div className="configuracion-header-unique">
          <h1 className="configuracion-title-unique">Configuración</h1>
          <p className="configuracion-subtitle-unique">
            Seleccioná la opción que deseas configurar
          </p>
        </div>

        <div className="configuracion-grid-unique">
          {opcionesConfiguracion.map(opcion => (
            <div
              key={opcion.id}
              className="configuracion-card-unique"
              onClick={() => navigate(opcion.ruta)}
            >
              <div 
                className="configuracion-card-icon-unique"
                style={{ background: `${opcion.color}10` }}
              >
                {opcion.icono}
              </div>
              <div className="configuracion-card-content-unique">
                <h3 className="configuracion-card-title-unique">{opcion.titulo}</h3>
                <p className="configuracion-card-description-unique">{opcion.descripcion}</p>
              </div>
              <div className="configuracion-card-arrow-unique">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default Configuracion;