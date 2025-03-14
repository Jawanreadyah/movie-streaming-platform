import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Play, Info, Clock, Tag, Globe, Users, Tv } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { type TVShow, type TVSeason, type TVEpisode, type Cast, type Crew } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';
import { trackVideoProgress } from '@/lib/utils';

export function TVDetail() {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<TVShow | null>(null);
  const [seasons, setSeasons] = useState<TVSeason[]>([]);
  const [episodes, setEpisodes] = useState<Record<number, TVEpisode[]>>({});
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [credits, setCredits] = useState<{ cast: Cast[]; crew: Crew[] } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'episodes'>('overview');

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
    const fetchShow = async () => {
      if (id) {
        try {
          setLoading(true);
          setError(null);
          
          const [showData, seasonsData, creditsData] = await Promise.all([
            tmdb.getTVShowDetails(parseInt(id)),
            tmdb.getTVSeasons(parseInt(id)),
            tmdb.getTVShowCredits(parseInt(id))
          ]);
          
          setShow(showData);
          setSeasons(seasonsData);
          setCredits(creditsData);
          
          if (seasonsData.length > 0) {
            const firstSeason = seasonsData[0].season_number;
            setSelectedSeason(firstSeason);
            const episodesData = await tmdb.getTVEpisodes(parseInt(id), firstSeason);
            setEpisodes(prev => ({ ...prev, [firstSeason]: episodesData }));
          }
        } catch (error) {
          console.error('Error fetching show:', error);
          setError('Failed to load TV show details. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchShow();
  }, [id]);

  const handleSeasonChange = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    if (!episodes[seasonNumber]) {
      try {
        const episodesData = await tmdb.getTVEpisodes(parseInt(id!), seasonNumber);
        setEpisodes(prev => ({ ...prev, [seasonNumber]: episodesData }));
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    }
  };

  const handlePlayClick = () => {
    if (show) {
      // Track video progress
      trackVideoProgress(
        show.id,
        'tv',
        show.name,
        show.poster_path
      );
    
      // Remove scroll lock and allow scrolling
      setIsLocked(false);
      document.body.style.overflow = '';
      document.body.style.height = '';
      
      // Switch to episodes tab
      setActiveTab('episodes');
      
      // Scroll to episodes section
      setTimeout(() => {
        const episodesSection = document.getElementById('episodes-section');
        if (episodesSection) {
          episodesSection.scrollIntoView({ behavior: 'smooth' });
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

  if (error || !show) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 gap-4">
        <h1 className="text-2xl text-white">{error || 'TV show not found'}</h1>
        <Link to="/" className="text-blue-400 hover:text-blue-300">
          Return to Home
        </Link>
      </div>
    );
  }

  const directors = credits?.crew.filter(person => person.job === 'Director') || [];
  const mainCast = credits?.cast.slice(0, 12) || [];

  const getBentoItems = (episodes: TVEpisode[]): BentoItem[] => {
    return episodes.map(episode => ({
      episode,
      showId: show.id,
      showName: show.name,
      showPosterPath: show.poster_path
    }));
  };

  return (
    <div className={`min-h-screen ${isLocked ? 'h-screen overflow-hidden' : ''}`}>
      <div className={`relative min-h-screen flex items-end ${isLocked ? 'fixed inset-0' : ''}`}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
          <img
            src={tmdb.getBackdropUrl(show.backdrop_path, 'original')}
            alt={show.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-8 pb-12 pt-32">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-72 flex-shrink-0">
              <img
                src={tmdb.getPosterUrl(show.poster_path, 'w500')}
                alt={show.name}
                className="w-full rounded-3xl shadow-2xl ring-1 ring-white/10"
              />
            </div>

            <div className="flex-1 text-left">
              <h1 className="text-5xl font-bold text-white mb-4">{show.name}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/80 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-lg">{show.vote_average?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-lg">{new Date(show.first_air_date).getFullYear()}</span>
                </div>
                {show.episode_run_time && show.episode_run_time[0] && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    <span className="text-lg">{show.episode_run_time[0]} mins/episode</span>
                  </div>
                )}
                {show.genres && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-6 h-6" />
                    <span className="text-lg">{show.genres.map(g => g.name).join(', ')}</span>
                  </div>
                )}
                {show.number_of_seasons && (
                  <div className="flex items-center gap-2">
                    <Tv className="w-6 h-6" />
                    <span className="text-lg">{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mb-8">
                <Button 
                  onClick={handlePlayClick}
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 rounded-full px-8"
                >
                  <Play className="w-5 h-5 mr-2" fill="currentColor" />
                  Play Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 text-white hover:bg-white/20 rounded-full border-white/20 px-8"
                >
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </div>

              <p className="text-xl text-white/90 leading-relaxed max-w-3xl">{show.overview}</p>

              <div className="mt-8 space-y-4">
                {show.networks && show.networks.length > 0 && (
                  <div className="flex items-center gap-4">
                    <Globe className="w-6 h-6 text-white/60" />
                    <div>
                      <h4 className="text-white/90 font-medium">Networks</h4>
                      <p className="text-white/70">
                        {show.networks.map(n => n.name).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
                {show.type && (
                  <div className="flex items-center gap-4">
                    <Users className="w-6 h-6 text-white/60" />
                    <div>
                      <h4 className="text-white/90 font-medium">Type</h4>
                      <p className="text-white/70">{show.type}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/95 backdrop-blur-3xl min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-8">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'episodes')} className="space-y-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="episodes">Episodes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-16">
              <div className="flex gap-16">
                <div className="flex-1 space-y-16">
                  {directors.length > 0 && (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-8">Director{directors.length > 1 ? 's' : ''}</h2>
                      <div className="flex h-[400px] space-x-4">
                        <InfiniteSlider direction="vertical" duration={30}>
                          {directors.map(director => (
                            <div key={director.id} className="w-[300px] bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                              <img
                                src={tmdb.getProfileUrl(director.profile_path)}
                                alt={director.name}
                                className="w-40 h-40 rounded-2xl object-cover mx-auto mb-6 ring-2 ring-white/20"
                              />
                              <h3 className="text-2xl font-semibold text-white text-center">{director.name}</h3>
                              <p className="text-white/60 text-center mt-2 text-lg">Director</p>
                            </div>
                          ))}
                        </InfiniteSlider>
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="text-3xl font-bold text-white mb-8">Cast</h2>
                    <div className="flex h-[400px] space-x-4">
                      <InfiniteSlider direction="vertical" duration={25}>
                        {mainCast.slice(0, 6).map(actor => (
                          <div key={actor.id} className="w-[300px] bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                            <img
                              src={tmdb.getProfileUrl(actor.profile_path)}
                              alt={actor.name}
                              className="w-40 h-40 rounded-2xl object-cover mx-auto mb-6 ring-2 ring-white/20"
                            />
                            <h3 className="text-2xl font-semibold text-white text-center">{actor.name}</h3>
                            <p className="text-white/60 text-center mt-2 text-lg">{actor.character}</p>
                          </div>
                        ))}
                      </InfiniteSlider>
                      <InfiniteSlider direction="vertical" reverse duration={30}>
                        {mainCast.slice(6).map(actor => (
                          <div key={actor.id} className="w-[300px] bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                            <img
                              src={tmdb.getProfileUrl(actor.profile_path)}
                              alt={actor.name}
                              className="w-40 h-40 rounded-2xl object-cover mx-auto mb-6 ring-2 ring-white/20"
                            />
                            <h3 className="text-2xl font-semibold text-white text-center">{actor.name}</h3>
                            <p className="text-white/60 text-center mt-2 text-lg">{actor.character}</p>
                          </div>
                        ))}
                      </InfiniteSlider>
                    </div>
                  </div>
                </div>

                <div className="w-px bg-white/20 self-stretch" />

                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-8">Show Details</h2>
                  <div className="space-y-8 bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                    <div>
                      <h3 className="text-2xl text-white/90 mb-4">Synopsis</h3>
                      <p className="text-white/70 leading-relaxed text-lg">{show.overview}</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Tag className="w-6 h-6 text-white/60" />
                        <div>
                          <h4 className="text-white/90 font-medium mb-1">Genres</h4>
                          <p className="text-white/70">
                            {show.genres?.map(g => g.name).join(', ')}
                          </p>
                        </div>
                      </div>
                      {show.networks && show.networks.length > 0 && (
                        <div className="flex items-center gap-4">
                          <Globe className="w-6 h-6 text-white/60" />
                          <div>
                            <h4 className="text-white/90 font-medium mb-1">Networks</h4>
                            <p className="text-white/70">
                              {show.networks.map(n => n.name).join(', ')}
                            </p>
                          </div>
                        </div>
                      )}
                      {show.type && (
                        <div className="flex items-center gap-4">
                          <Users className="w-6 h-6 text-white/60" />
                          <div>
                            <h4 className="text-white/90 font-medium mb-1">Type</h4>
                            <p className="text-white/70">{show.type}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="episodes">
              <div id="episodes-section">
                <Tabs 
                  defaultValue={selectedSeason.toString()} 
                  className="w-full"
                  onValueChange={(value) => handleSeasonChange(parseInt(value))}
                >
                  <TabsList className="w-full h-auto flex-wrap">
                    {seasons.map((season) => (
                      <TabsTrigger
                        key={season.season_number}
                        value={season.season_number.toString()}
                        className="flex-1"
                      >
                        Season {season.season_number}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {seasons.map((season) => (
                    <TabsContent
                      key={season.season_number}
                      value={season.season_number.toString()}
                    >
                      {episodes[season.season_number] && (
                        <BentoGrid items={getBentoItems(episodes[season.season_number])} />
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}