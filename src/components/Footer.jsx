// C:\xampp\htdocs\InmobiliariaRural\src\components\Footer.jsx
import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { FaInstagram } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import apiService from '../services/api.service';
import "../styles/components/footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [tiposCampos, setTiposCampos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configuración de categorías (sin IDs fijos)
  const categoriesConfig = [
    { label: "Terrenos", tipo_campo_nombre: "terreno" },
    { label: "Chacras", tipo_campo_nombre: "chacra" },
    { label: "Campos", tipo_campo_nombre: "campo" },
    { label: "Estancias", tipo_campo_nombre: "estancia" },
  ];

  useEffect(() => {
    obtenerTiposCampos();
  }, []);

  const obtenerTiposCampos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTiposCampos();
      console.log('Footer - Tipos de campos:', response);
      
      if (response.success && response.data) {
        // Mapear categorías con IDs reales
        const categoriasConIds = categoriesConfig.map(cat => {
          const tipoEncontrado = response.data.find(
            tipo => tipo.nombre.toLowerCase() === cat.tipo_campo_nombre
          );
          return {
            ...cat,
            tipo_campo_id: tipoEncontrado ? tipoEncontrado.id : null
          };
        });
        setTiposCampos(categoriasConIds);
      } else {
        setTiposCampos(categoriesConfig.map(cat => ({ ...cat, tipo_campo_id: null })));
      }
    } catch (error) {
      console.error('Error obteniendo tipos de campos:', error);
      setTiposCampos(categoriesConfig.map(cat => ({ ...cat, tipo_campo_id: null })));
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    if (!category.tipo_campo_id) {
      console.warn(`No se encontró ID para: ${category.label}`);
      return;
    }
    
    console.log("Footer - Categoría seleccionada:", category.label, "ID:", category.tipo_campo_id);
    
    // Navegar a la página de propiedades con el filtro en la URL
    navigate(`/propiedades?tipo_campo=${category.tipo_campo_id}`);
    
    // Forzar scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    empresa: [
      { label: "Sobre nosotros", href: "#nosotros" },
      { label: "Servicios", href: "#servicios" },
      { label: "Contacto", href: "#contacto" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "#1877f2" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "#e4405f" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "#1da1f2" },
    { icon: Youtube, href: "https://youtube.com", label: "Youtube", color: "#ff0000" },
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
                    target="_blank"
                    rel="noopener noreferrer"
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
              {loading ? (
                // Mostrar skeletons mientras carga
                <>
                  <li className="footer-link-item">
                    <span className="footer-link-button loading">Cargando...</span>
                  </li>
                  <li className="footer-link-item">
                    <span className="footer-link-button loading">Cargando...</span>
                  </li>
                  <li className="footer-link-item">
                    <span className="footer-link-button loading">Cargando...</span>
                  </li>
                  <li className="footer-link-item">
                    <span className="footer-link-button loading">Cargando...</span>
                  </li>
                </>
              ) : (
                tiposCampos.map((category, index) => (
                  <li key={index} className="footer-link-item">
                    <button 
                      onClick={() => handleCategoryClick(category)}
                      className="footer-link-button"
                      disabled={!category.tipo_campo_id}
                      title={!category.tipo_campo_id ? "Categoría no disponible" : `Ver ${category.label}`}
                    >
                      {category.label}
                      {!category.tipo_campo_id && " (próximamente)"}
                    </button>
                  </li>
                ))
              )}
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