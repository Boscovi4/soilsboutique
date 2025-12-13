import React, { useState, useEffect } from 'react';
import { HERO_IMAGE } from '../constants';
import { Product } from '../types';

interface HeroSectionProps {
  products?: Product[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ products = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter for hot items
  const hotProducts = products.filter(p => p.isHot);

  // Define the static slide
  const staticSlide = {
    id: 'static-hero',
    image: HERO_IMAGE,
    subtitle: 'Big Sale',
    title: 'DISKONTU NATAL NIAN',
    description: 'UP TO 25% OFF',
    buttonText: 'Hola imi nian agora',
    isProduct: false
  };

  // Combine into one array of slides
  const slides = [
    staticSlide,
    ...hotProducts.map(p => ({
      id: p.id,
      image: p.imageUrl,
      subtitle: 'DISKONTU NATAL NIAN',
      title: p.name,
      description: `$${p.price.toFixed(2)}`,
      buttonText: 'Hola imi nian agora',
      isProduct: true
    }))
  ];

  useEffect(() => {
    // Only auto-rotate if we have more than 1 slide
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleAction = () => {
     // Scroll down to shop area
     const shopSection = document.getElementById('shop-section');
     if (shopSection) {
       shopSection.scrollIntoView({ behavior: 'smooth' });
     }
  };

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
              onClick={handleAction}
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