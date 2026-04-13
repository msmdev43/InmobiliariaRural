// C:\xampp\htdocs\InmobiliariaRural\src\components\PropertyFooter.jsx
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { FaInstagram } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import apiService from '../services/api.service';
import "../styles/components/propertyFooter.css";

export default function PropertyFooter() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [tiposCampos, setTiposCampos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configuración de categorías
  const categoriesConfig = [
    { label: "Terrenos", tipo_campo_nombre: "terreno" },
    { label: "Chacras", tipo_campo_nombre: "chacra" },
    { label: "Campo Agrícola", tipo_campo_nombre: "campo agricola" },
    { label: "Campo Ganadero", tipo_campo_nombre: "campo ganadero" },
    { label: "Campo Mixto", tipo_campo_nombre: "campo mixto" },
    { label: "Estancias", tipo_campo_nombre: "estancia" },
  ];

  useEffect(() => {
    obtenerTiposCampos();
  }, []);

  const obtenerTiposCampos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTiposCampos();
      console.log('PropertyFooter - Tipos de campos:', response);
      
      if (response.success && response.data) {
        const mapaTipos = {};
        response.data.forEach(tipo => {
          const nombreNormalizado = tipo.nombre.toLowerCase().trim();
          mapaTipos[nombreNormalizado] = tipo.id;
        });
        
        const categoriasConIds = categoriesConfig.map(cat => {
          const nombreNormalizado = cat.tipo_campo_nombre.toLowerCase().trim();
          return {
            ...cat,
            tipo_campo_id: mapaTipos[nombreNormalizado] || null
          };
        });
        
        setTiposCampos(categoriasConIds);
        console.log('PropertyFooter - Categorías mapeadas:', categoriasConIds);
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
    
    console.log("PropertyFooter - Categoría seleccionada:", category.label, "ID:", category.tipo_campo_id);
    
    navigate(`/propiedades?tipo_campo=${category.tipo_campo_id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/gustavorbarberini", label: "Facebook", color: "#1877f2" },
    { icon: Instagram, href: "https://www.instagram.com/inmobiliariabarberini/", label: "Instagram", color: "#e4405f" },
  ];

  return (
    <footer className="property-footer-wrapper">
      <div className="property-footer-light-effect" />
      
      <div className="property-footer-container">
        <div className="property-footer-grid">
          {/* Sección de marca */}
          <div className="property-footer-brand">
            <div className="property-footer-logo-wrapper">
              <a href="/" className="property-footer-logo">
                Gustavo Barberini Inmobiliaria
              </a>
            </div>
            <p className="property-footer-description">
              Eficacia y transparencia en la búsqueda de propiedades rurales
            </p>
            
            <span className="property-footer-badge">
              ✦ 20+ años de experiencia ✦
            </span>

            <div className="property-footer-social-wrapper">
              <h4 className="property-footer-social-title">Síguenos</h4>
              <div className="property-footer-social-grid">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="property-footer-social-link"
                    style={{ '--social-color': social.color }}
                  >
                    <social.icon className="property-footer-social-icon" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sección Propiedades */}
          <div className="property-footer-properties">
            <div className="property-footer-title-wrapper">
              <h4 className="property-footer-title">Propiedades</h4>
              <div className="property-footer-title-underline" />
            </div>
            <ul className="property-footer-links-grid">
              {loading ? (
                <>
                  <li className="property-footer-link-item">
                    <span className="property-footer-link-button loading">Cargando...</span>
                  </li>
                  <li className="property-footer-link-item">
                    <span className="property-footer-link-button loading">Cargando...</span>
                  </li>
                  <li className="property-footer-link-item">
                    <span className="property-footer-link-button loading">Cargando...</span>
                  </li>
                </>
              ) : (
                tiposCampos.map((category, index) => (
                  <li key={index} className="property-footer-link-item">
                    <button 
                      onClick={() => handleCategoryClick(category)}
                      className="property-footer-link-button"
                      disabled={!category.tipo_campo_id}
                      title={!category.tipo_campo_id ? "Categoría no disponible" : `Ver ${category.label}`}
                    >
                      {category.label}
                      {/* ✅ ELIMINADO: Ya no muestra "(próximamente)" */}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/*Logo MSM DevTeam*/}
          <div className="property-footer-dev-card">
            <a href="https://www.instagram.com/msmdevteam/" target="_blank" rel="noopener noreferrer" className="property-footer-dev-card-content">
              <img src="/assets/logomsmdevteam.png" alt="MSMDevTeam" className="property-footer-dev-logo" />
              <div className="property-footer-dev-info">
                <span className="property-footer-dev-by">Desarrollo Digital por</span>
                <span className="property-footer-dev-name">MSM Dev</span>
                <div className="property-footer-social-hint">
                  <FaInstagram className="property-footer-instagram-icon" />
                  <span>Síguenos</span>
                </div>
              </div>
            </a>
          </div>
          
          {/*Logo de CAIR*/}
          <div className="property-footer-cair-card">
            <div className="property-footer-cair-card-img">
              <img src="/assets/logocair.png" alt="CAIR" className="property-footer-img-cair" />
            </div>
          </div>
        </div>

        <div className="property-footer-copyright-wrapper">
          <p className="property-footer-copyright">
            © {currentYear} Gustavo Barberini Inmobiliaria. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}