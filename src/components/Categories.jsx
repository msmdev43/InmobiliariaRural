// C:\xampp\htdocs\InmobiliariaRural\src\components\Categories.jsx
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiService from '../services/api.service';
import "../styles/components/categories.css";

// Configuración de categorías
const categoriesConfig = [
  {
    id: 1,
    title: "Terrenos",
    description: "Parcelas ideales para proyectos agrícolas o construcción",
    image: "/assets/cultivos1.jpeg",
    tipo_campo_nombre: "terreno",
    hasSubtypes: false
  },
  {
    id: 2,
    title: "Chacras",
    description: "Pequeñas extensiones con potencial productivo",
    image: "/assets/ovejas.jpeg",
    tipo_campo_nombre: "chacra",
    hasSubtypes: false
  },
  {
    id: 3,
    title: "Campos",
    description: "Grandes extensiones para ganadería y agricultura",
    image: "/assets/tractor.jpeg",
    tipo_campo_nombre: "campo", // Tipo padre (opcional, para referencia)
    hasSubtypes: true,
    subtypes: [
      { nombre: "Agrícola", tipo_campo_nombre: "campo agricola" },
      { nombre: "Ganadero", tipo_campo_nombre: "campo ganadero" },
      { nombre: "Mixto", tipo_campo_nombre: "campo mixto" }
    ]
  },
  {
    id: 4,
    title: "Estancias",
    description: "Propiedades rurales de alta categoría",
    image: "/assets/cultivos4.jpeg",
    tipo_campo_nombre: "estancia",
    hasSubtypes: false
  },
];

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [tiposCamposMap, setTiposCamposMap] = useState({}); // Mapa de nombre -> id

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener tipos de campos desde el backend
      const tiposResponse = await apiService.getTiposCampos();
      console.log('=== TIPOS DE CAMPOS DESDE BACKEND ===');
      console.log('Respuesta completa:', tiposResponse);
      
      // Crear mapa de nombre -> id (normalizando nombres)
      const mapaTipos = {};
      if (tiposResponse.success && tiposResponse.data) {
        tiposResponse.data.forEach(tipo => {
          // Normalizar: convertir a minúsculas y eliminar espacios extras
          const nombreNormalizado = tipo.nombre.toLowerCase().trim();
          mapaTipos[nombreNormalizado] = tipo.id;
          console.log(`Mapeado: "${nombreNormalizado}" -> ID: ${tipo.id}`);
        });
      }
      console.log('Mapa de tipos completo:', mapaTipos);
      setTiposCamposMap(mapaTipos);
      
      // Mapear categorías con IDs reales
      const categoriasConIds = categoriesConfig.map(cat => {
        const tipoEncontradoId = mapaTipos[cat.tipo_campo_nombre.toLowerCase()];
        
        // Si tiene subtipos, buscar sus IDs también
        let subtypesWithIds = null;
        if (cat.hasSubtypes && cat.subtypes) {
          subtypesWithIds = cat.subtypes.map(sub => {
            const subId = mapaTipos[sub.tipo_campo_nombre.toLowerCase()];
            console.log(`Subtipo "${sub.nombre}" (${sub.tipo_campo_nombre}) -> ID: ${subId}`);
            return {
              ...sub,
              tipo_campo_id: subId || null
            };
          });
        }
        
        return {
          ...cat,
          tipo_campo_id: tipoEncontradoId || null,
          subtypes: subtypesWithIds
        };
      });
      
      console.log('=== CATEGORÍAS CON IDs ===');
      categoriasConIds.forEach(cat => {
        if (cat.hasSubtypes) {
          console.log(`${cat.title}:`, cat.subtypes);
        } else {
          console.log(`${cat.title}: ID ${cat.tipo_campo_id}`);
        }
      });
      
      setCategories(categoriasConIds);
      
      // Obtener conteos
      const conteosResponse = await apiService.getConteosPorTipoCampo();
      console.log('=== CONTEOS REALES ===');
      console.log('Conteos response:', conteosResponse);
      
      if (conteosResponse.success && conteosResponse.data) {
        setCounts(conteosResponse.data);
        console.log('Conteos cargados:', conteosResponse.data);
      }
      
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      setCategories(categoriesConfig);
    } finally {
      setLoading(false);
    }
  };

  // Click en categoría normal (Terrenos, Chacras, Estancias)
  const handleCategoryClick = (category) => {
    if (!category.tipo_campo_id) {
      console.warn(`No se encontró ID para: ${category.title}`);
      return;
    }
    
    console.log("Categoría seleccionada:", category.title, "ID:", category.tipo_campo_id);
    
    navigate(`/propiedades?tipo_campo=${category.tipo_campo_id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Click en subtipo de Campo (Agrícola, Ganadero, Mixto)
  const handleSubtypeClick = (subtype, parentCategory) => {
    console.log("=== CLICK EN SUBTIPO ===");
    console.log("Subtipo:", subtype);
    console.log("ID del subtipo:", subtype.tipo_campo_id);
    console.log("Nombre del subtipo:", subtype.tipo_campo_nombre);
    
    if (!subtype.tipo_campo_id) {
      console.error(`No se encontró ID para subtipo: ${subtype.nombre}`);
      console.log("Verificar que el nombre en la BD coincida exactamente con:", subtype.tipo_campo_nombre);
      return;
    }
    
    console.log(`Navegando a: /propiedades?tipo_campo=${subtype.tipo_campo_id}`);
    navigate(`/propiedades?tipo_campo=${subtype.tipo_campo_id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Obtener cantidad de propiedades para una categoría normal
  const getCount = (tipoCampoNombre) => {
    if (loading) return "...";
    
    // Buscar en counts por el nombre
    // Intentar diferentes variaciones del nombre
    const nombreOriginal = tipoCampoNombre;
    const nombreCapitalized = nombreOriginal.charAt(0).toUpperCase() + nombreOriginal.slice(1);
    
    let count = counts[nombreCapitalized] || counts[nombreOriginal] || 0;
    
    console.log(`getCount para "${tipoCampoNombre}": ${count} (buscado como ${nombreCapitalized} o ${nombreOriginal})`);
    
    return count;
  };

  // Obtener el total de propiedades para la categoría "Campos" (suma de sus subtipos)
  const getTotalCamposCount = () => {
    if (loading) return "...";
    
    const category = categories.find(cat => cat.title === "Campos");
    if (!category || !category.subtypes) return 0;
    
    let total = 0;
    category.subtypes.forEach(subtype => {
      const count = getCount(subtype.tipo_campo_nombre);
      total += count;
    });
    
    console.log(`Total de Campos (suma de subtipos): ${total}`);
    return total;
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
              className={`category-card ${category.hasSubtypes ? 'has-subtypes' : ''}`}
            >
              <img
                src={category.image}
                alt={category.title}
                className="category-image"
              />
              <div className="category-overlay" />
              <div className="category-content">
                <div className="category-info">
                  {/* Columna izquierda: texto */}
                  <div className="category-text">
                    <h3 className="category-title">{category.title}</h3>
                    <p className="category-description">{category.description}</p>
                    <span className="category-count">
                      {category.hasSubtypes 
                        ? `${getTotalCamposCount()} propiedades`
                        : `${getCount(category.tipo_campo_nombre)} ${getCount(category.tipo_campo_nombre) === 1 ? 'propiedad' : 'propiedades'}`
                      }
                    </span>
                  </div>
                  
                  {/* Columna derecha: flecha o botones de subtipos */}
                  {category.hasSubtypes ? (
                    <div className="subtypes-container">
                      {category.subtypes && category.subtypes.map((subtype, idx) => (
                        <button
                          key={idx}
                          className="subtype-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubtypeClick(subtype, category);
                          }}
                        >
                          <span className="subtype-name">{subtype.nombre}</span>
                          <span className="subtype-count">
                            {getCount(subtype.tipo_campo_nombre)}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="category-icon"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <ArrowRight className="icon-arrow" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}