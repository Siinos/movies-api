import MovieRepository from '@repositories/movie.repository';
import AddMovieDto from '@dtos/add-movie.dto';
import { DbMovie, Movie } from '@interfaces/movie.interface';
import MovieMapper from '@mappers/movie.mapper';
import { Service } from 'typedi';
import { MoviesQueryParams } from '@interfaces/movies-query-params.interface';
import HttpError from '@errors/http.error';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorCodes, HttpErrorMessages } from '@errors/errors.enum';
import { logger } from '@commons/logger';
import { LoggerEvents } from '@commons/logger-events.enum';

@Service()
export default class MovieService {
  constructor(private readonly movieRepository: MovieRepository, private readonly movieMapper: MovieMapper) {}

  public async getMovies(queryParams: MoviesQueryParams): Promise<Movie[] | Movie> {
    if (queryParams.duration && queryParams.genres) {
      return await this.getAllMoviesMatchingGenresAndNarrowedByRuntime(queryParams.duration, queryParams.genres);
    } else if (queryParams.duration && !queryParams.genres) {
      return await this.getOneRandomMovieInRuntimeRange(queryParams.duration);
    } else if (!queryParams.duration && queryParams.genres) {
      return await this.getAllMoviesMatchingGenres(queryParams.genres);
    } else {
      return await this.getOneRandomMovie();
    }
  }

  public async addMovie(addMovieDto: AddMovieDto): Promise<Movie> {
    const dbMovies: DbMovie[] = await this.movieRepository.findAllMovies();
    const id: number = dbMovies.length + 1;
    const movie: Movie = { id, ...addMovieDto };
    const newDbMovie: DbMovie = this.movieMapper.mapMovieToDbMovie(movie);
    const movieAlreadyExists: DbMovie = dbMovies.filter((movie) => this.compareDbMovies(newDbMovie, movie))[0];

    if (movieAlreadyExists) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        HttpErrorCodes.REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB,
        HttpErrorMessages.REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB,
        { movieFromDb: movieAlreadyExists }
      );
    }

    await this.movieRepository.saveMovie(newDbMovie);
    logger.info({ event: LoggerEvents.NEW_MOVIE_ADDED, data: addMovieDto });

    return movie;
  }

  private async getAllMoviesMatchingGenresAndNarrowedByRuntime(duration: number, genres: string[]): Promise<Movie[]> {
    const dbMovies: DbMovie[] = await this.movieRepository.findAllMoviesMatchingGenresAndNarrowedByRuntime(
      duration,
      genres
    );
    const movies: Movie[] = dbMovies.map((dbMovie) => this.movieMapper.mapDbMovieToMovie(dbMovie));
    return movies;
  }

  private async getOneRandomMovieInRuntimeRange(duration: number): Promise<Movie> {
    const dbMovie: DbMovie = await this.movieRepository.findOneRandomMovieInRuntimeRange(duration);
    const movie: Movie = this.movieMapper.mapDbMovieToMovie(dbMovie);
    return movie;
  }

  private async getAllMoviesMatchingGenres(genres: string[]): Promise<Movie[]> {
    const dbMovies: DbMovie[] = await this.movieRepository.findAllMoviesMatchingGenres(genres);
    const movies: Movie[] = dbMovies.map((dbMovie) => this.movieMapper.mapDbMovieToMovie(dbMovie));
    return movies;
  }

  private async getOneRandomMovie(): Promise<Movie> {
    const dbMovie: DbMovie = await this.movieRepository.findOneRandomMovie();
    const movie: Movie = this.movieMapper.mapDbMovieToMovie(dbMovie);
    return movie;
  }

  /*
  There is no need to compare whole objects because, for example, a movie with a different title
  but similar rest of the properties is still a different movie.
  */
  private compareDbMovies(dbMovie: DbMovie, compareDbMovie: DbMovie): boolean {
    return (
      dbMovie.title === compareDbMovie.title &&
      dbMovie.year === compareDbMovie.year &&
      dbMovie.director === compareDbMovie.director
    );
  }
}
