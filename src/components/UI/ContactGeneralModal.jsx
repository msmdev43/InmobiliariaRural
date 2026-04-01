// C:\xampp\htdocs\InmobiliariaRural\src\components\UI\ContactGeneralModal.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api.service';
import '../../styles/components/UI/contactGeneralModal.css';

const ContactGeneralModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombrecompleto: '',
    telefono: '',
    email: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Resetear formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nombrecompleto: '',
        telefono: '',
        email: '',
        mensaje: ''
      });
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombrecompleto.trim()) {
      setError('Por favor, ingresa tu nombre completo');
      return;
    }
    
    if (!formData.email.trim() && !formData.telefono.trim()) {
      setError('Debes proporcionar al menos un email o teléfono');
      return;
    }
    
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor, ingresa un email válido');
      return;
    }
    
    if (!formData.mensaje.trim()) {
      setError('Por favor, escribe tu mensaje');
      return;
    }
    
    setLoading(true);
    
    try {
      const data = {
        nombrecompleto: formData.nombrecompleto.trim(),
        telefono: formData.telefono.trim() || null,
        email: formData.email.trim() || null,
        mensaje: formData.mensaje.trim(),
        tipo: 'soporte' // Tipo de consulta general/soporte
      };
      
      const response = await apiService.crearConsulta(data);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        setError(response.message || 'Error al enviar la consulta');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  if (success) {
    return (
      <div className="contact-modal-overlay" onClick={onClose}>
        <div className="contact-modal-container" onClick={e => e.stopPropagation()}>
          <div className="contact-modal-success">
            <div className="contact-success-icon">✓</div>
            <h3 className="contact-success-title">¡Mensaje enviado!</h3>
            <p className="contact-success-message">
              Gracias por contactarnos.<br />
              Te responderemos a la brevedad.
            </p>
            <button className="contact-success-btn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
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
          
          {error && (
            <div className="contact-error-message">
              <span>⚠️</span> {error}
            </div>
          )}
          
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
                  Email
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
                  Teléfono
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
  );
};

export default ContactGeneralModal;