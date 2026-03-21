// C:\xampp\htdocs\InmobiliariaRural\src\components\ContactModal.jsx
import { useState } from "react";
import { 
  X, 
  Mail, 
  User, 
  Phone, 
  MessageSquare, 
  Send,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import apiService from "../services/api.service";
import "../styles/components/contactModal.css";

export default function ContactModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
    setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await apiService.enviarConsulta(formData);
      console.log('Respuesta:', response);
      
      if (response.success) {
        setSubmitStatus('success');
        resetForm();
        
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error enviando consulta:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal-container" onClick={e => e.stopPropagation()}>
        <div className="contact-modal-header">
          <h3 className="contact-modal-title">
            Contacto
          </h3>
          <button className="contact-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="contact-modal-body">
          {submitStatus === 'success' ? (
            <div className="success-message">
              <CheckCircle className="success-icon" size={48} />
              <h4>¡Mensaje enviado con éxito!</h4>
              <p>Gracias por contactarnos. Te responderemos a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label">
                  <User className="label-icon" />
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ingresá tu nombre"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail className="label-icon" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Ingresá tu email"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone className="label-icon" />
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Ingresá tu teléfono"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MessageSquare className="label-icon" />
                  Mensaje *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Escribí tu consulta aquí..."
                  className="form-textarea"
                />
              </div>

              {submitStatus === 'error' && (
                <div className="error-message">
                  <AlertCircle className="error-icon" size={16} />
                  <span>Error al enviar el mensaje. Por favor, intentá nuevamente.</span>
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar mensaje
                      <Send size={18} />
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}