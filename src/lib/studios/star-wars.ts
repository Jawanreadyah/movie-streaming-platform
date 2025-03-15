import { type Movie, type TVShow } from '../tmdb';

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

export interface StarWarsMoviesState {
  original: Movie[];
  prequel: Movie[];
  sequel: Movie[];
  spinoff: Movie[];
}

export interface StarWarsTVShowsState {
  animated: TVShow[];
  liveAction: TVShow[];
}