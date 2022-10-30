import { HttpErrorCodes, HttpErrorMessages } from '@errors/errors.enum';
import { AddMovie, DbMovie, Movie } from '@interfaces/movie.interface';
import { MoviesQueryParams } from '@interfaces/movies-query-params.interface';
import MovieMapper from '@mappers/movie.mapper';
import MovieRepository from '@repositories/movie.repository';
import MovieService from '@services/movie.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import sinon from 'sinon';

describe('MovieService', () => {
  describe('addMovie', () => {
    it('Should return new added movie [Movie type] if same with provided data does not already exist in db', async () => {
      const newMovie: AddMovie = {
        title: 'The Matrix',
        year: 1999,
        runtime: 136,
        genres: ['Action', 'Sci-Fi'],
        director: 'Lilly Wachowski, Lana Wachowski',
        actors:
          'Keanu Reeves, Carrie-Anne Moss, Laurence Fishburne, Hugo Weaving, Gloria Foster, Joe Pantoliano, Marcus Chong, Julian Arahanga, Belinda McClory',
        plot: 'Computer hacker Neo learns from mysterious rebels that the world he lives in is just an image sent to his brain by robots.',
        posterUrl: 'https://m.media-amazon.com/images/I/51JSM0+hDmL._AC_.jpg'
      };
      const expectedResponse: Movie = {
        id: 147,
        ...newMovie
      };

      const movieRepository: MovieRepository = new MovieRepository();
      // Omit saving new object in real db file
      sinon.stub(movieRepository, 'saveMovie');
      const movieMapper: MovieMapper = new MovieMapper();
      const movieService: MovieService = new MovieService(movieRepository, movieMapper);
      const savedMovie: Movie = await movieService.addMovie(newMovie);
      expect(savedMovie).to.eql(expectedResponse);
      sinon.restore();
    });

    it('Should return an error if same movie with provided data already exists in db', async () => {
      const newMovie: AddMovie = {
        title: 'The Big Short',
        year: 2015,
        runtime: 130,
        genres: ['Biography', 'Comedy', 'Drama'],
        director: 'Adam McKay',
        actors: 'Ryan Gosling, Rudy Eisenzopf, Casey Groves, Charlie Talbert',
        plot: 'Four denizens in the world of high-finance predict the credit and housing bubble collapse of the mid-2000s, and decide to take on the big banks for their greed and lack of foresight.',
        posterUrl:
          'https://images-na.ssl-images-amazon.com/images/M/MV5BNDc4MThhN2EtZjMzNC00ZDJmLThiZTgtNThlY2UxZWMzNjdkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg'
      };
      const movieRepository: MovieRepository = new MovieRepository();
      const movieMapper: MovieMapper = new MovieMapper();
      const movieService: MovieService = new MovieService(movieRepository, movieMapper);

      try {
        const savedMovie = await movieService.addMovie(newMovie);
      } catch (error: any) {
        expect(error.status).is.equal(StatusCodes.UNPROCESSABLE_ENTITY);
        expect(error.errorCode).is.equal(HttpErrorCodes.REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB);
        expect(error.message).is.equal(HttpErrorMessages.REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB);
        return;
      }
    });
  });

  describe('getMovies', async () => {
    it('Should return array of movies [Movie[] type] matching genres and narrowed by runtime if both query.duration and query.genres were provided', async () => {
      const queryParams: MoviesQueryParams = { duration: 199, genres: ['Drama', 'Mystery'] };
      const expectedResponse: Movie[] = [
        {
          id: 77,
          genres: ['Action', 'Adventure', 'Drama'],
          title: 'The Lord of the Rings: The Return of the King',
          year: 2003,
          runtime: 201,
          director: 'Peter Jackson',
          actors: 'Noel Appleby, Ali Astin, Sean Astin, David Aston',
          plot: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMjE4MjA1NTAyMV5BMl5BanBnXkFtZTcwNzM1NDQyMQ@@._V1_SX300.jpg'
        },
        {
          id: 94,
          genres: ['Biography', 'Drama'],
          title: 'Gandhi',
          year: 1982,
          runtime: 191,
          director: 'Richard Attenborough',
          actors: 'Ben Kingsley, Candice Bergen, Edward Fox, John Gielgud',
          plot: "Gandhi's character is fully explained as a man of nonviolence. Through his patience, he is able to drive the British out of the subcontinent. And the stubborn nature of Jinnah and his commitment towards Pakistan is portrayed.",
          posterUrl:
            'http://ia.media-imdb.com/images/M/MV5BMzJiZDRmOWUtYjE2MS00Mjc1LTg1ZDYtNTQxYWJkZTg1OTM4XkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_SX300.jpg'
        }
      ];
      const movieRepository: MovieRepository = new MovieRepository();
      const movieMapper: MovieMapper = new MovieMapper();
      const movieService: MovieService = new MovieService(movieRepository, movieMapper);
      const movies: Movie[] = (await movieService.getMovies(queryParams)) as Movie[];
      expect(movies).to.eql(expectedResponse);
    });

    it('Should return single random movie [Movie type] in runtime range if only query.duration param was provided', async () => {
      const queryParams: MoviesQueryParams = { duration: 150 };
      const expectedResponse: Movie = {
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
      // Mock dbMovie to omit funcionality of randomizing response
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
      const movieRepository: MovieRepository = new MovieRepository();
      // Use mocked dbMovie as a default response to omit randomizing result
      sinon.stub(movieRepository, 'findOneRandomMovieInRuntimeRange').resolves(dbMovie);
      const movieMapper: MovieMapper = new MovieMapper();
      const movieService: MovieService = new MovieService(movieRepository, movieMapper);
      const movie: Movie = (await movieService.getMovies(queryParams)) as Movie;
      expect(movie).to.eql(expectedResponse);
      sinon.restore();
    });

    it('Should return array of movies [Movie[] type] matching genres if only query.genres param was provided', async () => {
      const queryParams: MoviesQueryParams = { genres: ['Animation', 'Adventure', 'Comedy'] };
      const expectedResponse: Movie[] = [
        {
          id: 14,
          genres: ['Animation', 'Adventure', 'Comedy'],
          title: 'Planet 51',
          year: 2009,
          runtime: 91,
          director: 'Jorge Blanco, Javier Abad, Marcos Martínez',
          actors: 'Jessica Biel, John Cleese, Gary Oldman, Dwayne Johnson',
          plot: 'An alien civilization is invaded by Astronaut Chuck Baker, who believes that the planet was uninhabited. Wanted by the military, Baker must get back to his ship before it goes into orbit without him.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMTUyOTAyNTA5Ml5BMl5BanBnXkFtZTcwODU2OTM0Mg@@._V1_SX300.jpg'
        },
        {
          id: 60,
          genres: ['Animation', 'Adventure', 'Comedy'],
          title: 'Despicable Me 2',
          year: 2013,
          runtime: 98,
          director: 'Pierre Coffin, Chris Renaud',
          actors: 'Steve Carell, Kristen Wiig, Benjamin Bratt, Miranda Cosgrove',
          plot: "When Gru, the world's most super-bad turned super-dad has been recruited by a team of officials to stop lethal muscle and a host of Gru's own, He has to fight back with new gadgetry, cars, and more minion madness.",
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMjExNjAyNTcyMF5BMl5BanBnXkFtZTgwODQzMjQ3MDE@._V1_SX300.jpg'
        },
        {
          id: 121,
          genres: ['Adventure', 'Comedy', 'Drama'],
          title: 'Nebraska',
          year: 2013,
          runtime: 115,
          director: 'Alexander Payne',
          actors: 'Bruce Dern, Will Forte, June Squibb, Bob Odenkirk',
          plot: 'An aging, booze-addled father makes the trip from Montana to Nebraska with his estranged son in order to claim a million-dollar Mega Sweepstakes Marketing prize.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU2Mjk2NDkyMl5BMl5BanBnXkFtZTgwNTk0NzcyMDE@._V1_SX300.jpg'
        }
      ];
      // Mock dbMovies to omit comparision of large arrays every time
      const dbMovies: DbMovie[] = [
        {
          id: 14,
          genres: ['Animation', 'Adventure', 'Comedy'],
          title: 'Planet 51',
          year: '2009',
          runtime: '91',
          director: 'Jorge Blanco, Javier Abad, Marcos Martínez',
          actors: 'Jessica Biel, John Cleese, Gary Oldman, Dwayne Johnson',
          plot: 'An alien civilization is invaded by Astronaut Chuck Baker, who believes that the planet was uninhabited. Wanted by the military, Baker must get back to his ship before it goes into orbit without him.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMTUyOTAyNTA5Ml5BMl5BanBnXkFtZTcwODU2OTM0Mg@@._V1_SX300.jpg'
        },
        {
          id: 60,
          genres: ['Animation', 'Adventure', 'Comedy'],
          title: 'Despicable Me 2',
          year: '2013',
          runtime: '98',
          director: 'Pierre Coffin, Chris Renaud',
          actors: 'Steve Carell, Kristen Wiig, Benjamin Bratt, Miranda Cosgrove',
          plot: "When Gru, the world's most super-bad turned super-dad has been recruited by a team of officials to stop lethal muscle and a host of Gru's own, He has to fight back with new gadgetry, cars, and more minion madness.",
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMjExNjAyNTcyMF5BMl5BanBnXkFtZTgwODQzMjQ3MDE@._V1_SX300.jpg'
        },
        {
          id: 121,
          genres: ['Adventure', 'Comedy', 'Drama'],
          title: 'Nebraska',
          year: '2013',
          runtime: '115',
          director: 'Alexander Payne',
          actors: 'Bruce Dern, Will Forte, June Squibb, Bob Odenkirk',
          plot: 'An aging, booze-addled father makes the trip from Montana to Nebraska with his estranged son in order to claim a million-dollar Mega Sweepstakes Marketing prize.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU2Mjk2NDkyMl5BMl5BanBnXkFtZTgwNTk0NzcyMDE@._V1_SX300.jpg'
        }
      ];
      const movieRepository: MovieRepository = new MovieRepository();
      // Use mocked dbMovies as a default response for method in MovieRepository that may return large arrays
      sinon.stub(movieRepository, 'findAllMoviesMatchingGenres').resolves(dbMovies);
      const movieMapper: MovieMapper = new MovieMapper();
      const movieService: MovieService = new MovieService(movieRepository, movieMapper);
      const movies: Movie[] = (await movieService.getMovies(queryParams)) as Movie[];
      expect(movies).to.eql(expectedResponse);
      sinon.restore();
    });

    it('Should return single random movie [Movie type] if no query parameters (duration, genres) were provided', async () => {
      const queryParams: MoviesQueryParams = {};
      const expectedResponse: Movie = {
        id: 58,
        genres: ['Action', 'Adventure', 'Crime'],
        title: 'North by Northwest',
        year: 1959,
        runtime: 136,
        director: 'Alfred Hitchcock',
        actors: 'Cary Grant, Eva Marie Saint, James Mason, Jessie Royce Landis',
        plot: 'A hapless New York advertising executive is mistaken for a government agent by a group of foreign spies, and is pursued across the country while he looks for a way to survive.',
        posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMjQwMTQ0MzgwNl5BMl5BanBnXkFtZTgwNjc4ODE4MzE@._V1_SX300.jpg'
      };
      // Mock dbMovie to omit funcionality of randomizing response
      const dbMovie: DbMovie = {
        id: 58,
        genres: ['Action', 'Adventure', 'Crime'],
        title: 'North by Northwest',
        year: '1959',
        runtime: '136',
        director: 'Alfred Hitchcock',
        actors: 'Cary Grant, Eva Marie Saint, James Mason, Jessie Royce Landis',
        plot: 'A hapless New York advertising executive is mistaken for a government agent by a group of foreign spies, and is pursued across the country while he looks for a way to survive.',
        posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMjQwMTQ0MzgwNl5BMl5BanBnXkFtZTgwNjc4ODE4MzE@._V1_SX300.jpg'
      };
      const movieRepository: MovieRepository = new MovieRepository();
      // Use mocked dbMovie as a default response to omit randomizing result
      sinon.stub(movieRepository, 'findOneRandomMovie').resolves(dbMovie);
      const movieMapper: MovieMapper = new MovieMapper();
      const movieService: MovieService = new MovieService(movieRepository, movieMapper);
      const movie: Movie = (await movieService.getMovies(queryParams)) as Movie;
      expect(movie).to.eql(expectedResponse);
      sinon.restore();
    });
  });
});
