import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Movie, type TVShow } from '@/lib/tmdb';
import { MovieCard, TVShowCard } from '@/components/ui/movie-card';

interface MovieSectionProps {
  title: string;
  items: (Movie | TVShow)[];
}

export function MovieSection({ title, items }: MovieSectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.clientWidth || 0;
    const visibleCards = Math.floor(container.clientWidth / cardWidth);
    const scrollAmount = cardWidth * visibleCards;
    const maxScroll = container.scrollWidth - container.clientWidth;

    let newPosition;
    if (direction === 'left') {
      newPosition = Math.max(0, scrollPosition - scrollAmount);
    } else {
      newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
      // If we're about to scroll past the end, go back to the start
      if (newPosition >= maxScroll) {
        newPosition = 0;
      }
    }

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  const isMovie = (item: Movie | TVShow): item is Movie => {
    return 'title' in item;
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
          disabled={scrollPosition === 0}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <div key={item.id} className="flex-none w-[150px] sm:w-[200px] md:w-[240px]">
              {isMovie(item) ? (
                <MovieCard movie={item} />
              ) : (
                <TVShowCard show={item} />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}