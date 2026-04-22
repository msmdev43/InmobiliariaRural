// C:\xampp\htdocs\InmobiliariaRural\src\components\Contact.jsx
import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import apiService from "../services/api.service";
import { useToast, ToastContainer } from "../components/UI/Toast";
import "../styles/components/contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    nombrecompleto: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // VALIDACIÓN BÁSICA
    // =========================
    if (!formData.nombrecompleto || !formData.email || !formData.telefono || !formData.mensaje) {
      toast.error("Completá todos los campos");
      return;
    }

    // =========================
    // 1. ABRIR MAIL (INMEDIATO)
    // =========================
    const destino = "gustavobarberini@hotmail.com";
    const asunto = "Consulta desde la web";

    const mensaje = `
  Nombre: ${formData.nombrecompleto}
  Email: ${formData.email}
  Teléfono: ${formData.telefono}

  Mensaje:
  ${formData.mensaje}
    `;

    const url = `mailto:${destino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;

    window.location.href = url;

    // =========================
    // 2. GUARDAR EN DB (BACKGROUND)
    // =========================
    const data = {
      nombrecompleto: formData.nombrecompleto.trim(),
      telefono: formData.telefono.trim(),
      email: formData.email.trim(),
      mensaje: formData.mensaje.trim(),
      tipo: 'soporte'
    };

    apiService.crearConsulta(data)
      .then(response => {
        if (!response.success) {
          console.warn("No se guardó la consulta:", response.message);
        }
      })
      .catch(err => {
        console.warn("Error guardando consulta:", err);
      });

    // =========================
    // 3. UX
    // =========================
    toast.success("Se abrió tu correo para enviar la consulta");

    setFormData({
      nombrecompleto: "",
      email: "",
      telefono: "",
      mensaje: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Dirección",
      content: "Calle 23 N° 1555, Miramar, Buenos Aires",
    },
    {
      icon: Phone,
      title: "Teléfono",
      content: "2291 510 406",
    },
    {
      icon: Mail,
      title: "Email",
      content: "gustavobarberini@hotmail.com",
    },
    {
      icon: Clock,
      title: "Horario",
      content: "Lun - Vie: 9:00 - 18:00",
    },
  ];

  return (
    <>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <section id="contacto" className="contact-section">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Contacto</p>
            <h2 className="section-title">Hablemos de tu propiedad</h2>
            <p className="section-description">
              Acerquenos su inquietud acerca de lo que busca u ofrece.
            </p>
          </div>

          <div className="contact-grid">
            <div className="form-card">
              <h3 className="form-title">Envianos un mensaje</h3>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombrecompleto" className="form-label">
                      Nombre Completo <span className="required">*</span>
                    </label>
                    <input
                      id="nombrecompleto"
                      name="nombrecompleto"
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.nombrecompleto}
                      onChange={handleChange}
                      required
                      className="form-input"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="telefono" className="form-label">
                    Teléfono <span className="required">*</span>
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="Tu teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mensaje" className="form-label">
                    Mensaje <span className="required">*</span>
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    placeholder="Contanos que estas buscando..."
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="form-textarea"
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Enviando...
                    </>
                  ) : (
                    "Enviar mensaje"
                  )}
                </button>
              </form>
            </div>

            <div className="contact-info">
              <h3 className="info-title">Información de contacto</h3>
              <div className="info-list">
                {contactInfo.map((item, index) => (
                  <div key={index} className="info-item">
                    <div className="info-icon-wrapper">
                      <item.icon className="info-icon" />
                    </div>
                    <div>
                      <p className="info-label">{item.title}</p>
                      <p className="info-content">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}