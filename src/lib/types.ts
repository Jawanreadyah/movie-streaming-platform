export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface ContentFilter {
  adult?: boolean;
}

export interface Movie extends ContentFilter {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  spoken_languages?: { english_name: string }[];
  production_companies?: { name: string }[];
}

export interface TVShow extends ContentFilter {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  status?: string;
  networks?: { name: string }[];
  type?: string;
  original_language?: string;
  genres?: { id: number; name: string }[];
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  last_air_date?: string;
}

export interface TVSeason {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episode_count: number;
  air_date: string;
}

export interface TVEpisode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  vote_average: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string;
}
