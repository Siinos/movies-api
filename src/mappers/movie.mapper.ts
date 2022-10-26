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
}
