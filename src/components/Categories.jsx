import { ArrowRight } from "lucide-react";
import "../styles/components/categories.css";

const categories = [
  {
    id: 1,
    title: "Terrenos",
    description: "Parcelas ideales para proyectos agricolas o construccion",
    count: 145,
    image: "/assets/cultivos1.jpeg",
  },
  {
    id: 2,
    title: "Chacras",
    description: "Pequenas extensiones con potencial productivo",
    count: 98,
    image: "/assets/ovejas.jpeg",
  },
  {
    id: 3,
    title: "Campos",
    description: "Grandes extensiones para ganaderia y agricultura",
    count: 76,
    image: "/assets/tractor.jpeg",
  },
  {
    id: 4,
    title: "Estancias",
    description: "Propiedades rurales de alta categoria",
    count: 32,
    image: "/assets/cultivos4.jpeg",
  },
];

export default function Categories() {
  const handleCategoryClick = (categoryId) => {
    console.log("Categoría seleccionada:", categoryId);
    // Aquí iría la navegación a la categoría seleccionada
  };

  return (
    <section id="categorias" className="categories-section">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Explora</p>
          <h2 className="section-title">Tipos de propiedades</h2>
          <p className="section-description">
            Encuentra el tipo de propiedad rural que mejor se adapte a tus
            necesidades y estilo de vida.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category.id)}
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
                      {category.count} propiedades
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