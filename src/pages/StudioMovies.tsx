import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tmdb, type Movie, type TVShow } from '@/lib/tmdb';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MovieCard, TVShowCard } from '@/components/ui/movie-card';

// Import studio-specific content
import { MCU_MOVIE_IDS, MARVEL_TV_SHOWS, type MarvelTVShowsState } from '@/lib/studios/marvel';
import { STAR_WARS_MOVIES, STAR_WARS_TV_SHOWS, type StarWarsMoviesState, type StarWarsTVShowsState } from '@/lib/studios/star-wars';
import { DC_MOVIES, DC_TV_SHOWS, type DCMoviesState, type DCTVShowsState } from '@/lib/studios/dc';
import { WARNER_MOVIES, WARNER_TV_SHOWS, type WarnerMoviesState, type WarnerTVShowsState } from '@/lib/studios/warner';
import { UNIVERSAL_MOVIES, UNIVERSAL_TV_SHOWS, type UniversalMoviesState, type UniversalTVShowsState } from '@/lib/studios/universal';
import { NICKELODEON_MOVIES, NICKELODEON_TV_SHOWS, type NickelodeonMoviesState, type NickelodeonTVShowsState } from '@/lib/studios/nickelodeon';
import { PIXAR_MOVIES, type PixarMoviesState } from '@/lib/studios/pixar';

function MoviesSection({ title, movies }: { title: string; movies: Movie[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

function TVShowsSection({ title, shows }: { title: string; shows: TVShow[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {shows.map((show) => (
          <TVShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}

export function StudioMovies() {
  const { studio } = useParams<{ studio: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [starWarsMovies, setStarWarsMovies] = useState<StarWarsMoviesState>({
    original: [],
    prequel: [],
    sequel: [],
    spinoff: [],
  });
  const [dcMovies, setDcMovies] = useState<DCMoviesState>({
    early: [],
    dceu: [],
    batman: [],
    animated: [],
  });
  const [warnerMovies, setWarnerMovies] = useState<WarnerMoviesState>({
    harryPotter: [],
    matrix: [],
    lotr: [],
    monsterverse: [],
    classics: [],
    modern: [],
  });
  const [universalMovies, setUniversalMovies] = useState<UniversalMoviesState>({
    jurassicPark: [],
    fastSaga: [],
    despicableMe: [],
    classics: [],
    modern: [],
  });
  const [nickelodeonMovies, setNickelodeonMovies] = useState<NickelodeonMoviesState>({
    animated: [],
    liveAction: [],
  });
  const [pixarMovies, setPixarMovies] = useState<PixarMoviesState>({
    toyStory: [],
    classics: [],
    modern: [],
    cars: [],
  });
  const [tvShows, setTvShows] = useState<MarvelTVShowsState>({
    abc: [],
    netflix: [],
    hulu: [],
    disney: [],
  });
  const [starWarsTVShows, setStarWarsTVShows] = useState<StarWarsTVShowsState>({
    animated: [],
    liveAction: [],
  });
  const [dcTVShows, setDcTVShows] = useState<DCTVShowsState>({
    classic: [],
    arrowverse: [],
    modern: [],
    animated: [],
  });
  const [warnerTVShows, setWarnerTVShows] = useState<WarnerTVShowsState>({
    hbo: [],
    animation: [],
    drama: [],
  });
  const [universalTVShows, setUniversalTVShows] = useState<UniversalTVShowsState>({
    drama: [],
    comedy: [],
  });
  const [nickelodeonTVShows, setNickelodeonTVShows] = useState<NickelodeonTVShowsState>({
    animated: [],
    liveAction: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (studio === 'marvel') {
          const [movieResults, abcShows, netflixShows, huluShows, disneyShows] = await Promise.all([
            Promise.all(
              MCU_MOVIE_IDS.map(id => 
                tmdb.getMovieDetails(id).catch(err => {
                  console.error(`Error fetching movie ${id}:`, err);
                  return null;
                })
              )
            ),
            tmdb.getTVShowsByIds(MARVEL_TV_SHOWS.abc),
            tmdb.getTVShowsByIds(MARVEL_TV_SHOWS.netflix),
            tmdb.getTVShowsByIds(MARVEL_TV_SHOWS.hulu),
            tmdb.getTVShowsByIds(MARVEL_TV_SHOWS.disney),
          ]);

          const validMovies = movieResults.filter((movie): movie is Movie => movie !== null);
          validMovies.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
          
          setMovies(validMovies);
          setTvShows({
            abc: abcShows,
            netflix: netflixShows,
            hulu: huluShows,
            disney: disneyShows,
          });
        } else if (studio === 'star-wars') {
          const [original, prequel, sequel, spinoff, animated, liveAction] = await Promise.all([
            tmdb.getMoviesByIds(STAR_WARS_MOVIES.original),
            tmdb.getMoviesByIds(STAR_WARS_MOVIES.prequel),
            tmdb.getMoviesByIds(STAR_WARS_MOVIES.sequel),
            tmdb.getMoviesByIds(STAR_WARS_MOVIES.spinoff),
            tmdb.getTVShowsByIds(STAR_WARS_TV_SHOWS.animated),
            tmdb.getTVShowsByIds(STAR_WARS_TV_SHOWS.liveAction),
          ]);

          setStarWarsMovies({
            original,
            prequel,
            sequel,
            spinoff,
          });
          setStarWarsTVShows({
            animated,
            liveAction,
          });
        } else if (studio === 'dc') {
          const [early, dceu, batman, animated, classic, arrowverse, modern, animatedTV] = await Promise.all([
            tmdb.getMoviesByIds(DC_MOVIES.early),
            tmdb.getMoviesByIds(DC_MOVIES.dceu),
            tmdb.getMoviesByIds(DC_MOVIES.batman),
            tmdb.getMoviesByIds(DC_MOVIES.animated),
            tmdb.getTVShowsByIds(DC_TV_SHOWS.classic),
            tmdb.getTVShowsByIds(DC_TV_SHOWS.arrowverse),
            tmdb.getTVShowsByIds(DC_TV_SHOWS.modern),
            tmdb.getTVShowsByIds(DC_TV_SHOWS.animated),
          ]);

          setDcMovies({
            early,
            dceu,
            batman,
            animated,
          });
          setDcTVShows({
            classic,
            arrowverse,
            modern,
            animated: animatedTV,
          });
        } else if (studio === 'warner-bros') {
          const [
            harryPotter,
            matrix,
            lotr,
            monsterverse,
            classics,
            modern,
            hbo,
            animation,
            drama
          ] = await Promise.all([
            tmdb.getMoviesByIds(WARNER_MOVIES.franchises.harryPotter),
            tmdb.getMoviesByIds(WARNER_MOVIES.franchises.matrix),
            tmdb.getMoviesByIds(WARNER_MOVIES.franchises.lotr),
            tmdb.getMoviesByIds(WARNER_MOVIES.franchises.monsterverse),
            tmdb.getMoviesByIds(WARNER_MOVIES.classics),
            tmdb.getMoviesByIds(WARNER_MOVIES.modern),
            tmdb.getTVShowsByIds(WARNER_TV_SHOWS.hbo),
            tmdb.getTVShowsByIds(WARNER_TV_SHOWS.animation),
            tmdb.getTVShowsByIds(WARNER_TV_SHOWS.drama),
          ]);

          setWarnerMovies({
            harryPotter,
            matrix,
            lotr,
            monsterverse,
            classics,
            modern,
          });
          setWarnerTVShows({
            hbo,
            animation,
            drama,
          });
        } else if (studio === 'universal') {
          const [
            jurassicPark,
            fastSaga,
            despicableMe,
            classics,
            modern,
            drama,
            comedy
          ] = await Promise.all([
            tmdb.getMoviesByIds(UNIVERSAL_MOVIES.jurassicPark),
            tmdb.getMoviesByIds(UNIVERSAL_MOVIES.fastSaga),
            tmdb.getMoviesByIds(UNIVERSAL_MOVIES.despicableMe),
            tmdb.getMoviesByIds(UNIVERSAL_MOVIES.classics),
            tmdb.getMoviesByIds(UNIVERSAL_MOVIES.modern),
            tmdb.getTVShowsByIds(UNIVERSAL_TV_SHOWS.drama),
            tmdb.getTVShowsByIds(UNIVERSAL_TV_SHOWS.comedy),
          ]);

          setUniversalMovies({
            jurassicPark,
            fastSaga,
            despicableMe,
            classics,
            modern,
          });
          setUniversalTVShows({
            drama,
            comedy,
          });
        } else if (studio === 'nickelodeon') {
          const [
            animatedMovies,
            liveActionMovies,
            animatedShows,
            liveActionShows
          ] = await Promise.all([
            tmdb.getMoviesByIds(NICKELODEON_MOVIES.animated),
            tmdb.getMoviesByIds(NICKELODEON_MOVIES.liveAction),
            tmdb.getTVShowsByIds(NICKELODEON_TV_SHOWS.animated),
            tmdb.getTVShowsByIds(NICKELODEON_TV_SHOWS.liveAction),
          ]);

          setNickelodeonMovies({
            animated: animatedMovies,
            liveAction: liveActionMovies,
          });
          setNickelodeonTVShows({
            animated: animatedShows,
            liveAction: liveActionShows,
          });
        } else if (studio === 'pixar') {
          const [
            toyStory,
            classics,
            modern,
            cars
          ] = await Promise.all([
            tmdb.getMoviesByIds(PIXAR_MOVIES.toyStory),
            tmdb.getMoviesByIds(PIXAR_MOVIES.classics),
            tmdb.getMoviesByIds(PIXAR_MOVIES.modern),
            tmdb.getMoviesByIds(PIXAR_MOVIES.cars),
          ]);

          setPixarMovies({
            toyStory,
            classics,
            modern,
            cars,
          });
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [studio]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const validStudios = ['marvel', 'star-wars', 'dc', 'warner-bros', 'universal', 'nickelodeon', 'pixar'];
  if (!studio || !validStudios.includes(studio)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-white">Available Studios:</h1>
        <div className="flex gap-4 flex-wrap justify-center">
          {validStudios.map((s) => (
            <Link
              key={s}
              to={`/studio/${s}`}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
            >
              {s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const getStudioTitle = () => {
    switch (studio) {
      case 'marvel':
        return 'Marvel Cinematic Universe';
      case 'star-wars':
        return 'Star Wars Universe';
      case 'dc':
        return 'DC Universe';
      case 'warner-bros':
        return 'Warner Bros. Entertainment';
      case 'universal':
        return 'Universal Pictures';
      case 'nickelodeon':
        return 'Nickelodeon';
      case 'pixar':
        return 'Pixar Animation Studios';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-black/90 relative">
      <DotPattern
        className="fixed inset-0 w-full h-full [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        cx={1}
        cy={1}
        cr={1}
      />
      
      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-4xl font-bold text-white mb-12">
            {getStudioTitle()}
          </h1>
          
          <Tabs defaultValue="movies" className="space-y-8">
            <TabsList className="bg-white/10 border border-white/20">
              <TabsTrigger value="movies" className="data-[state=active]:bg-white data-[state=active]:text-black">Movies</TabsTrigger>
              {studio !== 'pixar' && (
                <TabsTrigger value="tv" className="data-[state=active]:bg-white data-[state=active]:text-black">TV Shows</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="movies" className="space-y-16">
              {studio === 'marvel' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
              
              {studio === 'star-wars' && (
                <>
                  <MoviesSection title="Original Trilogy" movies={starWarsMovies.original} />
                  <MoviesSection title="Prequel Trilogy" movies={starWarsMovies.prequel} />
                  <MoviesSection title="Sequel Trilogy" movies={starWarsMovies.sequel} />
                  <MoviesSection title="Spin -Offs & Standalone Films" movies={starWarsMovies.spinoff} />
                </>
              )}

              {studio === 'dc' && (
                <>
                  <MoviesSection title="Early & Standalone Films" movies={dcMovies.early} />
                  <MoviesSection title="DC Extended Universe (DCEU)" movies={dcMovies.dceu} />
                  <MoviesSection title="The Batman & Joker Saga" movies={dcMovies.batman} />
                  <MoviesSection title="Animated Films" movies={dcMovies.animated} />
                </>
              )}

              {studio === 'warner-bros' && (
                <>
                  <MoviesSection title="Harry Potter Saga" movies={warnerMovies.harryPotter} />
                  <MoviesSection title="The Matrix Series" movies={warnerMovies.matrix} />
                  <MoviesSection title="Middle-earth Saga" movies={warnerMovies.lotr} />
                  <MoviesSection title="MonsterVerse" movies={warnerMovies.monsterverse} />
                  <MoviesSection title="Classic Films" movies={warnerMovies.classics} />
                  <MoviesSection title="Modern Masterpieces" movies={warnerMovies.modern} />
                </>
              )}

              {studio === 'universal' && (
                <>
                  <MoviesSection title="Jurassic Park Saga" movies={universalMovies.jurassicPark} />
                  <MoviesSection title="The Fast Saga" movies={universalMovies.fastSaga} />
                  <MoviesSection title="Despicable Me Universe" movies={universalMovies.despicableMe} />
                  <MoviesSection title="Classic Films" movies={universalMovies.classics} />
                  <MoviesSection title="Modern Hits" movies={universalMovies.modern} />
                </>
              )}

              {studio === 'nickelodeon' && (
                <>
                  <MoviesSection title="Animated Movies" movies={nickelodeonMovies.animated} />
                  <MoviesSection title="Live-Action Films" movies={nickelodeonMovies.liveAction} />
                </>
              )}

              {studio === 'pixar' && (
                <>
                  <MoviesSection title="Toy Story Saga" movies={pixarMovies.toyStory} />
                  <MoviesSection title="Classic Films" movies={pixarMovies.classics} />
                  <MoviesSection title="Modern Masterpieces" movies={pixarMovies.modern} />
                  <MoviesSection title="Cars Trilogy" movies={pixarMovies.cars} />
                </>
              )}
            </TabsContent>

            <TabsContent value="tv" className="space-y-16">
              {studio === 'marvel' && (
                <>
                  <TVShowsSection title="Disney+ Series" shows={tvShows.disney} />
                  <TVShowsSection title="Netflix Series" shows={tvShows.netflix} />
                  <TVShowsSection title="ABC Network Series" shows={tvShows.abc} />
                  <TVShowsSection title="Hulu & Freeform Series" shows={tvShows.hulu} />
                </>
              )}
              
              {studio === 'star-wars' && (
                <>
                  <TVShowsSection title="Live-Action Series" shows={starWarsTVShows.liveAction} />
                  <TVShowsSection title="Animated Series" shows={starWarsTVShows.animated} />
                </>
              )}

              {studio === 'dc' && (
                <>
                  <TVShowsSection title="Classic Series" shows={dcTVShows.classic} />
                  <TVShowsSection title="Arrowverse" shows={dcTVShows.arrowverse} />
                  <TVShowsSection title="Modern Series" shows={dcTVShows.modern} />
                  <TVShowsSection title="Animated Series" shows={dcTVShows.animated} />
                </>
              )}

              {studio === 'warner-bros' && (
                <>
                  <TVShowsSection title="HBO Originals" shows={warnerTVShows.hbo} />
                  <TVShowsSection title="Animation" shows={warnerTVShows.animation} />
                  <TVShowsSection title="Drama Series" shows={warnerTVShows.drama} />
                </>
              )}

              {studio === 'universal' && (
                <>
                  <TVShowsSection title="Drama Series" shows={universalTVShows.drama} />
                  <TVShowsSection title="Comedy Series" shows={universalTVShows.comedy} />
                </>
              )}

              {studio === 'nickelodeon' && (
                <>
                  <TVShowsSection title="Animated Series" shows={nickelodeonTVShows.animated} />
                  <TVShowsSection title="Live-Action Series" shows={nickelodeonTVShows.liveAction} />
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}