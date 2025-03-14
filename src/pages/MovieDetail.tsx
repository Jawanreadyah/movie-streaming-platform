import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Play, Info, Clock, Tag, Globe, Users } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { type Movie, type Cast, type Crew } from '@/lib/types';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { Button } from '@/components/ui/button';
import { setWatchProgress, trackVideoProgress, setupVideoProgressTracking } from '@/lib/utils';

export function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<{ cast: Cast[]; crew: Crew[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Add scroll lock when component mounts
    if (isLocked) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    }
    
    // Cleanup function to remove scroll lock when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isLocked]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (id) {
        try {
          setLoading(true);
          setError(null);
          
          const [movieData, creditsData] = await Promise.all([
            tmdb.getMovieDetails(parseInt(id)),
            tmdb.getMovieCredits(parseInt(id))
          ]);
          
          setMovie(movieData);
          setCredits(creditsData);

          const [recommendationsData, similarData] = await Promise.all([
            tmdb.getMovieRecommendations(parseInt(id)),
            tmdb.getSimilarMovies(parseInt(id))
          ]);
          
          setRecommendations(recommendationsData.slice(0, 12));
          setSimilar(similarData.slice(0, 12));
        } catch (error) {
          console.error('Error fetching movie:', error);
          setError('Failed to load movie details. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMovie();
  }, [id]);

  const handlePlayClick = () => {
    if (movie) {
      trackVideoProgress(
        movie.id,
        'movie',
        movie.title,
        movie.poster_path
      );

      // Remove scroll lock and allow scrolling
      setIsLocked(false);
      document.body.style.overflow = '';
      document.body.style.height = '';

      setTimeout(() => {
        const videoSection = document.getElementById('video-section');
        if (videoSection) {
          videoSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 gap-4">
        <h1 className="text-2xl text-white">{error || 'Movie not found'}</h1>
        <Link to="/" className="text-blue-400 hover:text-blue-300">
          Return to Home
        </Link>
      </div>
    );
  }

  const directors = credits?.crew.filter(person => person.job === 'Director') || [];
  const mainCast = credits?.cast.slice(0, 12) || [];

  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
          <img
            src={tmdb.getBackdropUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-8 md:pb-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
            <div className="w-48 md:w-72 flex-shrink-0">
              <img
                src={tmdb.getPosterUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-full rounded-2xl md:rounded-3xl shadow-2xl ring-1 ring-white/10"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-white/80 mb-6 md:mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-5 md:w-6 h-5 md:h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-base md:text-lg">{movie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 md:w-6 h-5 md:h-6" />
                  <span className="text-base md:text-lg">{new Date(movie.release_date).getFullYear()}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 md:w-6 h-5 md:h-6" />
                    <span className="text-base md:text-lg">{movie.runtime} minutes</span>
                  </div>
                )}
              </div>

              {movie.genres && (
                <div className="flex items-center justify-center md:justify-start gap-2 mb-6 md:mb-8 flex-wrap">
                  <Tag className="w-5 md:w-6 h-5 md:h-6 text-white/60" />
                  <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                    {movie.genres.map(genre => (
                      <span key={genre.id} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 md:gap-4 justify-center md:justify-start mb-6 md:mb-8">
                <Button 
                  onClick={handlePlayClick}
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 rounded-full px-6 md:px-8"
                >
                  <Play className="w-5 h-5 mr-2" fill="currentColor" />
                  Play Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 text-white hover:bg-white/20 rounded-full border-white/20 px-6 md:px-8"
                >
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </div>

              <p className="text-base md:text-xl text-white/90 leading-relaxed max-w-3xl">{movie.overview}</p>

              <div className="mt-6 md:mt-8 space-y-4">
                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                  <div className="flex items-center gap-4">
                    <Globe className="w-5 md:w-6 h-5 md:h-6 text-white/60" />
                    <div>
                      <h4 className="text-white/90 font-medium">Languages</h4>
                      <p className="text-white/70">
                        {movie.spoken_languages.map(l => l.english_name).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div className="flex items-center gap-4">
                    <Users className="w-5 md:w-6 h-5 md:h-6 text-white/60" />
                    <div>
                      <h4 className="text-white/90 font-medium">Production</h4>
                      <p className="text-white/70">
                        {movie.production_companies.map(c => c.name).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="video-section" className="bg-black/95 backdrop-blur-3xl py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
            <iframe
              src={`https://embed.su/embed/movie/${movie.id}`}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={(e) => {
                const iframe = e.target as HTMLIFrameElement;
                if (iframe.contentWindow) {
                  setupVideoProgressTracking(iframe, (progress, currentTime, duration) => {
                    setWatchProgress({
                      id: movie.id,
                      type: 'movie',
                      progress,
                      currentTime,
                      duration,
                      timestamp: Date.now(),
                      title: movie.title,
                      poster_path: movie.poster_path
                    });
                  });
                }
              }}
            />
          </div>

          {recommendations.length > 0 && (
            <div className="mt-8 md:mt-16">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">More Like This</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {recommendations.map(movie => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={tmdb.getPosterUrl(movie.poster_path, 'w342')}
                        alt={movie.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-black/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-medium text-sm text-white line-clamp-1">{movie.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span>{movie.vote_average?.toFixed(1)}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {similar.length > 0 && (
            <div className="mt-8 md:mt-16">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">Similar Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {similar.map(movie => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={tmdb.getPosterUrl(movie.poster_path, 'w342')}
                        alt={movie.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-black/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-medium text-sm text-white line-clamp-1">{movie.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span>{movie.vote_average?.toFixed(1)}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-sm py-8 md:py-16 rounded-t-4xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <div className="flex-1 space-y-8 lg:space-y-16">
              {directors.length > 0 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Director{directors.length > 1 ? 's' : ''}</h2>
                  <div className="flex h-[300px] md:h-[400px] space-x-4">
                    <InfiniteSlider direction="vertical" duration={30}>
                      {directors.map(director => (
                        <div key={director.id} className="w-[250px] md:w-[300px] bg-white/5 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 border border-white/10">
                          <img
                            src={tmdb.getProfileUrl(director.profile_path)}
                            alt={director.name}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-xl md:rounded-2xl object-cover mx-auto mb-6 ring-2 ring-white/20"
                          />
                          <h3 className="text-xl md:text-2xl font-semibold text-white text-center">{director.name}</h3>
                          <p className="text-white/60 text-center mt-2 text-base md:text-lg">Director</p>
                        </div>
                      ))}
                    </InfiniteSlider>
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Cast</h2>
                <div className="flex h-[300px] md:h-[400px] space-x-4">
                  <InfiniteSlider direction="vertical" duration={25}>
                    {mainCast.slice(0, 6).map(actor => (
                      <div key={actor.id} className="w-[250px] md:w-[300px] bg-white/5 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 border border-white/10">
                        <img
                          src={tmdb.getProfileUrl(actor.profile_path)}
                          alt={actor.name}
                          className="w-32 h-32 md:w-40 md:h-40 rounded-xl md:rounded-2xl object-cover mx-auto mb-6 ring-2 ring-white/20"
                        />
                        <h3 className="text-xl md:text-2xl font-semibold text-white text-center">{actor.name}</h3>
                        <p className="text-white/60 text-center mt-2 text-base md:text-lg">{actor.character}</p>
                      </div>
                    ))}
                  </InfiniteSlider>
                  <InfiniteSlider direction="vertical" reverse duration={30}>
                    {mainCast.slice(6).map(actor => (
                      <div key={actor.id} className="w-[250px] md:w-[300px] bg-white/5 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 border border-white/10">
                        <img
                          src={tmdb.getProfileUrl(actor.profile_path)}
                          alt={actor.name}
                          className="w-32 h-32 md:w-40 md:h-40 rounded-xl md:rounded-2xl object-cover mx-auto mb-6 ring-2 ring-white/20"
                        />
                        <h3 className="text-xl md:text-2xl font-semibold text-white text-center">{actor.name}</h3>
                        <p className="text-white/60 text-center mt-2 text-base md:text-lg">{actor.character}</p>
                      </div>
                    ))}
                  </InfiniteSlider>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-px bg-white/20 self-stretch" />

            <div className="lg:w-[400px]">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Movie Details</h2>
              <div className="space-y-8 bg-white/5 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/10">
                <div>
                  <h3 className="text-xl md:text-2xl text-white/90 mb-4">Synopsis</h3>
                  <p className="text-white/70 leading-relaxed text-base md:text-lg">{movie.overview}</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Tag className="w-5 md:w-6 h-5 md:h-6 text-white/60" />
                    <div>
                      <h4 className="text-white/90 font-medium mb-1">Genres</h4>
                      <p className="text-white/70">
                        {movie.genres?.map(g => g.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Globe className="w-5 md:w-6 h-5 md:h-6 text-white/60" />
                    <div>
                      <h4 className="text-white/90 font-medium mb-1">Languages</h4>
                      <p className="text-white/70">
                        {movie.spoken_languages?.map(l => l.english_name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Users className="w-5 md:w-6 h-5 md:h-6 text-white/60" />
                    <div>
                      <h4 className="text-white/90 font-medium mb-1">Production Companies</h4>
                      <p className="text-white/70">
                        {movie.production_companies?.map(c => c.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}