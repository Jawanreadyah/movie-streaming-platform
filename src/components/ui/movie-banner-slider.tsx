import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tmdb } from '@/lib/tmdb';
import { type Movie } from '@/lib/types';

interface MovieBannerSliderProps {
  movies: Movie[];
}

export function MovieBannerSlider({ movies }: MovieBannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movieLogos, setMovieLogos] = useState<Record<number, string | null>>({});
  const movie = movies[currentIndex];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % movies.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [movies.length]);

  // Fetch movie logos for all movies in the slider
  useEffect(() => {
    const fetchLogos = async () => {
      for (const movie of movies) {
        if (movie.id && !movieLogos[movie.id]) {
          try {
            const images = await tmdb.getMovieImages(movie.id);
            if (images.logos && images.logos.length > 0) {
              // Sort by vote_average to get the highest quality logo
              const bestLogo = [...images.logos].sort((a, b) => b.vote_average - a.vote_average)[0];
              setMovieLogos(prev => ({
                ...prev,
                [movie.id]: `https://image.tmdb.org/t/p/original${bestLogo.file_path}`
              }));
            } else {
              setMovieLogos(prev => ({ ...prev, [movie.id]: null }));
            }
          } catch (error) {
            console.error(`Error fetching logo for movie ${movie.id}:`, error);
            setMovieLogos(prev => ({ ...prev, [movie.id]: null }));
          }
        }
      }
    };

    fetchLogos();
  }, [movies]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-black">
      <div className="relative aspect-[21/9] w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <img
            src={tmdb.getBackdropUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg">
              {movie.id && movieLogos[movie.id] ? (
                <img 
                  src={movieLogos[movie.id] || ''}
                  alt={movie.title}
                  className="max-h-20 max-w-full object-contain mb-3"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                  {movie.title}
                </h1>
              )}
              <p className="text-sm sm:text-base text-white/70 line-clamp-2 sm:line-clamp-3 mb-4">
                {movie.overview}
              </p>
              <div className="flex gap-3">
                <Link to={`/movie/${movie.id}`}>
                  <Button 
                    size="sm"
                    className="bg-white text-black hover:bg-white/90 rounded-full px-4 sm:px-8"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" />
                    Play Now
                  </Button>
                </Link>
                <Link to={`/movie/${movie.id}`}>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white hover:bg-white/20 rounded-full border-white/20 px-4 sm:px-8"
                  >
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    More Info
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center items-center gap-2">
          {movies.map((movie, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="group relative"
            >
              <div className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}