import { MapPin, Ruler, Bed, Bath } from "lucide-react";
import "../styles/components/featuredProp.css";

const properties = [
  {
    id: 1,
    title: "Miramar",
    location: "Paraje La Ballenera",
    price: "390.000",
    area: "15 ha",
    bedrooms: 0,
    bathrooms: 0,
    image: "/assets/prop1.jpg",
    type: "Paraje",
  },
  {
    id: 2,
    title: "Santa Irene",
    location: "Paraje Mechongue",
    price: "250.000",
    area: "15 ha",
    bedrooms: 0,
    bathrooms: 0,
    image: "/assets/prop2.jpg",
    type: "Campo Agricola",
  },
  {
    id: 3,
    title: "Santa Irene",
    location: "Miramar, Buenos Aires Costa Atlántica",
    price: "300.000",
    area: "8 ha",
    bedrooms: 0,
    bathrooms: 0,
    image: "/assets/prop3.jpg",
    type: "Paraje",
  },
  {
    id: 4,
    title: "Santa Irene",
    location: "Miramar, Buenos Aires Costa Atlántica",
    price: "650.000",
    area: "32 ha",
    bedrooms: 4,
    bathrooms: 2,
    image: "/assets/prop4.jpg",
    type: "Paraje",
  },
  {
    id: 5, // Nueva propiedad
    title: "Santa Irene",
    location: "Miramar, Buenos Aires Costa Atlántica",
    price: "70.000",
    area: "10 ha",
    bedrooms: 0,
    bathrooms: 0,
    image: "/assets/prop5.jpg",
    type: "Paraje",
  },
];

export default function FeaturedProperties() {
  const handleViewMore = (id) => {
    console.log("Ver propiedad:", id);
    // Aquí iría la navegación al detalle de la propiedad
  };

  const handleViewAll = () => {
    console.log("Ver todas las propiedades");
    // Aquí iría la navegación a la página de todas las propiedades
  };

  return (
    <section id="propiedades" className="featured-section">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Destacadas</p>
          <h2 className="section-title">Propiedades seleccionadas</h2>
          <p className="section-description">
            Descubre nuestra seleccion de las mejores propiedades rurales
            disponibles en este momento.
          </p>
        </div>

        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <div className="card-image-container">
                <img
                  src={property.image}
                  alt={property.title}
                  className="card-image"
                />
                <span className="property-type">{property.type}</span>
              </div>
              <div className="card-content">
                <h3 className="property-title">{property.title}</h3>
                <div className="property-location">
                  <MapPin className="location-icon" />
                  <span>{property.location}</span>
                </div>
                <div className="property-features">
                  <div className="feature-item">
                    <Ruler className="feature-icon" />
                    <span>{property.area}</span>
                  </div>
                  {property.bedrooms > 0 && (
                    <div className="feature-item">
                      <Bed className="feature-icon" />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="feature-item">
                      <Bath className="feature-icon" />
                      <span>{property.bathrooms}</span>
                    </div>
                  )}
                </div>
                <div className="card-footer">
                  <p className="property-price">USD {property.price}</p>
                  <button
                    className="view-button"
                    onClick={() => handleViewMore(property.id)}
                  >
                    Ver mas
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <button className="view-all-button" onClick={handleViewAll}>
            Ver todas las propiedades
          </button>
        </div>
      </div>
    </section>
  );
}