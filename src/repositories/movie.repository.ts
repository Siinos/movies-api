import JsonDatabase from '@interfaces/json-database.interface';
import { DbMovie } from '@interfaces/movie.interface';
import {
  countNumberOfMatchingValuesBetweenArrays,
  isArrayContainAtLeastOneValueOfCompareArray
} from '@utils/array.util';
import { getRandomIntNumber, isNumberInRange } from '@utils/math.util';
import fs from 'fs';
import { join } from 'path';
import { Service } from 'typedi';

@Service()
export default class MovieRepository {
  private dbPath: string;

  constructor() {
    this.dbPath = join(
      process.cwd(),
      process.env.NODE_ENV === 'test' ? (process.env.TEST_DB_PATH as string) : (process.env.DB_PATH as string)
    );
  }

  public async findOneRandomMovie(): Promise<DbMovie> {
    const movies: DbMovie[] = await this.findAllMovies();
    return this.getRandomMovieFromMoviesArray(movies);
  }

  public async findOneRandomMovieInRuntimeRange(duration: number): Promise<DbMovie> {
    const movies: DbMovie[] = await this.findAllMoviesInRuntimeRange(duration);
    return this.getRandomMovieFromMoviesArray(movies);
  }

  public async findAllMoviesMatchingGenres(genres: string[]): Promise<DbMovie[]> {
    const movies: DbMovie[] = await this.findAllMovies();
    const matchingMovies: DbMovie[] = movies.filter((movie) =>
      isArrayContainAtLeastOneValueOfCompareArray(movie.genres, genres)
    );
    const sortedMovies: DbMovie[] = this.sortMoviesByNumberOfMatchingGenres(matchingMovies, genres);
    return sortedMovies;
  }

  public async findAllMoviesMatchingGenresAndNarrowedByRuntime(duration: number, genres: string[]): Promise<DbMovie[]> {
    const matchingMovies: DbMovie[] = await this.findAllMoviesMatchingGenres(genres);
    const narrowedByRuntimeMovies: DbMovie[] = this.getMoviesInRuntimeRange(matchingMovies, duration);
    return narrowedByRuntimeMovies;
  }

  public async findAllMovies(): Promise<DbMovie[]> {
    const { movies } = await this.readJsonDatabase();
    return movies;
  }

  public async saveMovie(newDbMovie: DbMovie): Promise<void> {
    const jsonDb: JsonDatabase = await this.readJsonDatabase();
    jsonDb.movies.push(newDbMovie);
    const updatedJsonDb: string = JSON.stringify(jsonDb, null, 3);
    await fs.promises.writeFile(this.dbPath, updatedJsonDb);
  }

  public async findAllGenres(): Promise<string[]> {
    const { genres } = await this.readJsonDatabase();
    return genres;
  }

  private async findAllMoviesInRuntimeRange(duration: number): Promise<DbMovie[]> {
    const movies: DbMovie[] = await this.findAllMovies();
    return this.getMoviesInRuntimeRange(movies, duration);
  }

  private getRandomMovieFromMoviesArray(movies: DbMovie[]): DbMovie {
    const moviesLength: number = movies.length;
    const randomId: number = getRandomIntNumber(1, moviesLength - 1);
    return movies[randomId];
  }

  private sortMoviesByNumberOfMatchingGenres(movies: DbMovie[], genres: string[]): DbMovie[] {
    for (const movie of movies) {
      movie.countMatchingGenres = countNumberOfMatchingValuesBetweenArrays(movie.genres, genres);
    }

    return movies.sort((prevMovie, nextMovie) => nextMovie.countMatchingGenres - prevMovie.countMatchingGenres);
  }

  private getMoviesInRuntimeRange(movies: DbMovie[], duration: number): DbMovie[] {
    const runtimeMin: number = duration - 10;
    const runtimeMax: number = duration + 10;
    return movies.filter((movie) => isNumberInRange(Number(movie.runtime), runtimeMin, runtimeMax));
  }

  private async readJsonDatabase(): Promise<JsonDatabase> {
    const buffer = await fs.promises.readFile(this.dbPath);
    return JSON.parse(buffer.toString());
  }
}
