import React, { useState, useEffect } from 'react';
import { FeaturedPost } from './FeaturedPost';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const featuredPosts = [
  {
    title: "Retrospectiva 2024: Momentos Marcantes da Nossa Comunidade",
    excerpt: "Uma jornada pelos momentos mais especiais que compartilhamos juntos este ano.",
    author: {
      name: "Maria Silva",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    date: "Mar 15, 2024",
    commentCount: 42,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    category: "Destaque"
  },
  {
    title: "Inovação e Tecnologia: O Futuro é Agora",
    excerpt: "Descubra as principais tendências tecnológicas que estão transformando nossa empresa.",
    author: {
      name: "Carlos Santos",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    },
    date: "Mar 12, 2024",
    commentCount: 35,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    category: "Tecnologia"
  },
  {
    title: "Sustentabilidade: Nosso Compromisso com o Planeta",
    excerpt: "Conheça nossas iniciativas para um futuro mais sustentável e consciente.",
    author: {
      name: "Ana Lima",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    },
    date: "Mar 10, 2024",
    commentCount: 28,
    imageUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    category: "Sustentabilidade"
  }
];

export function FeaturedPostSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % featuredPosts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((current) => 
      current === 0 ? featuredPosts.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((current) => (current + 1) % featuredPosts.length);
  };

  return (
    <div className="relative group">
      <FeaturedPost post={featuredPosts[currentIndex]} />
      
      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-900/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-900/70"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-900/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-900/70"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredPosts.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-4'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}