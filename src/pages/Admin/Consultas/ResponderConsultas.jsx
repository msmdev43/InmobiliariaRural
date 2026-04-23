import { useEffect, useState } from "react";
import apiService from '../../../services/api.service';
import '../../../styles/pages/Admin/Consultas.css';

export default function ResponderConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (consulta) => {
    if (consulta.respondida) return;

    setSelected(consulta);
    setAsunto("Respuesta a tu consulta");
    setMensaje("");
  };

  const handleSend = async () => {
    if (!selected) return alert("Seleccioná una consulta");

    if (!asunto || !mensaje) {
      return alert("Completá asunto y mensaje");
    }

    try {
      const res = await apiService.enviarEmailConsulta({
        nombre: selected.nombrecompleto,
        email: selected.email,
        asunto: asunto,
        mensaje: mensaje,
        consulta_id: selected.idconsultas,
        propiedad: selected.codigo_propiedad || ""
      });

      if (res.success) {
        alert("Respuesta enviada");

        // 🔥 actualizar estado local
        setConsultas(prev =>
          prev.map(c =>
            c.idconsultas === selected.idconsultas
              ? { ...c, respondida: 1 }
              : c
          )
        );

        setSelected(null);
        setAsunto("");
        setMensaje("");
      }

    } catch (err) {
      console.error(err);
      alert("Error enviando email");
    }
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
    <div className="consultas-page-unique">

      {/* HEADER */}
      <div className="consultas-header-unique">
        <div>
          <h2 className="consultas-title-unique">Responder Consultas</h2>
          <p className="consultas-subtitle-unique">
            Gestioná y respondé las consultas de clientes
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="consultas-filtros-avanzados-unique">
        <div className="consultas-filtros-linea-unique">

          <div className="consultas-filtro-item-unique">
            <label className="consultas-filtro-label-unique">Asunto</label>
            <input
              className="consultas-filtro-input-unique"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              disabled={!selected}
            />
          </div>

          <div className="consultas-filtro-item-unique" style={{ flex: 2 }}>
            <label className="consultas-filtro-label-unique">Mensaje</label>
            <textarea
              className="consultas-filtro-input-unique"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
              disabled={!selected}
            />
          </div>

          <div className="consultas-filtros-acciones-unique">
            <button
              className="consultas-filtros-aplicar-unique"
              onClick={handleSend}
              disabled={!selected}
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
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {consultas.map((c) => (
                <tr key={c.idconsultas}>
                  <td>{c.codigo_propiedad || "—"}</td>

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

                  <td>{renderEstado(c.respondida)}</td>

                  <td>
                    <button
                      className="accion-btn accion-ver"
                      onClick={() => handleSelect(c)}
                      disabled={c.respondida}
                      title={c.respondida ? "Ya respondida" : "Responder"}
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

      {selected && (
        <div style={{ marginTop: "1rem", color: "#006A4E" }}>
          Respondiendo a: <strong>{selected.nombrecompleto}</strong> ({selected.email})
        </div>
      )}
    </div>
  );
}