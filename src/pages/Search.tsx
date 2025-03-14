import { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tmdb, type Movie, type Genre } from '@/lib/tmdb';
import { MovieCard } from '@/components/ui/movie-card';
import { DotPattern } from '@/components/ui/dot-pattern';

export function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Generate years from 1900 to current year
  const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await tmdb.getGenres();
        setGenres(genreList);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  const searchMovies = async (searchQuery: string, year?: number, genreId?: number) => {
    if (!searchQuery.trim() && !year && !genreId) {
      setMovies([]);
      return;
    }

    setLoading(true);
    try {
      let results;
      if (searchQuery.trim()) {
        results = await tmdb.searchMovies(searchQuery, year, genreId ? Number(genreId) : undefined);
      } else {
        results = await tmdb.discoverMovies(year, genreId ? Number(genreId) : undefined);
      }
      setMovies(results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    searchMovies(
      value,
      selectedYear ? parseInt(selectedYear) : undefined,
      selectedGenre ? parseInt(selectedGenre) : undefined
    );
  };

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
    searchMovies(
      query,
      selectedYear ? parseInt(selectedYear) : undefined,
      value ? parseInt(value) : undefined
    );
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    searchMovies(
      query,
      value ? parseInt(value) : undefined,
      selectedGenre ? parseInt(selectedGenre) : undefined
    );
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    searchMovies(query);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <DotPattern
        className="fixed inset-0 w-full h-full [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        cx={1}
        cy={1}
        cr={1}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`md:w-72 flex-shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-white">Filters</h2>
                {(selectedGenre || selectedYear) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80">Genre</label>
                  <Select value={selectedGenre} onValueChange={handleGenreChange}>
                    <SelectTrigger className="w-full backdrop-blur-lg bg-black/20 border-white/20 rounded-xl h-12 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:border-white/30">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-black/80 border-white/20">
                      {genres.map((genre) => (
                        <SelectItem 
                          key={genre.id} 
                          value={genre.id.toString()}
                          className="text-white focus:bg-white/20 focus:text-white transition-colors duration-300"
                        >
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80">Year</label>
                  <Select value={selectedYear} onValueChange={handleYearChange}>
                    <SelectTrigger className="w-full backdrop-blur-lg bg-black/20 border-white/20 rounded-xl h-12 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:border-white/30">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-xl bg-black/80 border-white/20">
                      {years.map((year) => (
                        <SelectItem 
                          key={year} 
                          value={year.toString()}
                          className="text-white focus:bg-white/20 focus:text-white transition-colors duration-300"
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60">
                  <SearchIcon className="h-6 w-6 animate-pulse" />
                </div>
                <Input
                  type="search"
                  placeholder="Search for movies..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full h-16 pl-16 pr-6 text-xl backdrop-blur-xl bg-white/10 border-white/20 rounded-2xl text-white placeholder:text-white/50 focus-visible:ring-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:border-white/30"
                />
              </div>
              <Button
                variant="outline"
                className="h-16 px-6 md:hidden backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-6 w-6" />
              </Button>
            </div>

            {/* Active Filters */}
            {(selectedGenre || selectedYear) && (
              <div className="flex flex-wrap gap-2">
                {selectedGenre && (
                  <div className="backdrop-blur-xl bg-white/10 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {genres.find(g => g.id.toString() === selectedGenre)?.name}
                    <button 
                      onClick={() => handleGenreChange('')}
                      className="hover:bg-white/20 rounded-full p-1 transition-colors duration-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {selectedYear && (
                  <div className="backdrop-blur-xl bg-white/10 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {selectedYear}
                    <button 
                      onClick={() => handleYearChange('')}
                      className="hover:bg-white/20 rounded-full p-1 transition-colors duration-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {loading ? (
              <div className="mt-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (query || selectedGenre || selectedYear) && (
              <div className="mt-12 text-center text-white/60">
                No movies found with the current filters
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}