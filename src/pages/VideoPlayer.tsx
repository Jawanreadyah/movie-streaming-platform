import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Calendar } from 'lucide-react';
import { tmdb, type TVShow, type TVEpisode } from '@/lib/tmdb';
import { setWatchProgress, trackVideoProgress, setupVideoProgressTracking } from '@/lib/utils';

export function VideoPlayer() {
  const { showId, seasonNumber, episodeNumber } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState<TVShow | null>(null);
  const [episode, setEpisode] = useState<TVEpisode | null>(null);
  const [recommendations, setRecommendations] = useState<TVShow[]>([]);
  const [similar, setSimilar] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (showId && seasonNumber && episodeNumber) {
        try {
          const [showData, episodesData, recommendationsData, similarData] = await Promise.all([
            tmdb.getTVShowDetails(parseInt(showId)),
            tmdb.getTVEpisodes(parseInt(showId), parseInt(seasonNumber)),
            tmdb.getTVRecommendations(parseInt(showId)),
            tmdb.getSimilarTVShows(parseInt(showId))
          ]);

          setShow(showData);
          setEpisode(episodesData.find(ep => ep.episode_number === parseInt(episodeNumber)) || null);
          setRecommendations(recommendationsData.slice(0, 12));
          setSimilar(similarData.slice(0, 12));

          // Track initial progress when starting to watch
          if (showData) {
            trackVideoProgress(
              parseInt(showId),
              'tv',
              showData.name,
              showData.poster_path,
              {
                seasonNumber: parseInt(seasonNumber),
                episodeNumber: parseInt(episodeNumber)
              }
            );
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [showId, seasonNumber, episodeNumber]);

  // Handle fullscreen
  useEffect(() => {
    const requestFullscreen = () => {
      const iframe = document.querySelector('iframe');
      if (iframe) {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        } else if ((iframe as any).webkitRequestFullscreen) {
          (iframe as any).webkitRequestFullscreen();
        } else if ((iframe as any).mozRequestFullScreen) {
          (iframe as any).mozRequestFullScreen();
        } else if ((iframe as any).msRequestFullscreen) {
          (iframe as any).msRequestFullscreen();
        }
      }
    };

    // Request fullscreen after a short delay to ensure iframe is loaded
    const timeoutId = setTimeout(requestFullscreen, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  function ShowCard({ item }: { item: TVShow }) {
    return (
      <Link
        to={`/tv/${item.id}`}
        onClick={() => window.scrollTo(0, 0)}
        className="group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={tmdb.getPosterUrl(item.poster_path, 'w342')}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-medium text-sm text-white line-clamp-1">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span>{item.vote_average?.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>{new Date(item.first_air_date).getFullYear()}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black/95 pt-16 backdrop-blur-3xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95 pt-16 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-8">
        <Button
          variant="ghost"
          className="text-white mb-8 hover:bg-white/10"
          onClick={() => navigate(`/tv/${showId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {show?.name}
        </Button>

        <div className="space-y-16">
          <div className="relative">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
              <iframe
                src={`https://player.autoembed.cc/embed/tv/${showId}/${seasonNumber}/${episodeNumber}?autoplay=1`}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={(e) => {
                  const iframe = e.target as HTMLIFrameElement;
                  if (iframe.contentWindow) {
                    setupVideoProgressTracking(iframe, (progress, currentTime, duration) => {
                      if (show) {
                        setWatchProgress({
                          id: parseInt(showId!),
                          type: 'tv',
                          progress,
                          currentTime,
                          duration,
                          timestamp: Date.now(),
                          title: show.name,
                          poster_path: show.poster_path,
                          episodeInfo: {
                            seasonNumber: parseInt(seasonNumber!),
                            episodeNumber: parseInt(episodeNumber!)
                          }
                        });
                      }
                    });
                  }
                }}
              />
            </div>

            {/* Episode Info */}
            {episode && (
              <div className="mt-8 bg-white/5 rounded-xl p-6 backdrop-blur-sm ring-1 ring-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {episode.episode_number}. {episode.name}
                    </h2>
                    <div className="flex items-center gap-4 text-white/60 mt-2">
                      <span>{new Date(episode.air_date).toLocaleDateString()}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span>{episode.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-white/70 mt-4">{episode.overview}</p>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">More Like This</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recommendations.map(show => (
                  <ShowCard key={show.id} item={show} />
                ))}
              </div>
            </div>
          )}

          {/* Similar Shows */}
          {similar.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Similar Shows</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {similar.map(show => (
                  <ShowCard key={show.id} item={show} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}