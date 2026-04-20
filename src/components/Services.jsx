// C:\xampp\htdocs\InmobiliariaRural\src\components\Services.jsx
import { useState } from "react";
import { 
  Home, 
  LandPlot, 
  Building2, 
  Check, 
  ArrowRight, 
  X, 
  Mail, 
  User, 
  Phone,
  MessageSquare 
} from "lucide-react";
import apiService from "../services/api.service";
import { useToast, ToastContainer } from "../components/UI/Toast";
import "../styles/components/services.css";

const servicesData = [
  {
    id: "tasacion",
    icon: Home,
    title: "Tasaciones",
    description: "Evaluación profesional de propiedades rurales con metodologías actualizadas y precios de mercado.",
    features: [
      "Tasación con peritos certificados",
      "Análisis comparativo de mercado",
      "Informe detallado y profesional",
      "Válido para entidades bancarias"
    ],
    color: "#006A4E"
  },
  {
    id: "venta",
    icon: LandPlot,
    title: "Ventas",
    description: "Asesoramiento integral para la compra-venta de campos, estancias y propiedades rurales.",
    features: [
      "Gestión de documentos legales",
      "Búsqueda de propiedades a medida",
      "Negociación profesional",
      "Acompañamiento en todo el proceso"
    ],
    color: "#006A4E"
  },
  {
    id: "arrendamiento",
    icon: Building2,
    title: "Arrendamientos",
    description: "Administración de alquileres rurales para campos agrícolas, ganaderos y mixtos.",
    features: [
      "Contratos personalizados",
      "Gestión de cobros",
      "Asesoramiento legal",
      "Supervisión de propiedades"
    ],
    color: "#006A4E"
  }
];

export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombrecompleto: "",
    email: "",
    telefono: "",
    mensaje: ""
  });
  const toast = useToast();

  const openModal = (service) => {
    setSelectedService(service);
    const mensaje = `Consulta sobre: ${service.title}\n\nMe interesa recibir información detallada sobre el servicio de ${service.title.toLowerCase()}. Por favor, contactarme a la brevedad.`;
    setFormData(prev => ({ ...prev, mensaje }));
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setFormData({
      nombrecompleto: "",
      email: "",
      telefono: "",
      mensaje: ""
    });
    document.body.style.overflow = 'unset';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validaciones básicas antes de enviar
    if (!formData.nombrecompleto.trim()) {
      toast.error("Por favor, ingresa tu nombre completo");
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      toast.error("El email es obligatorio");
      setIsSubmitting(false);
      return;
    }

    if (!formData.telefono.trim()) {
      toast.error("El teléfono es obligatorio");
      setIsSubmitting(false);
      return;
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Por favor, ingresa un email válido");
      setIsSubmitting(false);
      return;
    }

    if (!formData.mensaje.trim()) {
      toast.error("Por favor, escribe tu consulta");
      setIsSubmitting(false);
      return;
    }

    try {
      // Mapear el título del servicio al tipo correcto que espera el backend
      const tipoMapping = {
        'Tasaciones': 'tasacion',
        'Ventas': 'venta',
        'Arrendamientos': 'arrendamiento'
      };

      const tipo = tipoMapping[selectedService?.title] || 'soporte';

      const data = {
        nombrecompleto: formData.nombrecompleto.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        mensaje: formData.mensaje.trim(),
        tipo: tipo
      };

      console.log("Enviando consulta:", data);

      const response = await apiService.crearConsulta(data);
      
      if (response.success) {
        toast.success(`Consulta enviada. Redirigiendo a WhatsApp...`);

        setTimeout(() => {
          if (response.notificaciones?.whatsapp_url) {
            window.location.href = response.notificaciones.whatsapp_url;
          } else {
            closeModal();
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <section id="servicios" className="services-section">
        <div className="services-container">
          <div className="services-header">
            <span className="services-tag">Nuestros Servicios</span>
            <h2 className="services-title">Soluciones profesionales para tu campo</h2>
            <p className="services-description">
              Ofrecemos servicios especializados para propietarios e inversores del sector rural
            </p>
          </div>

          <div className="services-grid">
            {servicesData.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-icon-wrapper">
                  <service.icon className="service-icon" />
                </div>
                
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index} className="service-feature">
                      <Check className="feature-check" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className="service-button"
                  onClick={() => openModal(service)}
                >
                  Consultar
                  <ArrowRight className="button-icon" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedService && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                Consulta sobre {selectedService.title}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit} className="service-form">
                <div className="form-group">
                  <label className="form-label">
                    <User className="label-icon" />
                    Nombre completo <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombrecompleto"
                    value={formData.nombrecompleto}
                    onChange={handleChange}
                    required
                    placeholder="Ingresá tu nombre completo"
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail className="label-icon" />
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ingresá tu email"
                    className="form-input"
                    disabled={isSubmitting}
                  />
                  <small className="form-hint">Obligatorio si no ingresas teléfono</small>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone className="label-icon" />
                    Teléfono <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ingresá tu teléfono"
                    className="form-input"
                    disabled={isSubmitting}
                  />
                  <small className="form-hint">Obligatorio si no ingresas email</small>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <MessageSquare className="label-icon" />
                    Consulta <span className="required">*</span>
                  </label>
                  <span className="service-type-badge">
                    {selectedService.title}
                  </span>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="form-textarea"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-actions">
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
                      <>
                        Enviar consulta
                        <Mail size={18} />
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}