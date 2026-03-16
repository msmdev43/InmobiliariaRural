// C:\xampp\htdocs\InmobiliariaRural\src\components\UI\MapaUbicacion.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Solución para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clics en el mapa
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const MapaUbicacion = ({ lat = -38.27032891365016, lng = -57.839809201811434, onCoordenadasChange }) => {
  // Estado local para la posición del marcador
  const [position, setPosition] = useState([lat, lng]);

  const handleMapClick = (newLat, newLng) => {
    setPosition([newLat, newLng]);
    onCoordenadasChange(newLat, newLng);
  };

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={position} // El centro siempre sigue al marcador
        zoom={11.5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={handleMapClick} />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
};

export default MapaUbicacion;