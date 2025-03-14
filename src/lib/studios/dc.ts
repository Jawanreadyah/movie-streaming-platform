import { type Movie, type TVShow } from '../tmdb';

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

export interface DCMoviesState {
  early: Movie[];
  dceu: Movie[];
  batman: Movie[];
  animated: Movie[];
}

export interface DCTVShowsState {
  classic: TVShow[];
  arrowverse: TVShow[];
  modern: TVShow[];
  animated: TVShow[];
}