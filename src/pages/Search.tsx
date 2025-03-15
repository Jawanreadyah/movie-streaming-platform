import { useState, useCallback } from 'react';
import { tmdb } from '@/lib/tmdb';
import { type Movie } from '@/lib/types';
import { MovieCard } from '@/components/ui/movie-card';
import { DotPattern } from '@/components/ui/dot-pattern';
import { ActionSearchBar } from '@/components/ui/action-search-bar';

export function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  // Memoize the search function to prevent unnecessary rerenders
  const searchMovies = useCallback(async (searchQuery: string, year?: number, genreId?: number) => {
    // Clear any pending searches
    if (searchTimeout) {
      window.clearTimeout(searchTimeout);
    }

    if (!searchQuery.trim() && !year && !genreId) {
      setMovies([]);
      return;
    }

    // Set loading state with a slight delay to prevent UI flashing
    const timeout = window.setTimeout(() => {
      setLoading(true);
    }, 300);
    setSearchTimeout(timeout);

    try {
      let results;
      if (searchQuery.trim()) {
        results = await tmdb.searchMovies(searchQuery, year, genreId ? Number(genreId) : undefined);
      } else {
        results = await tmdb.discoverMovies(year, genreId ? Number(genreId) : undefined);
      }
      
      // Clear loading timeout if search completes quickly
      window.clearTimeout(timeout);
      setSearchTimeout(null);
      
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setMovies(results);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error searching movies:', error);
      window.clearTimeout(timeout);
      setSearchTimeout(null);
      setLoading(false);
    }
  }, [searchTimeout]);

  const handleSearch = useCallback((searchQuery: string, year?: number, genreId?: number) => {
    setQuery(searchQuery);
    if (genreId) setSelectedGenre(genreId.toString());
    if (year) setSelectedYear(year.toString());
    searchMovies(searchQuery, year, genreId);
  }, [searchMovies]);

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <DotPattern
        className="fixed inset-0 w-full h-full [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        cx={1}
        cy={1}
        cr={1}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Search Area with New ActionSearchBar */}
        <div className="mb-8">
          <ActionSearchBar onSearch={handleSearch} />
        </div>

        {/* Movies Grid - Using a fixed height container for smoother transitions */}
        <div className="flex-1 space-y-8 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-32 h-32 mb-8 opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white/70 mb-2">No movies found</h3>
              <p className="text-white/50 max-w-md">
                {query.trim() || selectedGenre || selectedYear
                  ? "Try adjusting your search or filters to find more movies."
                  : "Use the search bar above to find movies you love."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}