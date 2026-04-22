// C:\xampp\htdocs\InmobiliariaRural\src\components\PropertiesHeader.jsx
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import ContactPropHeaderModal from "./UI/ContactPropHeaderModal";
import "../styles/components/header.css";

export default function PropertiesHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Array vacío para mantener la estructura (no mostrará nada porque está vacío)
  const navLinks = [];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsContactModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
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

            {/* Navegación desktop - Se mantiene pero no muestra nada porque navLinks está vacío */}
            <nav className="nav-desktop">
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className="nav-link"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Acciones desktop */}
            <div className="header-actions">
              <a className="phone-link">
                <Phone className="phone-icon" />
                <span>(2291) 510-406</span>
              </a>
              <button 
                onClick={handleContactClick}
                className="contact-button"
              >
                Contactar
              </button>
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
              {/* Los enlaces de navegación (no se muestran porque está vacío) */}
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={handleNavClick}
                >
                  {link.label}
                </a>
              ))}
              <a
                className="mobile-nav-link"
                onClick={handleNavClick}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Phone size={16} color="#006A4E" />
                (2291) 510-406
              </a>
              <button 
                onClick={handleContactClick}
                className="mobile-contact-button"
              >
                Contactar
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Modal de contacto general */}
      <ContactPropHeaderModal 
        isOpen={isContactModalOpen} 
        onClose={closeContactModal} 
      />
    </>
  );
}