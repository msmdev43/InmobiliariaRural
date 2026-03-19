import { Facebook, Instagram, Twitter, Youtube, Send } from "lucide-react";
import { FaInstagram } from 'react-icons/fa';
import "../styles/components/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    propiedades: [
      { label: "Terrenos", href: "#" },
      { label: "Chacras", href: "#" },
      { label: "Campos", href: "#" },
      { label: "Estancias", href: "#" },
    ],
    empresa: [
      //{ label: "Aviso legal", href: "#" },
      { label: "Sobre nosotros", href: "#nosotros" },
      { label: "Servicios", href: "#servicios" },
      { label: "Contacto", href: "#contacto" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "#1877f2" },
    { icon: Instagram, href: "#", label: "Instagram", color: "#e4405f" },
    { icon: Twitter, href: "#", label: "Twitter", color: "#1da1f2" },
    { icon: Youtube, href: "#", label: "Youtube", color: "#ff0000" },
  ];

  return (
    <footer className="footer-wrapper">
      {/* Efecto de luz decorativo */}
      <div className="footer-light-effect" />
      
      <div className="footer-container">
        {/* Grid principal */}
        <div className="footer-grid">
          {/* Sección de marca */}
          <div className="footer-brand">
            <div className="footer-logo-wrapper">
              <a href="/" className="footer-logo">
                Gustavo Barberini Inmobiliaria
              </a>
            </div>
            <p className="footer-description">
              Eficacia y transparencia en la búsqueda de propiedades rurales
            </p>
            
            {/* Badge de experiencia */}
            <span className="footer-badge">
              ✦ 20+ años de experiencia ✦
            </span>

            {/* Redes sociales */}
            <div className="footer-social-wrapper">
              <h4 className="footer-social-title">Síguenos</h4>
              <div className="footer-social-grid">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="footer-social-link"
                    style={{ '--social-color': social.color }}
                  >
                    <social.icon className="footer-social-icon" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sección Propiedades */}
          <div>
            <div className="footer-title-wrapper">
              <h4 className="footer-title">Propiedades</h4>
              <div className="footer-title-underline" />
            </div>
            <ul className="footer-links-list">
              {footerLinks.propiedades.map((link, index) => (
                <li key={index} className="footer-link-item">
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sección Empresa */}
          <div>
            <div className="footer-title-wrapper">
              <h4 className="footer-title">Empresa</h4>
              <div className="footer-title-underline" />
            </div>
            <ul className="footer-links-list">
              {footerLinks.empresa.map((link, index) => (
                <li key={index} className="footer-link-item">
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/*Logo MSM DevTeam*/}
          <div className="dev-card">
            <a href="https://www.instagram.com/msmdevteam/" target="_blank" rel="noopener noreferrer" className="dev-card-content">
              <img src="/assets/logomsmdevteam.png" alt="MSMDevTeam" className="dev-logo" />
              <div className="dev-info">
                <span className="dev-by">Desarrollo Digital por</span>
                <span className="dev-name">MSM Dev</span>
                <div className="social-hint">
                  <FaInstagram className="instagram-icon" />
                  <span>Síguenos</span>
                </div>
              </div>
            </a>
          </div>
          
          {/*Logo de CAIR*/}
          <div className="cair-card">
            <div className="cair-card-img">
              <img src="/assets/logocair.png" alt="CAIR" className="img-cair" />
            </div>
          </div>
        </div>

        <div className="footer-copyright-wrapper">
          <p className="footer-copyright">
            © {currentYear} Gustavo Barberini Inmobiliaria. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
