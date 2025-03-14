import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type WatchProgress } from '@/lib/utils';
import { tmdb } from '@/lib/tmdb';

export function ContinueWatching({ items }: { items: WatchProgress[] }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Continue Watching</h2>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 text-center">
          <p className="text-white/70">Start watching movies and TV shows to track your progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8">
      <h2 className="text-2xl font-semibold text-white mb-6">Continue Watching</h2>
      <div className="relative group">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.id}-${item.timestamp}`}
              to={item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
              className="relative flex-shrink-0 w-64 group/item"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={tmdb.getBackdropUrl(item.poster_path, 'w780')}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20">
                  <div 
                    className="h-full bg-red-600"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                {/* Progress Percentage Badge */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md border border-white/20">
                  {Math.round(item.progress)}%
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <Button 
                    size="icon" 
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20"
                  >
                    <Play className="w-6 h-6 text-white" fill="currentColor" />
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="font-medium text-white line-clamp-1">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
                  {item.type === 'tv' && item.episodeInfo && (
                    <>
                      <span>S{item.episodeInfo.seasonNumber}</span>
                      <span>E{item.episodeInfo.episodeNumber}</span>
                      <span>•</span>
                    </>
                  )}
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-600 mr-1"></div>
                    {Math.floor(item.currentTime || 0) / 60 > 0 
                      ? `${Math.floor((item.currentTime || 0) / 60)}m left`
                      : 'Just started'
                    }
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
          disabled={scrollPosition === 0}
        >
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </div>
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}