import React, { useState } from 'react';

const ChevronLeftIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const topics = [
    {
      title: "Fibre Manufacturing",
      description: "Learn fundamental spinning methods and best practices for beginners",
      link: "/basic-spinning",
      image: "https://via.placeholder.com/400x400.png?text=Basic+Spinning",
      alt: "Basic spinning techniques demonstration"
    },
    {
      title: "Yarn Manufacturing",
      description: "Master the art of preparing different types of fibers for spinning",
      link: "/fiber-preparation",
      image: "https://via.placeholder.com/400x400.png?text=Fiber+Prep",
      alt: "Advanced fiber preparation methods"
    },
    {
      title: "Fabric Manufacturing",
      description: "Comprehensive guide to spinning wheels and tools",
      link: "/equipment",
      image: "https://via.placeholder.com/400x400.png?text=Equipment",
      alt: "Various spinning equipment and tools"
    },
    {
      title: "Costing",
      description: "Create unique yarn patterns and textures",
      link: "/patterns",
      image: "https://via.placeholder.com/400x400.png?text=Patterns",
      alt: "Different yarn patterns and textures"
    }
    ,
    {
        title: "Service",
        description: "Create unique yarn patterns and textures",
        link: "/patterns",
        image: "https://via.placeholder.com/400x400.png?text=Patterns",
        alt: "Different yarn patterns and textures"
      }
  ];

export default function SpinningCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const nextSlide = () => {
    setIsImageLoading(true);
    setCurrentSlide((prev) => (prev + 1) % topics.length);
  };

  const prevSlide = () => {
    setIsImageLoading(true);
    setCurrentSlide((prev) => (prev - 1 + topics.length) % topics.length);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Main carousel content */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center space-x-6">
            {/* Text content */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {topics[currentSlide].title}
              </h2>
              <p className="text-gray-600 mb-4">
                {topics[currentSlide].description}
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Explore Now
              </button>
            </div>
            
            {/* Image container */}
            <div className="flex-1 p-4">
              <div className="bg-gray-100 rounded-lg w-full aspect-square flex items-center justify-center relative overflow-hidden">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img 
                  src={topics[currentSlide].image}
                  alt={topics[currentSlide].alt}
                  className={`rounded-lg w-full h-full object-cover transition-opacity duration-300 ${
                    isImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={handleImageLoad}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Navigation dots */}
        <div className="flex justify-center gap-2 pb-4">
          {topics.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsImageLoading(true);
                setCurrentSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? 'bg-purple-500' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}