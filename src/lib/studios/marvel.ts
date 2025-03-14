import { type Movie, type TVShow } from '../tmdb';

// MCU Movie IDs in chronological order
export const MCU_MOVIE_IDS = [
  1726,   // Iron Man (2008)
  1724,   // The Incredible Hulk (2008)
  10138,  // Iron Man 2 (2010)
  10195,  // Thor (2011)
  1771,   // Captain America: The First Avenger (2011)
  24428,  // The Avengers (2012)
  68721,  // Iron Man 3 (2013)
  76338,  // Thor: The Dark World (2013)
  100402, // Captain America: The Winter Soldier (2014)
  118340, // Guardians of the Galaxy (2014)
  99861,  // Avengers: Age of Ultron (2015)
  102899, // Ant-Man (2015)
  271110, // Captain America: Civil War (2016)
  284052, // Doctor Strange (2016)
  283995, // Guardians of the Galaxy Vol. 2 (2017)
  315635, // Spider-Man: Homecoming (2017)
  284053, // Thor: Ragnarok (2017)
  284054, // Black Panther (2018)
  299536, // Avengers: Infinity War (2018)
  363088, // Ant-Man and the Wasp (2018)
  299537, // Captain Marvel (2019)
  299534, // Avengers: Endgame (2019)
  429617, // Spider-Man: Far From Home (2019)
  497698, // Black Widow (2021)
  566525, // Shang-Chi and the Legend of the Ten Rings (2021)
  524434, // Eternals (2021)
  634649, // Spider-Man: No Way Home (2021)
  453395, // Doctor Strange in the Multiverse of Madness (2022)
  616037, // Thor: Love and Thunder (2022)
  505642, // Black Panther: Wakanda Forever (2022)
  640146, // Ant-Man and the Wasp: Quantumania (2023)
  447365, // Guardians of the Galaxy Vol. 3 (2023)
  609681, // The Marvels (2023)
  533535, // Deadpool & Wolverine (2024)
  822119, // Captain America: Brave New World (2025)
  986056  // Thunderbolts (2025)
];

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

export interface MarvelTVShowsState {
  abc: TVShow[];
  netflix: TVShow[];
  hulu: TVShow[];
  disney: TVShow[];
}