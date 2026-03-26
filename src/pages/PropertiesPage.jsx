// C:\xampp\htdocs\InmobiliariaRural\src\pages\PropertiesPage.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyList from '../components/PropertyList';
import "../styles/pages/propiedades/propertiesPage.css";

export default function PropertiesPage() {
  return (
    <>
      <Header />
      <div className="properties-page">
        <div className="page-hero">
          <div className="container">
            <h1>Todas nuestras propiedades</h1>
            <p>Descubre nuestra selección de propiedades rurales exclusivas</p>
          </div>
        </div>
        <PropertyList />
      </div>
      <Footer />
    </>
  );
}