import { 
  Award, 
  Star 
} from "lucide-react";
import "../styles/components/hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-background">
        <img
          src="/assets/tranquera.jpeg"
          alt="Vista aérea de campo rural"
          className="hero-image"
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        {/* Badge superior */}
        {/* <div className="hero-badge">
          <Award className="badge-icon" />
          <span>Dedicados a las propiedades rurales desde 2006</span>
          <Star className="badge-icon" style={{ marginLeft: '0.3rem' }} />
        </div> */}

        {/* Título principal */}
        <h1 className="hero-title">
          Encuentre el <span className="title-highlight">campo ideal</span> para su proyecto
        </h1>

        {/* Subtítulo */}
        <p className="hero-subtitle">
          Larga trayectoria y experiencia respaldan nuestras operaciones inmobiliarias con chacras y campos.
        </p>
      </div>
    </section>
  );
}
