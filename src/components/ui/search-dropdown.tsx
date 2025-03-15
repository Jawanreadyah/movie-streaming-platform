import { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { type Genre } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AnimatedMenu } from '@/components/ui/animated-menu';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchDropdownProps {
  onSearch: (query: string, year?: number, genreId?: number) => void;
}

export function SearchDropdown({ onSearch }: SearchDropdownProps) {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  // Generate years from 2000 to current year for animation menu
  const currentYear = new Date().getFullYear();
  const yearRanges = [
    { startYear: currentYear - 5, endYear: currentYear },
    { startYear: currentYear - 10, endYear: currentYear - 6 },
    { startYear: currentYear - 20, endYear: currentYear - 11 },
    { startYear: currentYear - 50, endYear: currentYear - 21 },
    { startYear: 1900, endYear: currentYear - 51 }
  ];

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

  // Create menu items for genres (up to 5 popular genres)
  const genreMenuItems = genres.slice(0, 5).map(genre => ({
    riveIcon: {
      src: "https://anim-icons.s3.amazonaws.com/9/rotate-layer.riv",
      stateMachine: "rotateLayer"
    },
    label: genre.name,
    hotkey: "",
    onClick: () => {
      setSelectedGenre(genre.id.toString());
      handleSearch(query, genre.id);
      setIsDropdownOpen(false);
    }
  }));

  // Create menu items for year ranges
  const yearMenuItems = yearRanges.map((range) => ({
    riveIcon: {
      src: "https://anim-icons.s3.amazonaws.com/9/replace-layer.riv",
      stateMachine: "replaceLayer"
    },
    label: `${range.startYear} - ${range.endYear}`,
    hotkey: "",
    onClick: () => {
      setSelectedYear(range.startYear.toString());
      handleSearch(query, undefined, range.startYear);
      setIsDropdownOpen(false);
    }
  }));

  // Combine search options
  const searchOptions = [
    {
      riveIcon: {
        src: "https://anim-icons.s3.amazonaws.com/9/view-hotkeys.riv",
        stateMachine: "viewHotkeys"
      },
      label: "Search All",
      hotkey: "⏎",
      onClick: () => {
        handleSearch(query);
        setIsDropdownOpen(false);
      }
    },
    ...genreMenuItems,
    ...yearMenuItems
  ];

  const handleSearch = (searchQuery: string, genreId?: number, year?: number) => {
    setQuery(searchQuery);
    onSearch(
      searchQuery,
      year,
      genreId
    );
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedGenre('');
    setSelectedYear('');
    onSearch('', undefined, undefined);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="flex items-center w-full">
        <div className="relative flex-1">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60">
            <SearchIcon className="h-6 w-6" />
          </div>
          <Input
            type="search"
            placeholder="Search for movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(query);
                setIsDropdownOpen(false);
              }
            }}
            className="w-full h-16 pl-16 pr-6 text-xl backdrop-blur-xl bg-white/10 border-white/20 rounded-2xl text-white placeholder:text-white/50 focus-visible:ring-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:border-white/30"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          className="h-16 ml-2 px-6 backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Filter className="h-6 w-6" />
        </Button>
      </div>

      {/* Dropdown with animated menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[80px] left-0 w-full z-50"
          >
            <div 
              className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-xl p-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <h3 className="text-white/80 text-sm font-medium mb-2">Search Options</h3>
                <AnimatedMenu 
                  items={searchOptions} 
                  className="w-full max-w-full"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click away handler */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {/* Display active filters */}
      {(selectedGenre || selectedYear) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedGenre && (
            <div className="backdrop-blur-xl bg-white/10 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {genres.find(g => g.id.toString() === selectedGenre)?.name || 'Genre'}
              <button 
                onClick={() => {
                  setSelectedGenre('');
                  handleSearch(query);
                }}
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
                onClick={() => {
                  setSelectedYear('');
                  handleSearch(query);
                }}
                className="hover:bg-white/20 rounded-full p-1 transition-colors duration-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
