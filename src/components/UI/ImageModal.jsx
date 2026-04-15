// C:\xampp\htdocs\InmobiliariaRural\src\components\UI\ImageModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import ENDPOINTS from '../../config/endpoints';
import '../../styles/components/UI/ImageModal.css';

const DEFAULT_IMAGE = ENDPOINTS.ADMIN.DEFAULT_IMAGE;

const ImageModal = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentImage = images[currentIndex];
  const totalImages = images.length;

  // Función para manejar error de imagen
  const handleImageError = (e) => {
    if (e.target.src !== DEFAULT_IMAGE) {
      e.target.src = DEFAULT_IMAGE;
      e.target.onerror = null;
    }
  };

  // Navegación
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
    resetZoom();
    setIsLoading(true);
  }, [totalImages]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    resetZoom();
    setIsLoading(true);
  }, [totalImages]);

  // Resetear zoom al cambiar de imagen
  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Zoom
  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  // Manejo de mouse para arrastrar (cuando hay zoom)
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Manejo táctil para arrastrar en celular (cuando hay zoom)
  const handleTouchStart = (e) => {
    if (zoom > 1) {
      const touch = e.touches[0];
      setTouchStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (zoom > 1 && touchStart) {
      const touch = e.touches[0];
      const newX = touch.clientX - touchStart.x;
      const newY = touch.clientY - touchStart.y;
      setPosition({ x: newX, y: newY });
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Detectar swipe táctil para cambiar imagen (solo cuando no hay zoom)
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const onTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const onTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50 && zoom === 1) {
        if (diff > 0) {
          prevImage();
        } else {
          nextImage();
        }
      }
    };

    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [zoom, prevImage, nextImage]);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [prevImage, nextImage, onClose, zoomIn, zoomOut]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="image-modal-header">
          <div className="image-modal-counter">
            {currentIndex + 1} / {totalImages}
          </div>
          <div className="image-modal-controls">
            <button className="image-modal-control-btn" onClick={zoomOut} title="Alejar">
              <ZoomOut size={20} />
            </button>
            <button className="image-modal-control-btn" onClick={zoomIn} title="Acercar">
              <ZoomIn size={20} />
            </button>
            <button className="image-modal-control-btn image-modal-close" onClick={onClose} title="Cerrar">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Imagen principal con soporte para arrastre */}
        <div 
          className="image-modal-content"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {isLoading && (
            <div className="image-modal-loader">
              <div className="image-modal-spinner"></div>
            </div>
          )}
          <img
            src={currentImage?.url || DEFAULT_IMAGE}
            alt={currentImage?.nombre || `Imagen ${currentIndex + 1}`}
            className="image-modal-img"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              transition: isDragging ? 'none' : 'transform 0.2s ease',
              opacity: isLoading ? 0 : 1
            }}
            onLoad={() => setIsLoading(false)}
            onError={handleImageError}
            draggable={false}
          />
        </div>

        {/* Botones de navegación (solo si hay más de 1 imagen) */}
        {totalImages > 1 && (
          <>
            <button 
              className="image-modal-nav image-modal-nav-prev"
              onClick={prevImage}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={36} />
            </button>
            <button 
              className="image-modal-nav image-modal-nav-next"
              onClick={nextImage}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={36} />
            </button>
          </>
        )}

        {/* Miniaturas */}
        {totalImages > 1 && (
          <div className="image-modal-thumbnails">
            {images.map((img, index) => (
              <div
                key={img.id || index}
                className={`image-modal-thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index);
                  resetZoom();
                  setIsLoading(true);
                }}
              >
                <img 
                  src={img.url} 
                  alt={`Miniatura ${index + 1}`}
                  onError={handleImageError}
                />
              </div>
            ))}
          </div>
        )}

        {/* Instrucciones */}
        <div className="image-modal-instructions">
          <span>← → </span>
          <span>Flechas para navegar</span>
          <span className="separator">|</span>
          <span>ESC para cerrar</span>
          <span className="separator">|</span>
          <span>+ / - para zoom</span>
          <span className="separator">|</span>
          <span>🖱️ Arrastrar para mover</span>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;