import { expect } from 'chai';
import { DbMovie, Movie } from '@interfaces/movie.interface';
import MovieMapper from '@mappers/movie.mapper';

describe('MovieMapper', () => {
  describe('mapDbMovieToMovie', () => {
    it('Should return converted an object of DbMovie type to Movie type', () => {
      const movie: Movie = {
        id: 106,
        genres: ['Action', 'Drama', 'History'],
        title: 'The Last Samurai',
        year: 2003,
        runtime: 154,
        director: 'Edward Zwick',
        actors: 'Ken Watanabe, Tom Cruise, William Atherton, Chad Lindberg',
        plot: 'An American military advisor embraces the Samurai culture he was hired to destroy after he is captured in battle.',
        posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMzkyNzQ1Mzc0NV5BMl5BanBnXkFtZTcwODg3MzUzMw@@._V1_SX300.jpg'
      };
      const dbMovie: DbMovie = {
        id: 106,
        genres: ['Action', 'Drama', 'History'],
        title: 'The Last Samurai',
        year: '2003',
        runtime: '154',
        director: 'Edward Zwick',
        actors: 'Ken Watanabe, Tom Cruise, William Atherton, Chad Lindberg',
        plot: 'An American military advisor embraces the Samurai culture he was hired to destroy after he is captured in battle.',
        posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMzkyNzQ1Mzc0NV5BMl5BanBnXkFtZTcwODg3MzUzMw@@._V1_SX300.jpg'
      };
      const movieMapper: MovieMapper = new MovieMapper();
      const mappedMovie: Movie = movieMapper.mapDbMovieToMovie(dbMovie);
      expect(mappedMovie).to.eql(movie);
    });

    describe('mapMovieToDbMovie', () => {
      it('Should return converted an object of Movie type to DbMovie type', () => {
        const movie: Movie = {
          id: 106,
          genres: ['Action', 'Drama', 'History'],
          title: 'The Last Samurai',
          year: 2003,
          runtime: 154,
          director: 'Edward Zwick',
          actors: 'Ken Watanabe, Tom Cruise, William Atherton, Chad Lindberg',
          plot: 'An American military advisor embraces the Samurai culture he was hired to destroy after he is captured in battle.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMzkyNzQ1Mzc0NV5BMl5BanBnXkFtZTcwODg3MzUzMw@@._V1_SX300.jpg'
        };
        const dbMovie: DbMovie = {
          id: 106,
          genres: ['Action', 'Drama', 'History'],
          title: 'The Last Samurai',
          year: '2003',
          runtime: '154',
          director: 'Edward Zwick',
          actors: 'Ken Watanabe, Tom Cruise, William Atherton, Chad Lindberg',
          plot: 'An American military advisor embraces the Samurai culture he was hired to destroy after he is captured in battle.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMzkyNzQ1Mzc0NV5BMl5BanBnXkFtZTcwODg3MzUzMw@@._V1_SX300.jpg'
        };
        const movieMapper: MovieMapper = new MovieMapper();
        const mappedDbMovie: DbMovie = movieMapper.mapMovieToDbMovie(movie);
        expect(mappedDbMovie).to.eql(dbMovie);
      });
    });
  });
});
