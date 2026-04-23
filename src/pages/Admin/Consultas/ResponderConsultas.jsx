import { useEffect, useState } from "react";
import apiService from "../../services/api.service";
import '../../../styles/pages/Admin/Consultas.css';

export default function ResponderConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  // =========================
  // FETCH CONSULTAS
  // =========================
  useEffect(() => {
    fetchConsultas();
  }, []);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const res = await apiService.request("/consultas/listarConsultas.php");

      if (res.success) {
        setConsultas(res.data || []);
      }
    } catch (err) {
      console.error("Error cargando consultas:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SELECCIONAR CONSULTA
  // =========================
  const handleSelect = (consulta) => {
    setSelected(consulta);

    // autocompletar asunto opcional
    setAsunto(`Respuesta a tu consulta`);
    setMensaje("");
  };

  // =========================
  // ENVIAR RESPUESTA
  // =========================
  const handleSend = async () => {
    if (!selected) {
      alert("Seleccioná una consulta");
      return;
    }

    if (!asunto || !mensaje) {
      alert("Completá asunto y mensaje");
      return;
    }

    try {
      const res = await apiService.enviarEmailConsulta({
        nombre: selected.nombrecompleto,
        email: selected.email,
        mensaje: mensaje,
        asunto: asunto,
        consulta_id: selected.idconsultas
      });

      if (res.success) {
        alert("Respuesta enviada");
        setSelected(null);
        setAsunto("");
        setMensaje("");
      } else {
        alert("Error al enviar");
      }

    } catch (err) {
      console.error(err);
      alert("Error enviando email");
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="consultas-page-unique">

      {/* HEADER */}
      <div className="consultas-header-unique">
        <div>
          <h2 className="consultas-title-unique">Responder Consultas</h2>
          <p className="consultas-subtitle-unique">
            Seleccioná una consulta y respondé por email
          </p>
        </div>
      </div>

      {/* FORM RESPUESTA */}
      <div className="consultas-filtros-avanzados-unique">
        <div className="consultas-filtros-linea-unique">

          <div className="consultas-filtro-item-unique">
            <label className="consultas-filtro-label-unique">Asunto</label>
            <input
              className="consultas-filtro-input-unique"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="Asunto del email"
            />
          </div>

          <div className="consultas-filtro-item-unique" style={{ flex: 2 }}>
            <label className="consultas-filtro-label-unique">Mensaje</label>
            <textarea
              className="consultas-filtro-input-unique"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribí la respuesta..."
              rows={4}
            />
          </div>

          <div className="consultas-filtros-acciones-unique">
            <button
              className="consultas-filtros-aplicar-unique"
              onClick={handleSend}
            >
              Enviar respuesta
            </button>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="consultas-tabla-container-unique">
        {loading ? (
          <div className="consultas-loading-unique">Cargando...</div>
        ) : (
          <table className="consultas-tabla-unique">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Mensaje</th>
                <th>Tipo</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {consultas.map((c) => (
                <tr key={c.idconsultas}>
                  <td>
                    {c.codigo_propiedad || (
                      <span className="codigo-vacio">—</span>
                    )}
                  </td>

                  <td>{c.nombrecompleto}</td>

                  <td>{c.email}</td>

                  <td style={{ maxWidth: 250 }}>
                    {c.mensaje?.slice(0, 80)}...
                  </td>

                  <td>
                    <span className="consulta-tipo-badge">
                      {c.tipo}
                    </span>
                  </td>

                  <td>
                    <button
                      className="accion-btn accion-ver"
                      onClick={() => handleSelect(c)}
                    >
                      ✉️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SELECCIONADA */}
      {selected && (
        <div style={{ marginTop: "1rem", color: "#006A4E" }}>
          Respondiendo a: <strong>{selected.nombrecompleto}</strong> ({selected.email})
        </div>
      )}
    </div>
  );
}