// C:\xampp\htdocs\InmobiliariaRural\src\pages\PropertiesPage.jsx
import React from 'react';
import PropertiesHeader from '../components/PropertiesHeader';
import Footer from '../components/PropertyFooter';
import PropertyList from '../components/PropertyList';
import "../styles/pages/propiedades/propertiesPage.css";

export default function PropertiesPage() {
  return (
    <>
      <PropertiesHeader />
      <PropertyList />
      <Footer />
    </>
  );
}