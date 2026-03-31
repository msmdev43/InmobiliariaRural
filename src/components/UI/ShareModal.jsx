// C:\xampp\htdocs\InmobiliariaRural\src\components\ShareModal.jsx
import React, { useState } from 'react';
import '../../styles/components/UI/shareModal.css';

const ShareModal = ({ propiedad, onClose }) => {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/propiedad/${propiedad.id}`;

  // Mensaje predefinido para compartir
  const mensajeCompartir = `¡Mira esta propiedad! 🏠\n\n${propiedad.titulo}\nCódigo: ${propiedad.codigo}\nUbicación: ${propiedad.ubicacion}\nSuperficie: ${propiedad.superficie} ha\nPrecio: ${propiedad.moneda} ${propiedad.precio_formateado}\n\nMás información: ${link}`;

  const handleCopiarLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleCompartirWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(mensajeCompartir)}`;
    window.open(url, '_blank');
  };

  const handleCompartirEmail = () => {
    const asunto = `Propiedad: ${propiedad.titulo} - Código: ${propiedad.codigo}`;
    const url = `mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensajeCompartir)}`;
    window.open(url, '_blank');
  };

  const handleCompartirNativo = () => {
    if (navigator.share) {
      navigator.share({
        title: propiedad.titulo,
        text: `Mira esta propiedad: ${propiedad.titulo} - ${propiedad.codigo}`,
        url: link,
      }).catch(err => {
        console.log('Error al compartir:', err);
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      handleCopiarLink();
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-container" onClick={e => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3 className="share-modal-title">Compartir propiedad</h3>
          <button className="share-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="share-modal-body">
          <div className="share-propiedad-info">
            <h4 className="share-propiedad-titulo">{propiedad.titulo}</h4>
            <p className="share-propiedad-detalle">
              <span>Código: {propiedad.codigo}</span>
              <span>{propiedad.ubicacion}</span>
            </p>
          </div>

          <div className="share-link-container">
            <input 
              type="text" 
              value={link} 
              readOnly 
              className="share-link-input"
            />
            <button 
              className={`share-copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopiarLink}
            >
              {copied ? '✓ Copiado!' : 'Copiar link'}
            </button>
          </div>

          <div className="share-options">
            <button className="share-option-btn share-whatsapp" onClick={handleCompartirWhatsApp}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              WhatsApp
            </button>
            <button className="share-option-btn share-email" onClick={handleCompartirEmail}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email
            </button>
            <button className="share-option-btn share-more" onClick={handleCompartirNativo}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Más opciones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;