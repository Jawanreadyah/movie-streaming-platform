import { Link } from 'react-router-dom';
import { Star, MoreVertical, Plus, X } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { type Movie, type TVShow } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { addToWatchlist, removeFromWatchlist, isInWatchlist, type WatchlistItemInput } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MovieCardProps {
  movie: Movie;
}

interface TVShowCardProps {
  show: TVShow;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if movie is in watchlist
    setInWatchlist(isInWatchlist(movie.id, 'movie'));
  }, [movie.id]);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddToWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const item: WatchlistItemInput = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      type: 'movie'
    };
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id, 'movie');
      setInWatchlist(false);
      toast({
        title: "Removed from Watchlist",
        description: `${movie.title} has been removed from your watchlist.`,
        duration: 3000,
      });
    } else {
      addToWatchlist(item);
      setInWatchlist(true);
      toast({
        title: "Added to Watchlist",
        description: `${movie.title} has been added to your watchlist.`,
        duration: 3000,
      });
    }
    
    setMenuOpen(false);
  };

  return (
    <div className="relative overflow-hidden rounded-xl group/card">
      {/* Three dots menu button */}
      <div 
        className="absolute top-2 right-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setMenuOpen(!menuOpen);
        }}
      >
        <div className="p-1 bg-black/60 hover:bg-black/80 rounded-full cursor-pointer backdrop-blur-sm" aria-label="Options">
          <MoreVertical className="h-5 w-5 text-white" />
        </div>
      </div>
      
      {/* Dropdown menu */}
      {menuOpen && (
        <div 
          ref={menuRef}
          className="absolute top-10 right-2 z-30 bg-black/80 backdrop-blur-md rounded-lg shadow-lg py-1 w-48 text-white border border-white/10"
        >
          <div 
            className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 cursor-pointer"
            onClick={handleAddToWatchlist}
          >
            {inWatchlist ? (
              <>
                <X className="h-4 w-4 text-red-400" />
                <span>Remove from Watchlist</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-green-400" />
                <span>Add to Watchlist</span>
              </>
            )}
          </div>
        </div>
      )}

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if show is in watchlist
    setInWatchlist(isInWatchlist(show.id, 'tv'));
  }, [show.id]);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddToWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const item: WatchlistItemInput = {
      id: show.id,
      title: show.name,
      poster_path: show.poster_path,
      type: 'tv'
    };
    
    if (inWatchlist) {
      removeFromWatchlist(show.id, 'tv');
      setInWatchlist(false);
      toast({
        title: "Removed from Watchlist",
        description: `${show.name} has been removed from your watchlist.`,
        duration: 3000,
      });
    } else {
      addToWatchlist(item);
      setInWatchlist(true);
      toast({
        title: "Added to Watchlist",
        description: `${show.name} has been added to your watchlist.`,
        duration: 3000,
      });
    }
    
    setMenuOpen(false);
  };

  return (
    <div className="relative overflow-hidden rounded-xl group/card">
      {/* Three dots menu button */}
      <div 
        className="absolute top-2 right-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setMenuOpen(!menuOpen);
        }}
      >
        <div className="p-1 bg-black/60 hover:bg-black/80 rounded-full cursor-pointer backdrop-blur-sm" aria-label="Options">
          <MoreVertical className="h-5 w-5 text-white" />
        </div>
      </div>
      
      {/* Dropdown menu */}
      {menuOpen && (
        <div 
          ref={menuRef}
          className="absolute top-10 right-2 z-30 bg-black/80 backdrop-blur-md rounded-lg shadow-lg py-1 w-48 text-white border border-white/10"
        >
          <div 
            className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 cursor-pointer"
            onClick={handleAddToWatchlist}
          >
            {inWatchlist ? (
              <>
                <X className="h-4 w-4 text-red-400" />
                <span>Remove from Watchlist</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-green-400" />
                <span>Add to Watchlist</span>
              </>
            )}
          </div>
        </div>
      )}

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