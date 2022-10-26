import { DbMovie } from './movie.interface';

export default interface JsonDatabase {
  genres: string[];
  movies: DbMovie[];
}
