import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import "../styles/components/contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Aquí conectarás con tu backend PHP
      console.log("Form submitted:", formData);
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Resetear formulario
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      
      alert("Mensaje enviado correctamente");
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Error al enviar el mensaje");
    } finally {
      setIsSubmitting(false);
    }
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
                  <label htmlFor="name" className="form-label">
                    Nombre Completo
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Tu teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Contanos que estas buscando..."
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                />
              </div>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </div>

          <div className="contact-info">
            <h3 className="info-title">Informacion de contacto</h3>
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
  );
}