import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface HeroSectionProps {
  products?: Product[];
  onAction?: (type: 'whatsapp' | 'cart', product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ products = [], onAction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter for hot items
  const hotProducts = products.filter(p => p.isHot);

  // Only display product that marked as HOT item
  const slides = hotProducts.map(p => ({
    id: p.id,
    image: p.imageUrl,
    subtitle: 'HOT ITEM',
    title: p.name,
    description: `$${p.price.toFixed(2)}`,
    buttonText: 'Hola imi nian agora',
    isProduct: true,
    product: p
  }));

  // Safety check for deleted items
  useEffect(() => {
    if (currentIndex >= slides.length && slides.length > 0) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  useEffect(() => {
    // Only auto-rotate if we have more than 1 slide
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
          const next = prev + 1;
          return next >= slides.length ? 0 : next;
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSlideAction = (slide: typeof slides[0]) => {
     if (slide.isProduct && slide.product && onAction) {
       onAction('whatsapp', slide.product);
     }
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[30rem] overflow-hidden bg-gray-200 dark:bg-gray-800">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-90"
            src={slide.image}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-center px-6 md:px-12 lg:px-20">
            <span className="text-white font-bold text-lg md:text-xl lg:text-2xl uppercase tracking-wider mb-2 drop-shadow-md font-sans">
              {slide.subtitle}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-brand font-bold text-white mb-3 drop-shadow-md line-clamp-2 w-3/4 md:w-1/2 italic">
              {slide.title}
            </h2>
            <p className="text-white text-xl md:text-2xl font-light mb-6 drop-shadow-md line-clamp-1">
              {slide.description}
            </p>
            <button 
              onClick={() => handleSlideAction(slide)}
              className="w-max border-2 border-white text-white bg-transparent hover:bg-white hover:text-secondary px-8 py-3 rounded-full text-sm md:text-base font-semibold shadow-lg transition-all transform hover:scale-105 backdrop-blur-sm"
            >
              {slide.buttonText}
            </button>
          </div>
        </div>
      ))}
      
      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/60 w-2 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};