interface BaseMovie {
  genres: string[];
  title: string;
  year: number;
  runtime: number;
  director: string;
  actors?: string;
  plot?: string;
  posterUrl?: string;
}

export type AddMovie = BaseMovie;

export interface Movie extends BaseMovie {
  id: number;
}

export interface DbMovie extends Omit<BaseMovie, 'year' | 'runtime'> {
  id: number;
  year: string;
  runtime: string;
  [key: string]: any; // Allow dynamically add property if needed (e.g. countMatchingGenres)
}
