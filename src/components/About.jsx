import { Check, Award, ArrowRight, Users, Calendar } from "lucide-react";
import "../styles/components/about.css";

const features = [
  "Más de 20 años de experiencia en el sector",
  "Conocimiento profundo del mercado rural",
  "Asesoramiento legal y fiscal especializado",
  "Acompañamiento en todo el proceso de compra",
  "Red de contactos con propietarios locales",
  "Tasaciones profesionales y transparentes",
];

export default function About() {
  return (
    <section id="nosotros" className="about-section">
      {/* Badge móvil */}
      <div className="container">
        <div className="experience-badge-small">
          <Award className="badge-icon" />
          <span>20+ años de experiencia</span>
        </div>
      </div>

      <div className="container">
        <div className="about-grid">
          {/* Columna de imagen */}
          <div className="image-container">
            <div className="image-decoration"></div>
            <div className="image-decoration-2"></div>
            <div className="image-wrapper">
              <img
                src="/assets/cultivos2.jpeg"
                alt="Equipo de Campo & Raíces"
                className="about-image"
              />
            </div>
            
            {/* Badge de experiencia desktop */}
            <div className="experience-badge">
              <span className="experience-years">20+</span>
              <span className="experience-text">Años de experiencia</span>
            </div>
          </div>

          {/* Columna de contenido */}
          <div className="content-wrapper">
            <span className="about-tag">Sobre nosotros</span>
            
            <h2 className="about-title">
              Tu socio de confianza en el mundo rural
              <div className="title-decoration"></div>
            </h2>
            
            <p className="about-description">
              En <span className="description-highlight">Gustavo Barberini Inmobiliaria</span> nos apasiona conectar a las personas con su
              lugar ideal en el campo. Entendemos que adquirir una propiedad
              rural es más que una inversión: es un cambio de vida, una conexión
              con la naturaleza y un legado para las futuras generaciones.
            </p>
            
            <p className="about-description">
              Nuestro equipo de expertos te acompañará en cada paso del camino,
              desde la búsqueda inicial hasta la firma de las escrituras,
              asegurando una experiencia <span className="description-highlight">transparente y satisfactoria</span>.
            </p>

            <ul className="features-grid">
              {features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="feature-icon-wrapper">
                    <Check className="feature-icon" />
                  </span>
                  <span className="feature-text">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Estadísticas */}
            <div className="ab-stats-container">
              <div className="ab-stat-item">
                <div className="ab-stat-number">250+</div>
                <div className="ab-stat-label">Propiedades vendidas</div>
              </div>
              <div className="ab-stat-item">
                <div className="ab-stat-number">500+</div>
                <div className="ab-stat-label">Clientes satisfechos</div>
              </div>
              <div className="ab-stat-item">
                <div className="ab-stat-number">20 Años</div>
                <div className="ab-stat-label">De trayectoria</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}