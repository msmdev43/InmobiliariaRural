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
import "../styles/components/services.css";

const servicesData = [
  {
    id: "tasaciones",
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
    id: "ventas",
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
    id: "arrendamientos",
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
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const openModal = (service) => {
    setSelectedService(service);
    const message = `Consulta sobre: ${service.title}\n\nMe interesa recibir información detallada sobre el servicio de ${service.title.toLowerCase()}. Por favor, contactarme a la brevedad.`;
    setFormData(prev => ({ ...prev, message }));
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
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

    try {
      // Aquí iría la lógica de envío a tu backend
      console.log("Formulario enviado:", {
        ...formData,
        serviceType: selectedService?.title
      });

      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert(`¡Gracias por tu consulta! Te contactaremos a la brevedad sobre ${selectedService?.title}.`);
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al enviar tu consulta. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
                    Nombre completo
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
                    Email
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
                    Teléfono
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
                    Consulta
                  </label>
                  <span className="service-type-badge">
                    {selectedService.title}
                  </span>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="form-textarea"
                  />
                </div>

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