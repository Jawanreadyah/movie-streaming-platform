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