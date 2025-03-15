import { useState, useEffect } from 'react';
import { getWatchlist, removeFromWatchlist, type WatchlistItem } from '@/lib/utils';
import { tmdb } from '@/lib/tmdb';
import { Link } from 'react-router-dom';
import { X, Clock, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [tab, setTab] = useState<'all' | 'movies' | 'tv'>('all');
  const { toast } = useToast();
  
  useEffect(() => {
    // Load watchlist items
    const items = getWatchlist();
    setWatchlist(items);
    
    // Set up interval to check for changes
    const interval = setInterval(() => {
      const latestItems = getWatchlist();
      if (JSON.stringify(latestItems) !== JSON.stringify(watchlist)) {
        setWatchlist(latestItems);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleRemove = (id: number, type: 'movie' | 'tv', title: string) => {
    removeFromWatchlist(id, type);
    setWatchlist(prev => prev.filter(item => !(item.id === id && item.type === type)));
    toast({
      title: "Removed from Watchlist",
      description: `${title} has been removed from your watchlist.`,
      duration: 3000,
    });
  };
  
  const filteredItems = watchlist.filter(item => {
    if (tab === 'all') return true;
    if (tab === 'movies' && item.type === 'movie') return true;
    if (tab === 'tv' && item.type === 'tv') return true;
    return false;
  });
  
  // Sort by most recently added
  const sortedItems = [...filteredItems].sort((a, b) => b.addedAt - a.addedAt);
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
        <p className="text-neutral-400">Keep track of movies and TV shows you want to watch later</p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-neutral-800 pb-2">
        <button 
          onClick={() => setTab('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'all' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
        >
          All ({watchlist.length})
        </button>
        <button 
          onClick={() => setTab('movies')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'movies' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
        >
          Movies ({watchlist.filter(item => item.type === 'movie').length})
        </button>
        <button 
          onClick={() => setTab('tv')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'tv' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
        >
          TV Shows ({watchlist.filter(item => item.type === 'tv').length})
        </button>
      </div>
      
      {/* Watchlist grid */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedItems.map((item) => (
            <div key={`${item.type}-${item.id}`} className="relative group overflow-hidden rounded-xl bg-neutral-900">
              {/* Remove button */}
              <button 
                onClick={() => handleRemove(item.id, item.type, item.title)}
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 bg-black/60 hover:bg-red-500/80 rounded-full"
                aria-label="Remove from watchlist"
              >
                <X className="h-4 w-4 text-white" />
              </button>
              
              {/* Added Date */}
              <div className="absolute top-2 left-2 z-10 bg-black/60 rounded-md px-2 py-1 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Clock className="h-3 w-3 text-neutral-400" />
                <span className="text-neutral-200">{formatDate(item.addedAt)}</span>
              </div>
              
              <Link
                to={item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                onClick={() => window.scrollTo(0, 0)}
                className="block">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={tmdb.getPosterUrl(item.poster_path, 'w342')}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-sm font-semibold text-white line-clamp-2">{item.title}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-neutral-400 capitalize">{item.type}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Trash className="h-12 w-12 text-neutral-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Your watchlist is empty</h3>
          <p className="text-neutral-400 max-w-md">
            Add movies and TV shows to your watchlist by clicking the three dots on any poster and selecting "Add to Watchlist"
          </p>
        </div>
      )}
    </div>
  );
}
