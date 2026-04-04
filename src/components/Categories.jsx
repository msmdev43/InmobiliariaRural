// C:\xampp\htdocs\InmobiliariaRural\src\components\Categories.jsx
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiService from '../services/api.service';
import "../styles/components/categories.css";

// Configuración de categorías (sin IDs fijos)
const categoriesConfig = [
  {
    id: 1,
    title: "Terrenos",
    description: "Parcelas ideales para proyectos agrícolas o construcción",
    image: "/assets/cultivos1.jpeg",
    tipo_campo_nombre: "terreno"
  },
  {
    id: 2,
    title: "Chacras",
    description: "Pequeñas extensiones con potencial productivo",
    image: "/assets/ovejas.jpeg",
    tipo_campo_nombre: "chacra"
  },
  {
    id: 3,
    title: "Campos",
    description: "Grandes extensiones para ganadería y agricultura",
    image: "/assets/tractor.jpeg",
    tipo_campo_nombre: "campo"
  },
  {
    id: 4,
    title: "Estancias",
    description: "Propiedades rurales de alta categoría",
    image: "/assets/cultivos4.jpeg",
    tipo_campo_nombre: "estancia"
  },
];

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener tipos de campos desde el backend
      const tiposResponse = await apiService.getTiposCampos();
      console.log('Tipos de campos desde backend:', tiposResponse);
      
      // Mapear categorías con IDs reales
      if (tiposResponse.success && tiposResponse.data) {
        const categoriasConIds = categoriesConfig.map(cat => {
          const tipoEncontrado = tiposResponse.data.find(
            tipo => tipo.nombre.toLowerCase() === cat.tipo_campo_nombre
          );
          return {
            ...cat,
            tipo_campo_id: tipoEncontrado ? tipoEncontrado.id : null
          };
        });
        setCategories(categoriasConIds);
      } else {
        setCategories(categoriesConfig);
      }
      
      // Obtener conteos
      const conteosResponse = await apiService.getConteosPorTipoCampo();
      console.log('Conteos reales:', conteosResponse);
      
      if (conteosResponse.success && conteosResponse.data) {
        setCounts(conteosResponse.data);
      }
      
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      setCategories(categoriesConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    if (!category.tipo_campo_id) {
      console.warn(`No se encontró ID para: ${category.title}`);
      return;
    }
    
    console.log("Categoría seleccionada:", category.title, "ID:", category.tipo_campo_id);
    
    // Navegar a la página de propiedades con el filtro en la URL
    navigate(`/propiedades?tipo_campo=${category.tipo_campo_id}`);
    
    // Forzar scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCount = (category) => {
    if (loading) return "...";
    
    const nombreCapitalized = category.tipo_campo_nombre.charAt(0).toUpperCase() + 
                              category.tipo_campo_nombre.slice(1);
    
    const count = counts[nombreCapitalized] || 
                  counts[category.tipo_campo_nombre] || 
                  0;
    
    return count;
  };

  if (loading) {
    return (
      <section id="categorias" className="categories-section">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Explora</p>
            <h2 className="section-title">Tipos de propiedades</h2>
            <p className="section-description">
              Encuentre la fracción más apropiada para su proyecto.
            </p>
          </div>
          <div className="categories-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="category-card loading">
                <div className="category-content">
                  <p>Cargando...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categorias" className="categories-section">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Explora</p>
          <h2 className="section-title">Tipos de propiedades</h2>
          <p className="section-description">
            Encuentre la fracción más apropiada para su proyecto.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category)}
            >
              <img
                src={category.image}
                alt={category.title}
                className="category-image"
              />
              <div className="category-overlay" />
              <div className="category-content">
                <div className="category-info">
                  <div>
                    <h3 className="category-title">{category.title}</h3>
                    <p className="category-description">
                      {category.description}
                    </p>
                    <span className="category-count">
                      {getCount(category)} {getCount(category) === 1 ? 'propiedad' : 'propiedades'}
                    </span>
                  </div>
                  <div className="category-icon">
                    <ArrowRight className="icon-arrow" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}