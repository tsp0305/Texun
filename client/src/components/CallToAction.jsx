import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChevronLeftIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// SVG Illustration helper for clean technical representation
const TopicIllustration = ({ title }) => {
  switch (title) {
    case "Fibre Manufacturing":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="100" cy="50" r="10" strokeDasharray="3,3" />
          <circle cx="100" cy="50" r="4" fill="currentColor" />
          <path d="M90 50h-40M110 50h40" stroke="slate-400" strokeWidth="1" strokeDasharray="2,2" />
          {/* Spinneret extrusions */}
          <path d="M100 60v10m-4-10v8m8-8v8" />
          <path d="M96 78 C90 110, 80 120, 60 150" strokeWidth="1.2" />
          <path d="M100 70 C100 110, 100 120, 100 160" strokeWidth="1.8" />
          <path d="M104 78 C110 110, 120 120, 140 150" strokeWidth="1.2" />
          <circle cx="60" cy="150" r="3" fill="currentColor" />
          <circle cx="100" cy="160" r="3" fill="currentColor" />
          <circle cx="140" cy="150" r="3" fill="currentColor" />
          {/* Grid lines */}
          <line x1="20" y1="180" x2="180" y2="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4" />
        </svg>
      );
    case "Yarn Manufacturing":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Rotating Carding Drum */}
          <circle cx="100" cy="100" r="45" strokeWidth="2" />
          <circle cx="100" cy="100" r="40" strokeDasharray="4,2" />
          <circle cx="100" cy="100" r="5" fill="currentColor" />
          {/* Thread wrapping around carding cylinders */}
          <circle cx="50" cy="70" r="15" />
          <circle cx="150" cy="130" r="20" />
          {/* Winding yarns */}
          <path d="M35 70 C60 50, 80 60, 100 55 C120 50, 130 90, 150 110 C170 130, 180 120, 190 130" strokeWidth="2" />
          {/* Small spools */}
          <line x1="100" y1="100" x2="150" y2="130" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="100" y1="100" x2="50" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
      );
    case "Fabric Manufacturing":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Loom weave grid */}
          <rect x="40" y="40" width="120" height="120" rx="4" strokeWidth="2" />
          {/* Warp threads */}
          <line x1="60" y1="40" x2="60" y2="160" />
          <line x1="80" y1="40" x2="80" y2="160" />
          <line x1="100" y1="40" x2="100" y2="160" />
          <line x1="120" y1="40" x2="120" y2="160" />
          <line x1="140" y1="40" x2="140" y2="160" />
          {/* Weft threads woven (dashed overlays) */}
          <line x1="40" y1="60" x2="160" y2="60" strokeWidth="2" strokeDasharray="5,10" />
          <line x1="40" y1="80" x2="160" y2="80" strokeWidth="2" strokeDasharray="10,5" />
          <line x1="40" y1="100" x2="160" y2="100" strokeWidth="2" strokeDasharray="5,10" />
          <line x1="40" y1="120" x2="160" y2="120" strokeWidth="2" strokeDasharray="10,5" />
          <line x1="40" y1="140" x2="160" y2="140" strokeWidth="2" strokeDasharray="5,10" />
        </svg>
      );
    case "Manufacturing Costing":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Grid background */}
          <path d="M30 40h140M30 70h140M30 100h140M30 130h140M30 160h140" stroke="slate-200" strokeWidth="0.5" className="dark:stroke-slate-800" />
          <path d="M30 40v120M60 40v120M90 40v120M120 40v120M150 40v120M170 40v120" stroke="slate-200" strokeWidth="0.5" className="dark:stroke-slate-800" />
          {/* Graph lines */}
          <path d="M30 130 L60 110 L90 120 L120 80 L150 50 L170 60" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="30" cy="130" r="4" fill="currentColor" />
          <circle cx="60" cy="110" r="4" fill="currentColor" />
          <circle cx="90" cy="120" r="4" fill="currentColor" />
          <circle cx="120" cy="80" r="4" fill="currentColor" />
          <circle cx="150" cy="50" r="4" fill="currentColor" />
          <circle cx="170" cy="60" r="4" fill="currentColor" />
          {/* Labels or currency symbol */}
          <text x="145" y="40" fill="currentColor" fontSize="12" fontWeight="bold" stroke="none">$</text>
        </svg>
      );
    case "Technical Services & Utilities":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Centered industrial fan/compressor wheel */}
          <circle cx="100" cy="100" r="15" />
          <circle cx="100" cy="100" r="4" fill="currentColor" />
          {/* Fan blades */}
          <path d="M100 85 C80 60, 120 60, 100 85" fill="currentColor" opacity="0.2" />
          <path d="M100 85 C80 60, 120 60, 100 85" />
          <path d="M100 115 C80 140, 120 140, 100 115" fill="currentColor" opacity="0.2" />
          <path d="M100 115 C80 140, 120 140, 100 115" />
          <path d="M85 100 C60 80, 60 120, 85 100" fill="currentColor" opacity="0.2" />
          <path d="M85 100 C60 80, 60 120, 85 100" />
          <path d="M115 100 C140 80, 140 120, 115 100" fill="currentColor" opacity="0.2" />
          <path d="M115 100 C140 80, 140 120, 115 100" />
          {/* Air flow lines */}
          <path d="M40 50 C70 40, 130 40, 160 50" strokeWidth="1" strokeDasharray="3,3" />
          <path d="M40 150 C70 160, 130 160, 160 150" strokeWidth="1" strokeDasharray="3,3" />
        </svg>
      );
    default:
      return null;
  }
};

const topics = [
  {
    title: "Fibre Manufacturing",
    description: "Deep dive into the structural layout and extrusion processing of natural and manmade polymer fibres.",
    link: "/search?product=Fibre+Manufacturing",
    alt: "Fibre Manufacturing mechanics"
  },
  {
    title: "Yarn Manufacturing",
    description: "Technical breakdowns of carding, combing, drafting, ring spinning, open-end, and air-jet sequences.",
    link: "/search?product=Yarn+Manufacturing",
    alt: "Yarn Spinning processes"
  },
  {
    title: "Fabric Manufacturing",
    description: "Inspect formatting operations from warp sizing, high-speed looms, knitting cycles, to garment sewing parameters.",
    link: "/search?product=Fabric+Manufacturing",
    alt: "Fabric Looms and Knitting styles"
  },
  {
    title: "Manufacturing Costing",
    description: "Master standard cost formulas, count conversion rates, and tool/store consumption budgeting matrices.",
    link: "/search?product=Yarn+Manufacturing&category=Costing",
    alt: "Calculations and budgeting guides"
  },
  {
    title: "Technical Services & Utilities",
    description: "Browse operating guidelines for humidification plants, air compressors, and automatic bobbin logistics.",
    link: "/search?product=Yarn+Manufacturing&category=Accessories",
    alt: "Utility operations manuals"
  }
];

export default function SpinningCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % topics.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + topics.length) % topics.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative px-2">
      <div className="overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Main carousel content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Text content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight mb-3">
                {topics[currentSlide].title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                {topics[currentSlide].description}
              </p>
              <button 
                onClick={() => navigate(topics[currentSlide].link)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
              >
                Browse Documentation &rarr;
              </button>
            </div>
            
            {/* SVG illustration container */}
            <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-150 dark:border-slate-850 p-6 flex items-center justify-center">
              <TopicIllustration title={topics[currentSlide].title} />
            </div>
          </div>
        </div>
        {/* Navigation dots */}
        <div className="flex justify-center gap-2 pb-5 bg-white dark:bg-slate-900">
          {topics.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === index 
                  ? 'bg-indigo-600 dark:bg-indigo-400 w-5' 
                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-[-16px] md:left-[-24px] top-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 p-2 rounded-full shadow-md hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-[-16px] md:right-[-24px] top-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 p-2 rounded-full shadow-md hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}