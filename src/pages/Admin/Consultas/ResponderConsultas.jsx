// C:\xampp\htdocs\InmobiliariaRural\src\pages\Admin\Consultas\ResponderConsultas.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../../components/Admin/Sidebar';
import apiService from '../../../services/api.service';
import { useToast, ToastContainer } from '../../../components/UI/Toast';
import '../../../styles/pages/Admin/Consultas.css';

export default function ResponderConsultas() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [selected, setSelected] = useState(null);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetchConsultas();
  }, []);

  const fetchConsultas = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.getConsultas('incluir_respondidas=true');

      if (res.success) {
        // Filtrar solo las que tienen email (necesario para responder)
        const conEmail = (res.data || []).filter(c => c.email);
        setConsultas(conEmail);
        
        if (conEmail.length === 0) {
          toast.info('No hay consultas con email para responder');
        }
      } else {
        toast.error('Error al cargar consultas');
        setConsultas([]);
      }
    } catch (err) {
      console.error('Error cargando consultas:', err);
      toast.error('Error al conectar con el servidor');
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleSelect = (consulta) => {
    if (consulta.respondida) {
      toast.info('Esta consulta ya fue respondida', 2000);
      return;
    }

    setSelected(consulta);
    setAsunto(`Re: Consulta - ${consulta.codigo_propiedad || 'Inmobiliaria Rural'}`);
    setMensaje(`Hola ${consulta.nombrecompleto},\n\nGracias por tu consulta.\n\n`);
  };

  const handleDeseleccionar = () => {
    setSelected(null);
    setAsunto("");
    setMensaje("");
  };

  const handleSend = async () => {
    if (!selected) {
      toast.warning('Seleccioná una consulta para responder');
      return;
    }

    if (!asunto.trim() || !mensaje.trim()) {
      toast.warning('Completá el asunto y el mensaje');
      return;
    }

    try {
      setEnviando(true);
      
      const res = await apiService.enviarEmailConsulta({
        nombre: selected.nombrecompleto,
        email: selected.email,
        asunto: asunto.trim(),
        mensaje: mensaje.trim(),
        consulta_id: selected.id || selected.idconsultas,
        propiedad: selected.codigo_propiedad || ""
      });

      if (res.success) {
        toast.success('✅ Respuesta enviada exitosamente');
        
        // Actualizar estado local
        setConsultas(prev =>
          prev.map(c =>
            (c.id === selected.id || c.idconsultas === selected.idconsultas)
              ? { ...c, respondida: 1 }
              : c
          )
        );

        // Limpiar selección
        setSelected(null);
        setAsunto("");
        setMensaje("");
      } else {
        toast.error(res.message || 'Error al enviar la respuesta');
      }
    } catch (err) {
      console.error('Error enviando respuesta:', err);
      toast.error('Error al conectar con el servidor');
    } finally {
      setEnviando(false);
    }
  };

  const handleVerEnConsultas = (consulta) => {
    navigate(`/admin/consultas?buscar=${encodeURIComponent(consulta.nombrecompleto || consulta.email)}`);
  };

  const renderEstado = (respondida) => {
    return respondida ? (
      <span className="consulta-tipo-badge" style={{ background: "#dcfce7", color: "#166534" }}>
        ✔ Respondida
      </span>
    ) : (
      <span className="consulta-tipo-badge" style={{ background: "#fef9c3", color: "#854d0e" }}>
        ⏳ Pendiente
      </span>
    );
  };

  return (
    <Sidebar>
      <div className="consultas-page-unique">
        <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
        
        {/* HEADER */}
        <div className="consultas-header-unique">
          <div className="consultas-header-content-unique">
            <h2 className="consultas-title-unique">Responder Consultas</h2>
            <p className="consultas-subtitle-unique">
              Total: <strong>{consultas.length}</strong> consultas • 
              Pendientes: <strong style={{ color: '#854d0e' }}>{consultas.filter(c => !c.respondida).length}</strong> • 
              Respondidas: <strong style={{ color: '#166534' }}>{consultas.filter(c => c.respondida).length}</strong>
            </p>
          </div>
          <div className="consultas-header-actions-unique">
            <button 
              onClick={fetchConsultas} 
              className="consultas-btn-refresh-unique"
              title="Actualizar"
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* INDICADOR DE SELECCIÓN */}
        {selected && (
          <div className="consultas-seleccion-info-unique">
            <div className="consultas-seleccion-content-unique">
              <span>📧 Respondiendo a:</span>
              <strong>{selected.nombrecompleto}</strong>
              <span className="consultas-seleccion-email-unique">({selected.email})</span>
              {selected.codigo_propiedad && (
                <span className="codigo-badge">{selected.codigo_propiedad}</span>
              )}
            </div>
            <button 
              className="consultas-seleccion-cancelar-unique"
              onClick={handleDeseleccionar}
            >
              ✕ Cancelar
            </button>
          </div>
        )}

        {/* FORMULARIO DE RESPUESTA */}
        <div className={`consultas-filtros-avanzados-unique ${!selected ? 'consultas-form-disabled-unique' : ''}`}>
          <div className="consultas-filtros-linea-unique">
            <div className="consultas-filtro-item-unique" style={{ flex: 1 }}>
              <label className="consultas-filtro-label-unique">
                Asunto <span className="consultas-required-unique">*</span>
              </label>
              <input
                className="consultas-filtro-input-unique"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                disabled={!selected}
                placeholder={!selected ? 'Seleccioná una consulta para responder' : 'Asunto del email'}
              />
            </div>

            <div className="consultas-filtro-item-unique" style={{ flex: 2 }}>
              <label className="consultas-filtro-label-unique">
                Mensaje <span className="consultas-required-unique">*</span>
              </label>
              <textarea
                className="consultas-filtro-input-unique"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows={5}
                disabled={!selected}
                placeholder={!selected ? 'Seleccioná una consulta para escribir el mensaje' : 'Escribí tu respuesta...'}
              />
            </div>

            <div className="consultas-filtros-acciones-unique">
              <button
                className="consultas-filtros-aplicar-unique"
                onClick={handleSend}
                disabled={!selected || enviando}
              >
                {enviando ? (
                  <>
                    <span className="consultas-spinner-small-unique"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Enviar respuesta
                  </>
                )}
              </button>
              {selected && (
                <button
                  className="consultas-filtros-limpiar-unique"
                  onClick={handleDeseleccionar}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Mensaje de ayuda cuando no hay selección */}
          {!selected && !loading && (
            <div className="consultas-form-help-unique">
              👆 Seleccioná una consulta de la tabla para comenzar a responder
            </div>
          )}
        </div>

        {/* TABLA DE CONSULTAS */}
        <div className="consultas-tabla-container-unique">
          {loading ? (
            <div className="consultas-loading-unique">
              <div className="consultas-spinner-unique"></div>
              <p>Cargando consultas...</p>
            </div>
          ) : consultas.length === 0 ? (
            <div className="consultas-empty-unique">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h3 className="consultas-empty-title-unique">No hay consultas para responder</h3>
              <p className="consultas-empty-text-unique">
                Todas las consultas tienen email, pero no se encontraron registros
              </p>
              <button className="consultas-empty-link-unique" onClick={fetchConsultas}>
                Reintentar
              </button>
            </div>
          ) : (
            <table className="consultas-tabla-unique">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Mensaje</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {consultas.map((c) => {
                  const consultaId = c.id || c.idconsultas;
                  const isSelected = selected && (selected.id === consultaId || selected.idconsultas === consultaId);
                  
                  return (
                    <tr 
                      key={consultaId} 
                      className={`
                        ${isSelected ? 'consultas-row-selected-unique' : ''} 
                        ${c.respondida ? 'consultas-row-respondida-unique' : ''}
                      `}
                    >
                      <td className="columna-codigo">
                        {c.codigo_propiedad ? (
                          <span className="codigo-badge">{c.codigo_propiedad}</span>
                        ) : (
                          <span className="codigo-vacio">—</span>
                        )}
                      </td>

                      <td className="columna-nombre">
                        <span className="nombre-completo">{c.nombrecompleto}</span>
                      </td>

                      <td className="columna-email">
                        {c.email ? (
                          <a href={`mailto:${c.email}`} className="email-link">
                            {c.email}
                          </a>
                        ) : (
                          <span className="email-vacio">—</span>
                        )}
                      </td>

                      <td className="columna-mensaje-unique">
                        <span className="mensaje-preview-unique">
                          {c.mensaje?.slice(0, 100)}{(c.mensaje?.length > 100) ? '...' : ''}
                        </span>
                      </td>

                      <td className="columna-tipo">
                        <span className="consulta-tipo-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                          {c.tipo || 'General'}
                        </span>
                      </td>

                      <td className="columna-estado">
                        {renderEstado(c.respondida)}
                      </td>

                      <td className="columna-acciones">
                        <div className="acciones-fila">
                          <button
                            className={`accion-btn accion-ver ${isSelected ? 'accion-btn-active-unique' : ''}`}
                            onClick={() => handleSelect(c)}
                            disabled={c.respondida}
                            title={c.respondida ? "Ya respondida" : "Responder"}
                          >
                            ✉️
                          </button>
                          <button
                            className="accion-btn accion-ver"
                            onClick={() => handleVerEnConsultas(c)}
                            title="Ver en Consultas"
                          >
                            🔍
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Sidebar>
  );
}