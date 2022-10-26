import MovieRepository from '@repositories/movie.repository';
import { DbMovie, Movie } from '@interfaces/movie.interface';
import MovieMapper from '@mappers/movie.mapper';
import { Service } from 'typedi';
import { MoviesQueryParams } from '@interfaces/movies-query-params.interface';

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
}
