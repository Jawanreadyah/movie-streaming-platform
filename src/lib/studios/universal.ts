import { type Movie, type TVShow } from '../tmdb';

// Universal Movies IDs
export const UNIVERSAL_MOVIES = {
  jurassicPark: [
    329,    // Jurassic Park (1993)
    330,    // The Lost World: Jurassic Park (1997)
    331,    // Jurassic Park III (2001)
    135397, // Jurassic World (2015)
    351286, // Jurassic World: Fallen Kingdom (2018)
    507086, // Jurassic World: Dominion (2022)
  ],
  fastSaga: [
    9799,   // The Fast and the Furious (2001)
    584,    // 2 Fast 2 Furious (2003)
    9615,   // The Fast and the Furious: Tokyo Drift (2006)
    13804,  // Fast & Furious (2009)
    51497,  // Fast Five (2011)
    82992,  // Fast & Furious 6 (2013)
    168259, // Furious 7 (2015)
    337339, // The Fate of the Furious (2017)
    384018, // Fast & Furious Presents: Hobbs & Shaw (2019)
    385128, // F9 (2021)
    385687, // Fast X (2023)
  ],
  despicableMe: [
    20352,  // Despicable Me (2010)
    93456,  // Despicable Me 2 (2013)
    324852, // Despicable Me 3 (2017)
    211672, // Minions (2015)
    438148, // Minions: The Rise of Gru (2022)
  ],
  classics: [
    77,     // Jaws (1975)
    2493,   // Back to the Future (1985)
    165,    // Back to the Future Part II (1989)
    196,    // Back to the Future Part III (1990)
    571,    // E.T. the Extra-Terrestrial (1982)
    1580,   // American Pie (1999)
    1412,   // American Werewolf in London (1981)
  ],
  modern: [
    137113, // Edge of Tomorrow (2014)
    131631, // The Purge (2013)
    282035, // Get Out (2017)
    458723, // Us (2019)
    493922, // Nope (2022)
    520763, // Oppenheimer (2023)
  ]
};

// Universal TV Shows IDs
export const UNIVERSAL_TV_SHOWS = {
  drama: [
    1416,   // Grey's Anatomy
    60735,  // The Flash
    1399,   // Game of Thrones
    1396,   // Breaking Bad
    66732,  // Stranger Things
  ],
  comedy: [
    2316,   // The Office (US)
    2490,   // Parks and Recreation
    1100,   // How I Met Your Mother
    2710,   // Brooklyn Nine-Nine
    79744,  // The Good Place
  ]
};

export interface UniversalMoviesState {
  jurassicPark: Movie[];
  fastSaga: Movie[];
  despicableMe: Movie[];
  classics: Movie[];
  modern: Movie[];
}

export interface UniversalTVShowsState {
  drama: TVShow[];
  comedy: TVShow[];
}