import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type Movie } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';

interface TopContentProps {
  title?: string;
  subtitle?: string;
  items: Movie[];
}

export function TopContent({ title = "TOP 10", subtitle = "CONTENT TODAY", items }: TopContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 5;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsToShow >= items.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, items.length - itemsToShow) : prevIndex - 1
    );
  };

  const visibleItems = items.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="relative w-full overflow-hidden bg-black py-16">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px)] bg-[size:4rem_100%] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="flex items-baseline gap-4 mb-12">
          <h2 
            className="text-8xl font-bold tracking-tighter"
            style={{ 
              WebkitTextStroke: '2px #ff0000',
              color: 'transparent',
              textShadow: '0 0 20px rgba(255, 0, 0, 0.3)'
            }}
          >
            {title}
          </h2>
          <div className="text-2xl font-semibold text-white/80">
            {subtitle}
          </div>
        </div>

        {/* Content Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-16 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-16 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Items Container */}
          <div 
            className="flex gap-16 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`
            }}
          >
            {visibleItems.map((item, idx) => (
              <div key={item.id} className="relative flex-none w-[260px]">
                <div className="group relative">
                  {/* Position the number so it's half behind and half visible */}
                  <div 
                    className="absolute -left-12 bottom-0 text-[160px] font-bold select-none"
                    style={{ 
                      WebkitTextStroke: '2px #ff0000',
                      color: 'transparent',
                      textShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
                      fontFamily: 'system-ui',
                      lineHeight: '0.8',
                      zIndex: 0, // Place behind the image
                    }}
                  >
                    {currentIndex + idx + 1}
                  </div>

                  {/* Movie Poster */}
                  <div className="relative transform-gpu transition-transform duration-300 group-hover:scale-105" style={{ zIndex: 1 }}>
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-30">
                    <h3 className="text-lg font-semibold text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
                      <span>{new Date(item.release_date).getFullYear()}</span>
                      <span>•</span>
                      <span>{item.vote_average.toFixed(1)} ★</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}