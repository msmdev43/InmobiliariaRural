// C:\xampp\htdocs\InmobiliariaRural\src\components\Services.jsx
import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const openModal = (service) => {
    setSelectedService(service);
    const mensaje = `Consulta sobre: ${service.title}\n\nMe interesa recibir información detallada sobre el servicio de ${service.title.toLowerCase()}. Por favor, contactarme a la brevedad.`;
    setFormData(prev => ({ ...prev, mensaje }));
    setIsModalOpen(true);
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.nombrecompleto.trim()) {
      errors.push("Nombre completo requerido");
    }
    
    if (!formData.email.trim()) {
      errors.push("Email requerido");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Email inválido");
    }
    
    if (!formData.telefono.trim()) {
      errors.push("Teléfono requerido");
    } else if (!/^[0-9+\-\s()]+$/.test(formData.telefono)) {
      errors.push("Formato de teléfono inválido");
    }
    
    if (!formData.mensaje.trim()) {
      errors.push("Mensaje requerido");
    } else if (formData.mensaje.trim().length < 10) {
      errors.push("El mensaje debe tener al menos 10 caracteres");
    }
    
    return errors;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
        validationErrors.forEach(error => toast.error(error));
        return;
    }
    
    // 1. ABRIR WHATSAPP AHORA MISMO (sin esperar)
    const telefono = "5492291510406"; // Tu número
    const mensajeWhatsApp = `Hola, me interesa ${selectedService.title}. Mi nombre es ${formData.nombrecompleto}. %0A%0A${formData.mensaje.substring(0, 200)}`;
    window.open(`https://wa.me/${telefono}?text=${mensajeWhatsApp}`, '_blank');
    
    // 2. Enviar consulta al backend en segundo plano
    setIsSubmitting(true);
    
    try {
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
        
        const response = await apiService.crearConsulta(data);
        
        setIsSubmitting(false);
        
        if (response.success) {
            toast.success("✅ Consulta guardada con éxito. Te contactaremos pronto.", {
                duration: 4000
            });
        } else {
            toast.warning("⚠️ Consulta guardada, pero hubo un pequeño error.", {
                duration: 4000
            });
        }
        
        // Cerrar el modal DESPUÉS de que el usuario vea el mensaje
        setTimeout(() => {
            closeModal();
        }, 3500);
        
    } catch (error) {
        console.error("Error:", error);
        setIsSubmitting(false);
        toast.error("❌ No se pudo guardar, pero ya abrimos WhatsApp.", {
            duration: 4000
        });
        
        setTimeout(() => {
            closeModal();
        }, 3500);
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