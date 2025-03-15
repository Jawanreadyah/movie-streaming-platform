import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Star, Play, Info } from 'lucide-react';
import { type Movie, type Genre } from '@/lib/types';
import { TMDB_API_KEY, TMDB_BASE_URL } from '@/lib/tmdb';
import ReactPlayer from 'react-player';

interface MovieBannerProps {
  movies: Movie[];
  genres: Genre[];
}

export function MovieBanner({ movies, genres }: MovieBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [movieLogo, setMovieLogo] = useState<string | null>(null);
  const playerRef = useRef<ReactPlayer>(null);

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    // Reset states when movie changes
    setShowTrailer(false);
    setTrailerUrl(null);
    setIsLoading(false);
    setMovieLogo(null);

    // Fetch movie logo
    fetchMovieLogo();

    // Start the poster display timer
    const posterTimer = setTimeout(() => {
      fetchAndPlayTrailer();
    }, 2000);

    return () => {
      clearTimeout(posterTimer);
    };
  }, [currentIndex]);

  const fetchMovieLogo = async () => {
    if (!currentMovie?.id) return;

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${currentMovie.id}/images?api_key=${TMDB_API_KEY}&include_image_language=en,null`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Get the logo if available
      if (data.logos && data.logos.length > 0) {
        // Sort by vote_average to get the highest quality logo
        const bestLogo = [...data.logos].sort((a, b) => b.vote_average - a.vote_average)[0];
        setMovieLogo(`https://image.tmdb.org/t/p/original${bestLogo.file_path}`);
      } else {
        setMovieLogo(null);
      }
    } catch (error) {
      console.error('Error fetching movie logo:', error);
      setMovieLogo(null);
    }
  };

  const fetchAndPlayTrailer = async () => {
    if (!currentMovie?.id || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${currentMovie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Find the first available trailer
      const trailer = data.results?.find(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      );

      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
        setShowTrailer(true);
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      // Keep showing the poster image if trailer fetch fails
      setShowTrailer(false);
      setTrailerUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const movieGenres = currentMovie.genre_ids
    .map((id) => genres.find((genre) => genre.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="relative h-screen max-h-[800px] w-full overflow-hidden">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Background */}
      <div className="relative h-full w-full">
        {showTrailer && trailerUrl ? (
          <div className="absolute inset-0 bg-black">
            <ReactPlayer
              ref={playerRef}
              url={trailerUrl}
              width="100%"
              height="100%"
              playing
              loop
              muted
              config={{
                youtube: {
                  playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    showinfo: 0,
                    rel: 0
                  }
                }
              }}
            />
          </div>
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            alt={currentMovie.title}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-8">
          <div className="max-w-2xl">
            {movieLogo ? (
              <img 
                src={movieLogo} 
                alt={currentMovie.title} 
                className="max-h-32 max-w-full object-contain mb-4"
              />
            ) : (
              <h1 className="text-4xl font-bold text-white md:text-6xl">
                {currentMovie.title}
              </h1>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span>{currentMovie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-5 w-5" />
                <span>{new Date(currentMovie.release_date).getFullYear()}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movieGenres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 max-w-lg text-white/70">
              {currentMovie.overview}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link to={`/movie/${currentMovie.id}`}>
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Watch Now
                </Button>
              </Link>
              <Link to={`/movie/${currentMovie.id}`}>
                <Button variant="outline" size="lg" className="gap-2">
                  <Info className="h-5 w-5" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}