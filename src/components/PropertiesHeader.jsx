// C:\xampp\htdocs\InmobiliariaRural\src\components\Header.jsx
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import "../styles/components/header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  // Función para manejar el scroll suave al hacer clic en un enlace
  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Cerrar menú móvil si está abierto
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            {/* Logo y nombre combinados */}
            <a href="/" className="header-logo-container">
              <img 
                src="/assets/logo.png" 
                alt="Gustavo Barberini Inmobiliaria" 
                className="header-logo"
              />
              <div className="logo-text">
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span className="logo-name">Gustavo</span>
                  <span className="logo-surname">Barberini</span>
                </div>
                <span className="logo-tagline">Inmobiliaria</span>
              </div>
            </a>

            {/* Navegación desktop */}
            <nav className="nav-desktop">
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className="nav-link"
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Acciones desktop */}
            <div className="header-actions">
              <a href="tel:+5492291510406" className="phone-link">
                <Phone className="phone-icon" />
                <span>(2291) 510-406</span>
              </a>
              <a 
                href="#contacto" 
                className="contact-button"
                onClick={(e) => handleSmoothScroll(e, '#contacto')}
              >
                Contactar
              </a>
            </div>

            {/* Botón menú móvil */}
            <button
              className="menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menú"
            >
              {isMenuOpen ? (
                <X className="menu-icon" />
              ) : (
                <Menu className="menu-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
              <a 
                href="tel:+5492291510406" 
                className="mobile-nav-link"
                onClick={handleNavClick}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Phone size={16} color="#006A4E" />
                (2291) 510-406
              </a>
              <a 
                href="#contacto" 
                className="mobile-contact-button"
                onClick={(e) => handleSmoothScroll(e, '#contacto')}
              >
                Contactar
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}