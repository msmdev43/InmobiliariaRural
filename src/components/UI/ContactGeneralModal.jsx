// C:\xampp\htdocs\InmobiliariaRural\src\components\UI\ContactGeneralModal.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api.service';
import { useToast, ToastContainer } from './Toast';
import '../../styles/components/UI/contactGeneralModal.css';

const ContactGeneralModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombrecompleto: '',
    telefono: '',
    email: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Resetear formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nombrecompleto: '',
        telefono: '',
        email: '',
        mensaje: ''
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombrecompleto.trim()) {
      toast.error('Por favor, ingresa tu nombre completo');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Por favor, ingresa tu email');
      return;
    }
    
    if (!formData.telefono.trim()) {
      toast.error('Por favor, ingresa tu teléfono');
      return;
    }
    
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Por favor, ingresa un email válido');
      return;
    }
    
    if (!formData.mensaje.trim()) {
      toast.error('Por favor, escribe tu mensaje');
      return;
    }
    
    setLoading(true);
    
    try {
      const data = {
        nombrecompleto: formData.nombrecompleto.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        mensaje: formData.mensaje.trim(),
        tipo: 'soporte'
      };
      
      const response = await apiService.crearConsulta(data);
      
      if (response.success) {
        toast.success('Consulta enviada. Redirigiendo a WhatsApp...');

        setTimeout(() => {
          if (response.notificaciones?.whatsapp_url) {
            window.location.href = response.notificaciones.whatsapp_url;
          } else {
            onClose();
          }
        }, 1500);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <>
      <div className="contact-modal-overlay" onClick={onClose}>
        <div className="contact-modal-container" onClick={e => e.stopPropagation()}>
          <div className="contact-modal-header">
            <h3 className="contact-modal-title">Contactanos</h3>
            <button className="contact-modal-close" onClick={onClose}>×</button>
          </div>
          
          <div className="contact-modal-body">
            <p className="contact-modal-description">
              ¿Tenés alguna consulta? Completá el formulario y te contactaremos a la brevedad.
            </p>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-group">
                <label className="contact-form-label">
                  Nombre completo <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="nombrecompleto"
                  value={formData.nombrecompleto}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  className="contact-form-input"
                  disabled={loading}
                />
              </div>
              
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="contact-form-input"
                    disabled={loading}
                  />
                </div>
                
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    Teléfono <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Tu teléfono"
                    className="contact-form-input"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="contact-form-group">
                <label className="contact-form-label">
                  Mensaje <span className="required">*</span>
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Escribe tu consulta..."
                  rows={4}
                  className="contact-form-textarea"
                  disabled={loading}
                />
              </div>
              
              <div className="contact-form-actions">
                <button type="button" className="contact-btn-cancel" onClick={onClose} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="contact-btn-submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </>
  );
};

export default ContactGeneralModal;