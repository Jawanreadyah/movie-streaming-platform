import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { type Movie, type TVShow, tmdb } from '@/lib/tmdb';

interface MovieCardProps {
  movie: Movie;
}

interface TVShowCardProps {
  show: TVShow;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl group/card">
      <Link
        to={`/movie/${movie.id}`}
        onClick={() => window.scrollTo(0, 0)}
        className="block w-full h-full"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          {/* Poster Image */}
          <img
            src={tmdb.getPosterUrl(movie.poster_path, 'w342')}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 pointer-events-none" />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 pointer-events-none z-10">
            <h3 className="text-lg font-semibold text-white line-clamp-1 text-shadow-sm">{movie.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
              <div className="flex items-center gap-0.5">
                <Star className="h-4 w-4 text-gray-400 fill-gray-400" />
                <span className="text-shadow-sm">{movie.vote_average?.toFixed(1)}</span>
              </div>
              <span className="text-shadow-sm">•</span>
              <span className="text-shadow-sm">{new Date(movie.release_date).getFullYear()}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function TVShowCard({ show }: TVShowCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl group/card">
      <Link
        to={`/tv/${show.id}`}
        onClick={() => window.scrollTo(0, 0)}
        className="block w-full h-full"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          {/* Poster Image */}
          <img
            src={tmdb.getPosterUrl(show.poster_path, 'w342')}
            alt={show.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 pointer-events-none" />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 pointer-events-none z-10">
            <h3 className="text-lg font-semibold text-white line-clamp-1 text-shadow-sm">{show.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
              <div className="flex items-center gap-0.5">
                <Star className="h-4 w-4 text-gray-400 fill-gray-400" />
                <span className="text-shadow-sm">{show.vote_average?.toFixed(1)}</span>
              </div>
              <span className="text-shadow-sm">•</span>
              <span className="text-shadow-sm">{new Date(show.first_air_date).getFullYear()}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}