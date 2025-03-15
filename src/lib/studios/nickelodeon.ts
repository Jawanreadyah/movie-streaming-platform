import { type Movie, type TVShow } from '../tmdb';

// Nickelodeon Movies IDs
export const NICKELODEON_MOVIES = {
  animated: [
    10473,  // The SpongeBob SquarePants Movie (2004)
    77950,  // The SpongeBob Movie: Sponge Out of Water (2015)
    400160, // The SpongeBob Movie: Sponge on the Run (2020)
    14411,  // Jimmy Neutron: Boy Genius (2001)
    13002,  // Rugrats Movie (1998)
    13003,  // Rugrats in Paris: The Movie (2000)
    13004,  // Rugrats Go Wild (2003)
  ],
  liveAction: [
    10119,  // Harriet the Spy (1996)
    15860,  // Snow Day (2000)
    11444,  // Clockstoppers (2002)
    14666,  // Lemony Snicket's A Series of Unfortunate Events (2004)
    20662,  // Bridge to Terabithia (2007)
    454283, // Wonder Park (2019)
    675445, // PAW Patrol: The Movie (2021)
  ]
};

// Nickelodeon TV Shows IDs
export const NICKELODEON_TV_SHOWS = {
  animated: [
    387,    // SpongeBob SquarePants
    2231,   // The Fairly OddParents
    42916,  // Avatar: The Last Airbender
    79788,  // The Legend of Korra
    2558,   // Rugrats
    2559,   // Hey Arnold!
    2852,   // Danny Phantom
    45995,  // The Penguins of Madagascar
  ],
  liveAction: [
    2077,   // iCarly
    2231,   // Drake & Josh
    2261,   // Zoey 101
    31917,  // Victorious
    2319,   // All That
    73795,  // Henry Danger
    85271,  // The Thundermans
  ]
};

export interface NickelodeonMoviesState {
  animated: Movie[];
  liveAction: Movie[];
}

export interface NickelodeonTVShowsState {
  animated: TVShow[];
  liveAction: TVShow[];
}