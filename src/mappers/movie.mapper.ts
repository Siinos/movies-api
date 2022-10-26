import { DbMovie, Movie } from '@interfaces/movie.interface';
import { Service } from 'typedi';

@Service()
export default class MovieMapper {
  public mapDbMovieToMovie(dbMovie: DbMovie): Movie {
    const movie: Movie = {
      id: dbMovie.id,
      genres: dbMovie.genres,
      title: dbMovie.title,
      year: Number(dbMovie.year),
      runtime: Number(dbMovie.runtime),
      director: dbMovie.director,
      actors: dbMovie.actors,
      plot: dbMovie.plot,
      posteUrl: dbMovie.posteUrl
    };

    return movie;
  }

  public mapMovieToDbMovie(movie: Movie): DbMovie {
    const dbMovie: DbMovie = {
      id: movie.id,
      genres: movie.genres,
      title: movie.title,
      year: String(movie.year),
      runtime: String(movie.runtime),
      director: movie.director,
      actors: movie.actors,
      plot: movie.plot,
      posteUrl: movie.posteUrl
    };

    return dbMovie;
  }
}
