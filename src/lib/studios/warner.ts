import { type Movie, type TVShow } from '../tmdb';

// Warner Bros. Movies IDs
export const WARNER_MOVIES = {
  franchises: {
    harryPotter: [
      671,    // Harry Potter and the Philosopher's Stone
      672,    // Harry Potter and the Chamber of Secrets
      673,    // Harry Potter and the Prisoner of Azkaban
      674,    // Harry Potter and the Goblet of Fire
      675,    // Harry Potter and the Order of the Phoenix
      767,    // Harry Potter and the Half-Blood Prince
      12444,  // Harry Potter and the Deathly Hallows: Part 1
      12445,  // Harry Potter and the Deathly Hallows: Part 2
      338952, // Fantastic Beasts and Where to Find Them
      338953, // Fantastic Beasts: The Crimes of Grindelwald
      338954, // Fantastic Beasts: The Secrets of Dumbledore
    ],
    matrix: [
      603,    // The Matrix
      604,    // The Matrix Reloaded
      605,    // The Matrix Revolutions
      624860, // The Matrix Resurrections
    ],
    lotr: [
      120,    // The Lord of the Rings: The Fellowship of the Ring
      121,    // The Lord of the Rings: The Two Towers
      122,    // The Lord of the Rings: The Return of the King
      49051,  // The Hobbit: An Unexpected Journey
      57158,  // The Hobbit: The Desolation of Smaug
      122917, // The Hobbit: The Battle of the Five Armies
    ],
    monsterverse: [
      124905, // Godzilla (2014)
      293167, // Kong: Skull Island
      373571, // Godzilla: King of the Monsters
      399566, // Godzilla vs. Kong
      940721, // Godzilla x Kong: The New Empire
    ],
  },
  classics: [
    770,    // Gone with the Wind
    829,    // Casablanca
    11471,  // Ben-Hur
    18148,  // The Wizard of Oz
    33320,  // The Jazz Singer
  ],
  modern: [
    98,     // Gladiator
    155,    // The Dark Knight
    27205,  // Inception
    49026,  // The Dark Knight Rises
    49538,  // Interstellar
    76341,  // Mad Max: Fury Road
    98566,  // Gravity
    152532, // Dune
    438631, // Dune: Part Two
  ]
};

// Warner Bros. TV Shows IDs
export const WARNER_TV_SHOWS = {
  hbo: [
    1399,   // Game of Thrones
    94997,  // House of the Dragon
    63247,  // Westworld
    85552,  // Euphoria
    87739,  // The Last of Us
    2316,   // The Office
    1668,   // Friends
    1418,   // The Big Bang Theory
  ],
  animation: [
    60625,  // Rick and Morty
    1434,   // Family Guy
    246,    // Avatar: The Last Airbender
    1877,   // Regular Show
    75219,  // Primal
  ],
  drama: [
    60735,  // The Flash
    71912,  // The Witcher
    66732,  // Stranger Things
    1402,   // The Walking Dead
    76479,  // The Boys
  ]
};

export interface WarnerMoviesState {
  harryPotter: Movie[];
  matrix: Movie[];
  lotr: Movie[];
  monsterverse: Movie[];
  classics: Movie[];
  modern: Movie[];
}

export interface WarnerTVShowsState {
  hbo: TVShow[];
  animation: TVShow[];
  drama: TVShow[];
}