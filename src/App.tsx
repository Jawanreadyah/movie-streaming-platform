import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DotPattern } from "@/components/ui/dot-pattern";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Home, Search, Bookmark, UserCog, Settings, LogOut, CreditCard, HelpCircle, Film, Tv, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { MovieBanner } from "@/components/ui/movie-banner";
import { CompanyShowcase } from "@/components/ui/company-showcase";
import { MovieSection } from "@/components/ui/movie-section";
import { ContinueWatching } from "@/components/ui/continue-watching";
import { TopContent } from "@/components/ui/top-content";
import { MovieDetail } from "@/pages/MovieDetail";
import { TVDetail } from "@/pages/TVDetail";
import { VideoPlayer } from "@/pages/VideoPlayer";
import { StudioMovies } from "@/pages/StudioMovies";
import { Search as SearchPage } from "@/pages/Search";
import { FAQ } from "@/pages/FAQ";
import { ComingSoon } from "@/pages/ComingSoon";
import { Watchlist } from "@/pages/Watchlist";
import { Footer } from "@/components/ui/footer";
import { tmdb } from "@/lib/tmdb";
import { type Movie, type Genre, type TVShow } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { getWatchProgress, type WatchProgress } from "@/lib/utils";
import { PricingSectionDemo } from "@/components/ui/pricing-demo";
import { MovieBannerSlider } from "@/components/ui/movie-banner-slider";
import { Button } from "@/components/ui/button";

function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [indianMovies, setIndianMovies] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [
        moviesData,
        genresData,
        trendingData,
        tvShowsData,
        trendingTVData,
        topRatedData,
        indianMoviesData
      ] = await Promise.all([
        tmdb.getNowPlaying(),
        tmdb.getGenres(),
        tmdb.getTrending(),
        tmdb.getPopularTVShows(),
        tmdb.getTrendingTVShows(),
        tmdb.getTopRatedMovies(),
        tmdb.getIndianMovies()
      ]);
      setMovies(moviesData);
      setGenres(genresData);
      setTrending(trendingData);
      setTvShows(tvShowsData);
      setTrendingTVShows(trendingTVData);
      setTopRatedMovies(topRatedData);
      setIndianMovies(indianMoviesData);
    };
    fetchData();

    // Get continue watching data
    const watchProgress = getWatchProgress();
    setContinueWatching(watchProgress);

    // Set up an interval to check for new watch progress
    const interval = setInterval(() => {
      const latestProgress = getWatchProgress();
      setContinueWatching(latestProgress);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Create a Set of movie IDs that are already shown in the top banner
  const topBannerMovieIds = new Set(movies.map(movie => movie.id));

  // Filter out movies that are already shown in the top banner
  const uniqueMoviesForSlider = [...trending, ...topRatedMovies, ...indianMovies]
    .filter(movie => !topBannerMovieIds.has(movie.id))
    // Remove duplicates by creating a Map with movie.id as key
    .reduce((unique, movie) => {
      if (!unique.has(movie.id)) {
        unique.set(movie.id, movie);
      }
      return unique;
    }, new Map());

  const uniqueMoviesList = Array.from(uniqueMoviesForSlider.values());

  return (
    <>
      {movies.length > 0 && genres.length > 0 && (
        <MovieBanner movies={movies} genres={genres} />
      )}
      
      <CompanyShowcase />

      <div className="space-y-8 px-4 md:px-0">
        <ContinueWatching items={continueWatching} />
        <MovieSection title="Now Playing in Theaters" items={movies} />
        <MovieSection title="Trending Movies This Week" items={trending} />
        
        {trending.length > 0 && (
          <TopContent items={trending.slice(0, 10)} />
        )}
        
        {uniqueMoviesList.length > 0 && (
          <div className="mt-16 mb-16">
            <MovieBannerSlider movies={uniqueMoviesList} />
          </div>
        )}
        
        <MovieSection title="Popular TV Shows" items={tvShows} />
        <MovieSection title="Trending TV Shows" items={trendingTVShows} />
        <MovieSection title="Indian Movies" items={indianMovies} />
        <MovieSection title="Top Rated Movies" items={topRatedMovies} />
      </div>
    </>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Show disclaimer toast when the app loads
    toast({
      title: "Content Disclaimer",
      description: "This website does not host or own any content. We only provide links to publicly available content.",
      duration: 5000,
    });
  }, [toast]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const navItems = [
    {
      name: "Home",
      url: "/",
      icon: Home,
    },
    {
      name: "Search",
      url: "/search",
      icon: Search,
    },
    {
      name: "Pricing",
      url: "/pricing",
      icon: CreditCard,
    },
    {
      name: "FAQ",
      url: "/faq",
      icon: HelpCircle,
    },
  ];

  const sidebarLinks = [
    {
      label: "Movies",
      href: "/",
      icon: (
        <Film className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "TV Shows",
      href: "/tv",
      icon: (
        <Tv className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Watchlist",
      href: "/watchlist",
      icon: (
        <Bookmark className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/coming-soon/profile",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/coming-soon/settings",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/coming-soon/logout",
      icon: (
        <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black rounded-3xl overflow-hidden">
      <DotPattern
        className="fixed inset-0 w-full h-full [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        cy={1}
        cr={1}
        cx={1}
      />

      <NavBar items={navItems} />

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-50 md:hidden bg-white/10 backdrop-blur-lg border border-white/20 rounded-full w-12 h-12 hover:bg-white/20"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6 text-white" />
      </Button>

      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <motion.div
            className={`fixed md:relative z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-300 ease-in-out`}
          >
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
              <SidebarBody className="fixed top-16 left-0 h-[calc(100vh-4rem)] justify-between gap-10 !bg-black/50 backdrop-blur-md border-r border-neutral-800 rounded-r-3xl z-50 w-[240px] md:w-[64px] md:hover:w-[300px] transition-all duration-300 group overflow-y-auto">
                <nav className="flex flex-col gap-2 pt-4">
                  {sidebarLinks.map((link, idx) => (
                    <SidebarLink 
                      key={idx} 
                      link={link} 
                      props={{ onClick: () => setSidebarOpen(false) }}
                    />
                  ))}
                </nav>
              </SidebarBody>
            </Sidebar>
          </motion.div>

          <main className="flex-1 overflow-y-auto px-4 md:pl-[64px] lg:pl-[64px] w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/tv/:id" element={<TVDetail />} />
              <Route path="/tv/:showId/season/:seasonNumber/episode/:episodeNumber" element={<VideoPlayer />} />
              <Route path="/studio/:studio" element={<StudioMovies />} />
              <Route path="/pricing" element={<PricingSectionDemo />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/coming-soon/:feature" element={<ComingSoon />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
}

export default App;