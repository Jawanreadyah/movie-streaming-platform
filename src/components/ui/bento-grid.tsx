import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';
import { type TVEpisode } from '@/lib/tmdb';

export interface BentoItem {
  episode: TVEpisode;
  showId: number;
  showName: string;
  showPosterPath: string;
}

interface BentoGridProps {
  items: BentoItem[];
}

export function BentoGrid({ items }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.episode.id}
          to={`/tv/${item.showId}/season/${item.episode.season_number}/episode/${item.episode.episode_number}`}
          className="group relative aspect-video overflow-hidden rounded-xl bg-neutral-900 transition-all duration-300 hover:ring-2 hover:ring-white/20"
        >
          <div className="absolute inset-0">
            {item.episode.still_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w780${item.episode.still_path}`}
                alt={item.episode.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/w780${item.showPosterPath}`}
                alt={item.showName}
                className="h-full w-full object-cover opacity-50 transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <span>Episode {item.episode.episode_number}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span>{item.episode.vote_average.toFixed(1)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(item.episode.air_date).toLocaleDateString()}</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-white group-hover:text-white/90">
                {item.episode.name}
              </h3>
              <p className="line-clamp-2 text-sm text-white/70 group-hover:text-white/80">
                {item.episode.overview}
              </p>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/10 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}