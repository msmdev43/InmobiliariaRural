// C:\xampp\htdocs\InmobiliariaRural\src\components\Header.jsx
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import ContactModal from "./ContactModal";
import "../styles/components/header.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const navLinks = [
    { href: "#propiedades", label: "Propiedades" },
    { href: "#servicios", label: "Servicios" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#contacto", label: "Contacto" },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
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
                <a key={link.href} href={link.href} className="nav-link">
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
              <button className="contact-button" onClick={openContactModal}>
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
                href="tel:+5492291510406" 
                className="mobile-nav-link"
                onClick={handleNavClick}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Phone size={16} color="#006A4E" />
                (2291) 510-406
              </a>
              <button className="mobile-contact-button" onClick={openContactModal}>
                Contactar
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Modal de contacto */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
}