// C:\xampp\htdocs\InmobiliariaRural\src\components\ContactModal.jsx
import React, { useState } from 'react';
import apiService from '../../services/api.service';
import { useToast, ToastContainer } from './Toast';
import '../../styles/components/UI/contactModal.css';

const ContactPropModal = ({ propiedad, onClose }) => {
  const [formData, setFormData] = useState({
    nombrecompleto: '',
    telefono: '',
    email: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombrecompleto || !formData.email || !formData.telefono || !formData.mensaje) {
      toast.error("Completá todos los campos");
      return;
    }

    setLoading(true);

    try {
      const data = {
        nombrecompleto: formData.nombrecompleto.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        mensaje: formData.mensaje.trim(),
        tipo: 'propiedad',
        propiedad_id: propiedad.idpropiedades
      };

      // 1. Guardar en DB
      const response = await apiService.crearConsulta(data);

      if (!response.success) {
        throw new Error(response.message || "Error al guardar consulta");
      }

      // 2. Enviar email (controlado)
      try {
        await apiService.enviarEmailConsulta({
          nombre: data.nombrecompleto,
          email: data.email,
          telefono: data.telefono,
          mensaje: data.mensaje,
          propiedad: `${propiedad.codigo} - ${propiedad.titulo}`,
          consulta_id: response.id
        });
      } catch (err) {
        console.warn("Email falló:", err);
      }

      // 3. UX
      toast.success("Consulta enviada correctamente");

      // 4. WhatsApp (si corresponde)
      if (response.notificaciones?.whatsapp_url) {
        setTimeout(() => {
          window.location.href = response.notificaciones.whatsapp_url;
        }, 1000);
      } else {
        onClose?.();
      }

    } catch (error) {
      console.error(error);
      toast.error("Error al enviar la consulta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="contact-modal-overlay" onClick={onClose}>
        <div className="contact-modal-container" onClick={e => e.stopPropagation()}>
          <div className="contact-modal-header">
            <h3 className="contact-modal-title">Consultar propiedad</h3>
            <button className="contact-modal-close" onClick={onClose}>×</button>
          </div>
          
          <div className="contact-modal-body">
            <div className="contact-propiedad-info">
              <h4 className="contact-propiedad-titulo">{propiedad.titulo}</h4>
              <p className="contact-propiedad-detalle">
                Código: {propiedad.codigo} | {propiedad.ubicacion}
              </p>
              <p className="contact-propiedad-precio">
                {propiedad.moneda} {propiedad.precio_formateado}
              </p>
            </div>
            
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
                  {loading ? 'Enviando...' : 'Enviar consulta'}
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

export default ContactPropModal;