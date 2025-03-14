import { type Movie } from '../tmdb';

// Pixar Movies IDs
export const PIXAR_MOVIES = {
  toyStory: [
    862,    // Toy Story (1995)
    863,    // Toy Story 2 (1999)
    10193,  // Toy Story 3 (2010)
    301528, // Toy Story 4 (2019)
  ],
  classics: [
    2062,   // Ratatouille (2007)
    585,    // Monsters, Inc. (2001)
    14160,  // Up (2009)
    9487,   // A Bug's Life (1998)
    12,     // Finding Nemo (2003)
    127380, // Finding Dory (2016)
    260513, // The Incredibles (2004)
    260514, // The Incredibles 2 (2018)
  ],
  modern: [
    508439, // Onward (2020)
    508442, // Soul (2020)
    508943, // Luca (2021)
    568124, // Turning Red (2022)
    508947, // Elemental (2023)
  ],
  cars: [
    920,    // Cars (2006)
    49013,  // Cars 2 (2011)
    260514, // Cars 3 (2017)
  ]
};

export interface PixarMoviesState {
  toyStory: Movie[];
  classics: Movie[];
  modern: Movie[];
  cars: Movie[];
}