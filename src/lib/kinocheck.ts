export const KINOCHECK_BASE_URL = 'https://api.kinocheck.com';
export const KINOCHECK_API_KEY = '7ezzmasX4GdvpJfkIMEeObq3ywOHVyATB9L3d5MrWnR0rC6U0ocSpUCPbKFVLjZY';

export interface VideoResource {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
  category: string;
  language: string;
}

export interface MovieResponse {
  id: string;
  tmdb_id: number;
  imdb_id: string | null;
  language: string;
  title: string;
  url: string;
  trailer: VideoResource | null;
  videos: VideoResource[];
}

export const kinocheck = {
  async getMovieTrailer(tmdbId: number, language: string = 'en'): Promise<VideoResource | null> {
    try {
      const response = await fetch(
        `${KINOCHECK_BASE_URL}/movies?tmdb_id=${tmdbId}&language=${language}&categories=Trailer&api_key=${KINOCHECK_API_KEY}`
      );
      const data: MovieResponse = await response.json();
      return data.trailer;
    } catch (error) {
      console.error('Error fetching trailer:', error);
      return null;
    }
  },

  async getMovieVideos(tmdbId: number, language: string = 'en'): Promise<VideoResource[]> {
    try {
      const response = await fetch(
        `${KINOCHECK_BASE_URL}/movies?tmdb_id=${tmdbId}&language=${language}&api_key=${KINOCHECK_API_KEY}`
      );
      const data: MovieResponse = await response.json();
      return data.videos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  }
};