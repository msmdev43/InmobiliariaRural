// C:\xampp\htdocs\InmobiliariaRural\src\components\WhatsappContact.jsx
import { FaWhatsapp } from 'react-icons/fa';
import '../../styles/components/UI/whatsappContact.css';

export default function WhatsappContact() {  
  const whatsappNumber = "5492291510406"; // Formato: código país + código área + número
  const whatsappMessage = "Hola! Desde Gustavo Barberini Inmobiliaria me interesa una propiedad. ¿Podrían brindarme más información?";
  
  // URL de WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };
  
   return (
    <div className="whatsapp-button-container">
      <button 
        className="whatsapp-button"
        onClick={handleClick}
        aria-label="Contactar por WhatsApp"
        title="Contactar por WhatsApp"
      >
        <div className="whatsapp-icon-wrapper">
          <FaWhatsapp className="whatsapp-icon" />
        </div>
        <div className="whatsapp-tooltip">
          <span>¡Escribinos por WhatsApp!</span>
        </div>
      </button>
    </div>
  );
}