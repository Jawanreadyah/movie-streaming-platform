import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface WatchProgress {
  id: number;
  type: 'movie' | 'tv';
  progress: number;
  timestamp: number;
  title: string;
  poster_path: string;
  duration?: number;
  currentTime?: number;
  episodeInfo?: {
    seasonNumber: number;
    episodeNumber: number;
  };
}

export function getWatchProgress(): WatchProgress[] {
  const progress = localStorage.getItem('watchProgress');
  if (!progress) return [];
  
  const items = JSON.parse(progress);
  
  // Group TV show episodes by show ID and keep only the latest episode
  const groupedItems = items.reduce((acc: WatchProgress[], item: WatchProgress) => {
    if (item.type === 'movie') {
      acc.push(item);
    } else {
      // For TV shows, check if we already have an entry
      const existingIndex = acc.findIndex(i => i.id === item.id && i.type === 'tv');
      if (existingIndex === -1) {
        // No existing entry, add this one
        acc.push(item);
      } else if (item.timestamp > acc[existingIndex].timestamp) {
        // Replace with more recent episode
        acc[existingIndex] = item;
      }
    }
    return acc;
  }, []);

  return groupedItems;
}

export function setWatchProgress(item: WatchProgress) {
  const currentProgress = getWatchProgress();
  const existingIndex = currentProgress.findIndex(p => 
    p.id === item.id && 
    p.type === item.type && 
    (item.type === 'movie' || 
      (item.episodeInfo?.seasonNumber === p.episodeInfo?.seasonNumber && 
       item.episodeInfo?.episodeNumber === p.episodeInfo?.episodeNumber))
  );

  // Calculate progress percentage based on current time and duration
  const progressPercentage = item.currentTime && item.duration
    ? Math.round((item.currentTime / item.duration) * 100)
    : item.progress;
  
  if (existingIndex !== -1) {
    // Update existing item
    currentProgress[existingIndex] = {
      ...item,
      progress: progressPercentage,
      timestamp: Date.now()
    };
  } else {
    // Add new item at the beginning
    currentProgress.unshift({
      ...item,
      progress: progressPercentage,
      timestamp: Date.now()
    });
  }
  
  // Keep only the last 20 items
  const updatedProgress = currentProgress.slice(0, 20);
  localStorage.setItem('watchProgress', JSON.stringify(updatedProgress));
}

export function trackVideoProgress(id: number, type: 'movie' | 'tv', title: string, poster_path: string, episodeInfo?: { seasonNumber: number; episodeNumber: number }) {
  // Initial progress when starting to watch
  setWatchProgress({
    id,
    type,
    progress: 0,
    timestamp: Date.now(),
    title,
    poster_path,
    episodeInfo
  });
}

/**
 * Returns the appropriate typography class for a movie based on its genre
 */
export function getMovieTypographyClass(genreIds: number[]): string {
  // Common genre IDs from TMDB
  const ACTION_GENRES = [28, 10759]; // Action, Action & Adventure
  const SCIFI_GENRES = [878, 10765]; // Science Fiction, Sci-Fi & Fantasy
  const HORROR_GENRES = [27, 9648]; // Horror, Mystery
  const DRAMA_GENRES = [18, 10768]; // Drama, War
  const ANIMATION_GENRES = [16, 10762]; // Animation, Kids
  const FANTASY_GENRES = [14, 10765]; // Fantasy, Sci-Fi & Fantasy
  
  // Check if the movie has any of these genres
  if (genreIds.some(id => ACTION_GENRES.includes(id))) {
    return 'action-title';
  } else if (genreIds.some(id => SCIFI_GENRES.includes(id))) {
    return 'scifi-title';
  } else if (genreIds.some(id => HORROR_GENRES.includes(id))) {
    return 'horror-title';
  } else if (genreIds.some(id => DRAMA_GENRES.includes(id))) {
    return 'drama-title';
  } else if (genreIds.some(id => ANIMATION_GENRES.includes(id))) {
    return 'animation-title';
  } else if (genreIds.some(id => FANTASY_GENRES.includes(id))) {
    return 'fantasy-title';
  }
  
  // Default to cinematic style if no specific genre match
  return 'cinematic-title';
}

// Add event listener for postMessage communication
export function setupVideoProgressTracking(iframe: HTMLIFrameElement, onProgress: (progress: number, currentTime: number, duration: number) => void) {
  const handleMessage = (event: MessageEvent) => {
    if (event.data && typeof event.data === 'object') {
      // Check for both progress and duration information
      if ('videoDuration' in event.data && 'currentTime' in event.data) {
        const duration = event.data.videoDuration;
        const currentTime = event.data.currentTime;
        const progress = currentTime > 0 && duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
        onProgress(progress, currentTime, duration);
      }
    }
  };

  window.addEventListener('message', handleMessage);

  // Return cleanup function
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}

// Watchlist Types and Utilities
export type WatchlistItem = {
  id: number;
  title: string;
  poster_path: string;
  type: 'movie' | 'tv';
  addedAt: number; // timestamp
};

export type WatchlistItemInput = Omit<WatchlistItem, 'addedAt'>;

export const getWatchlist = (): WatchlistItem[] => {
  const watchlist = localStorage.getItem('watchlist');
  return watchlist ? JSON.parse(watchlist) : [];
};

export const addToWatchlist = (item: WatchlistItemInput): WatchlistItem[] => {
  const watchlist = getWatchlist();
  // Check if item already exists in watchlist
  const exists = watchlist.some(i => i.id === item.id && i.type === item.type);
  if (!exists) {
    const newItem: WatchlistItem = { ...item, addedAt: Date.now() };
    const newWatchlist = [...watchlist, newItem];
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    return newWatchlist;
  }
  return watchlist;
};

export const removeFromWatchlist = (id: number, type: 'movie' | 'tv'): WatchlistItem[] => {
  const watchlist = getWatchlist();
  const newWatchlist = watchlist.filter(item => !(item.id === id && item.type === type));
  localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
  return newWatchlist;
};

export const isInWatchlist = (id: number, type: 'movie' | 'tv'): boolean => {
  const watchlist = getWatchlist();
  return watchlist.some(item => item.id === id && item.type === type);
};