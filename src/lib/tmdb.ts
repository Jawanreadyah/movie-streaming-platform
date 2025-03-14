import { type Video, type ContentFilter, type Movie, type TVShow, type TVSeason, type TVEpisode, type Genre, type Cast, type Crew } from './types';

export const TMDB_API_KEY = '56033a6c665b6bf5d35b9963c5c7e468';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Marvel TV Shows IDs
export const MARVEL_TV_SHOWS = {
  abc: [
    1403,   // Agents of SHIELD
    61550,  // Agent Carter
    68716,  // Inhumans
  ],
  netflix: [
    61889,  // Daredevil
    38472,  // Jessica Jones
    62126,  // Luke Cage
    62127,  // Iron Fist
    62285,  // The Defenders
    67178,  // The Punisher
  ],
  hulu: [
    67466,  // Runaways
    66190,  // Cloak & Dagger
    88987,  // Helstrom
  ],
  disney: [
    85271,  // WandaVision
    88396,  // The Falcon and the Winter Soldier
    84958,  // Loki
    91363,  // What If...?
    88329,  // Hawkeye
    92749,  // Moon Knight
    92782,  // Ms. Marvel
    92783,  // She-Hulk
    114472, // Secret Invasion
    114472, // Loki Season 2
    122226, // Echo
    138501, // Agatha: All Along
    202555, // Daredevil: Born Again
  ]
};

// DC Movies IDs
export const DC_MOVIES = {
  early: [
    1924,   // Superman (1978)
    268,    // Batman (1989)
    364,    // Batman Returns (1992)
    414,    // Batman Forever (1995)
    415,    // Batman & Robin (1997)
    314,    // Catwoman (2004)
    561,    // Constantine (2005)
    1452,   // Superman Returns (2006)
    13183,  // Watchmen (2009)
    20533,  // Jonah Hex (2010)
    44912,  // Green Lantern (2011)
  ],
  dceu: [
    49521,  // Man of Steel (2013)
    209112, // Batman v Superman: Dawn of Justice (2016)
    297761, // Suicide Squad (2016)
    297762, // Wonder Woman (2017)
    141052, // Justice League (2017)
    297802, // Aquaman (2018)
    287947, // Shazam! (2019)
    495764, // Birds of Prey (2020)
    464052, // Wonder Woman 1984 (2020)
    791373, // Zack Snyder's Justice League (2021)
    436969, // The Suicide Squad (2021)
    436270, // Black Adam (2022)
    594767, // Shazam! Fury of the Gods (2023)
    298618, // The Flash (2023)
    565770, // Blue Beetle (2023)
    572802, // Aquaman and the Lost Kingdom (2023)
  ],
  batman: [
    475557, // Joker (2019)
  ],
  animated: [
    14919,  // Batman: Mask of the Phantasm (1993)
    183011, // Justice League: The Flashpoint Paradox (2013)
    382322, // Batman: The Killing Joke (2016)
    474395, // Teen Titans Go! To the Movies (2018)
    618355, // Superman: Red Son (2020)
    618353, // Justice League Dark: Apokolips War (2020)
    736074, // Batman: Soul of the Dragon (2021)
    823855, // Injustice (2021)
    860425, // Catwoman: Hunted (2022)
    933529, // Green Lantern: Beware My Power (2022)
  ]
};

// DC TV Shows IDs
export const DC_TV_SHOWS = {
  classic: [
    11191,  // Adventures of Superman (1952-1958)
    2286,   // Batman (1966-1968)
  ],
  arrowverse: [
    1412,   // Arrow (2012-2020)
    60735,  // The Flash (2014-2023)
    62688,  // Supergirl (2015-2021)
    62643,  // Legends of Tomorrow (2016-2022)
    69740,  // Black Lightning (2018-2021)
    89247,  // Batwoman (2019-2022)
  ],
  modern: [
    86960,  // Stargirl (2020-2022)
    110492, // Peacemaker (2022-present)
  ],
  animated: [
    2058,   // Batman: The Animated Series (1992-1995)
    2263,   // Superman: The Animated Series (1996-2000)
    1639,   // Justice League (2001-2004)
    7442,   // Teen Titans (2003-2006)
    33217,  // Young Justice (2010-present)
    86831,  // Harley Quinn (2019-present)
  ]
};

// Star Wars Movies IDs
export const STAR_WARS_MOVIES = {
  original: [
    11,     // A New Hope
    1891,   // The Empire Strikes Back
    1892,   // Return of the Jedi
  ],
  prequel: [
    1893,   // The Phantom Menace
    1894,   // Attack of the Clones
    1895,   // Revenge of the Sith
  ],
  sequel: [
    140607, // The Force Awakens
    181808, // The Last Jedi
    181812, // The Rise of Skywalker
  ],
  spinoff: [
    12180,  // The Clone Wars
    330459, // Rogue One
    348350, // Solo
  ]
};

// Star Wars TV Shows IDs
export const STAR_WARS_TV_SHOWS = {
  animated: [
    4194,   // Star Wars: The Clone Wars (2008)
    3122,   // Star Wars: Clone Wars (2003)
    60554,  // Star Wars Rebels
    79093,  // Star Wars Resistance
    105971, // The Bad Batch
    114478, // Star Wars: Visions
    25,     // Star Wars: Droids
    3478,   // Star Wars: Ewoks
  ],
  liveAction: [
    82856,  // The Mandalorian
    115036, // The Book of Boba Fett
    92830,  // Obi-Wan Kenobi
    83867,  // Andor
    114461, // Ahsoka
    202879, // Skeleton Crew
    114479, // The Acolyte
  ]
};

export const tmdb = {
  // Enhanced filter function to strictly remove adult content
  _filterAdultContent<T extends ContentFilter>(items: T[]): T[] {
    // Filter out any items that are explicitly marked as adult
    // Also filter out items with certain keywords in the title that might indicate adult content
    const adultKeywords = ['xxx', 'sex', 'porn', 'adult', 'erotic', 'nude'];
    
    return items.filter(item => {
      // Remove items explicitly marked as adult
      if (item.adult === true) {
        return false;
      }
      
      // Check title (for movies) or name (for TV shows) against adult keywords
      const title = 'title' in item ? item.title : 'name' in item ? item.name : '';
      if (title && adultKeywords.some(keyword => 
        title.toLowerCase().includes(keyword.toLowerCase())
      )) {
        return false;
      }
      
      return true;
    });
  },

  async searchMovies(query: string, year?: number, genreId?: number): Promise<Movie[]> {
    let url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`;
    
    if (year) {
      url += `&year=${year}`;
    }
    
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async discoverMovies(year?: number, genreId?: number): Promise<Movie[]> {
    let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=1&sort_by=popularity.desc&include_adult=false`;
    
    if (year) {
      url += `&year=${year}`;
    }
    
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getIndianMovies(): Promise<Movie[]> {
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&page=1&sort_by=popularity.desc&with_original_language=hi|ta|te|ml|bn&region=IN&include_adult=false`;
    const response = await fetch(url);
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getNowPlaying(): Promise<Movie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getTrending(): Promise<Movie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getPopular(): Promise<Movie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getPopularTVShows(): Promise<TVShow[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getTrendingTVShows(): Promise<TVShow[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getTopRatedMovies(): Promise<Movie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getUpcomingMovies(): Promise<Movie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getMovieDetails(id: number): Promise<Movie> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent([data])[0];
  },

  async getTVShowDetails(id: number): Promise<TVShow> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent([data])[0];
  },

  async getTVSeasons(id: number): Promise<TVSeason[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`
    );
    const data = await response.json();
    return data.seasons;
  },

  async getTVEpisodes(id: number, season: number): Promise<TVEpisode[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}/season/${season}?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`
    );
    const data = await response.json();
    return data.episodes;
  },

  async getTVEpisodeVideos(showId: number, seasonNumber: number, episodeNumber: number): Promise<Video[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}/videos?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`
    );
    const data = await response.json();
    return data.results;
  },

  async getGenres(): Promise<Genre[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`
    );
    const data = await response.json();
    return data.genres;
  },

  async getMovieCredits(id: number): Promise<{ cast: Cast[]; crew: Crew[] }> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`
    );
    const data = await response.json();
    return data;
  },

  async getTVShowCredits(id: number): Promise<{ cast: Cast[]; crew: Crew[] }> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`
    );
    const data = await response.json();
    return data;
  },

  async getTVShowsByIds(ids: number[]): Promise<TVShow[]> {
    const shows = await Promise.all(
      ids.map(id =>
        fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`)
          .then(res => res.json())
          .catch(err => {
            console.error(`Error fetching TV show ${id}:`, err);
            return null;
          })
      )
    );
    return shows.filter((show): show is TVShow => show !== null);
  },

  async getMoviesByIds(ids: number[]): Promise<Movie[]> {
    const movies = await Promise.all(
      ids.map(id =>
        fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`)
          .then(res => res.json())
          .catch(err => {
            console.error(`Error fetching movie ${id}:`, err);
            return null;
          })
      )
    );
    return movies.filter((movie): movie is Movie => movie !== null);
  },

  getBackdropUrl(path: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : '';
  },

  getPosterUrl(path: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : '';
  },

  getProfileUrl(path: string, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string {
    return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=180&h=180&fit=crop';
  },

  async getMovieRecommendations(id: number): Promise<Movie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getTVRecommendations(id: number): Promise<TVShow[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getSimilarMovies(id: number): Promise<Movie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getSimilarTVShows(id: number): Promise<TVShow[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },

  async getMovieVideos(id: number): Promise<Video[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false`
    );
    const data = await response.json();
    return data.results;
  },

  async getPopularMovies(): Promise<Movie[]> {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false`
    );
    const data = await response.json();
    return this._filterAdultContent(data.results);
  },
};