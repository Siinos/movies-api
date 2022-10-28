import { DbMovie } from '@interfaces/movie.interface';
import MovieRepository from '@repositories/movie.repository';
import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import { join } from 'path';
import JsonDatabase from '@interfaces/json-database.interface';

describe('MovieRepository', () => {
  describe('findOneRandomMovie', () => {
    it('Should return a single random movie [DbMovie type]', async () => {
      const expectedDbMovie: DbMovie = {
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
      sinon.stub(movieRepository, 'findOneRandomMovie').resolves(expectedDbMovie);
      const dbMovie: DbMovie = await movieRepository.findOneRandomMovie();
      expect(dbMovie).to.eql(expectedDbMovie);
      sinon.restore();
    });
  });

  describe('findOneRandomMovieInRuntimeRange', () => {
    it('Should return a single random movie [DbMovie type] in runtime range', async () => {
      const expectedDbMovie: DbMovie = {
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
      sinon.stub(movieRepository, 'findOneRandomMovieInRuntimeRange').resolves(expectedDbMovie);
      const dbMovie: DbMovie = await movieRepository.findOneRandomMovieInRuntimeRange(150);
      expect(dbMovie).to.eql(expectedDbMovie);
      sinon.restore();
    });
  });

  describe('findAllMoviesMatchingGenres', () => {
    it('Should return array of movies [DbMovie[] type] matching genres and sorted by a number of matching genres', async () => {
      const genres: string[] = ['Animation', 'Adventure', 'Comedy'];
      const expectedDbMovies: DbMovie[] = [
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
      // Use mocked dbMovies as a default response to omit randomizing result
      sinon.stub(movieRepository, 'findAllMoviesMatchingGenres').resolves(expectedDbMovies);
      const dbMovies: DbMovie[] = await movieRepository.findAllMoviesMatchingGenres(genres);
      expect(dbMovies).to.eql(expectedDbMovies);
      sinon.restore();
    });
  });

  describe('findAllMoviesMatchingGenresAndNarrowedByRuntime', () => {
    it('Should return array of movies [DbMovie[] type] matching genres, sorted by a number of matching genres and narrowed by runtime', async () => {
      const genres: string[] = ['Animation', 'Adventure', 'Comedy'];
      const duration: number = 199;
      const expectedDbMovies: DbMovie[] = [
        {
          id: 77,
          genres: ['Action', 'Adventure', 'Drama'],
          title: 'The Lord of the Rings: The Return of the King',
          year: '2003',
          runtime: '201',
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
          year: '1982',
          runtime: '191',
          director: 'Richard Attenborough',
          actors: 'Ben Kingsley, Candice Bergen, Edward Fox, John Gielgud',
          plot: "Gandhi's character is fully explained as a man of nonviolence. Through his patience, he is able to drive the British out of the subcontinent. And the stubborn nature of Jinnah and his commitment towards Pakistan is portrayed.",
          posterUrl:
            'http://ia.media-imdb.com/images/M/MV5BMzJiZDRmOWUtYjE2MS00Mjc1LTg1ZDYtNTQxYWJkZTg1OTM4XkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_SX300.jpg'
        }
      ];
      const movieRepository: MovieRepository = new MovieRepository();
      // Use mocked dbMovies as a default response to omit randomizing result
      sinon.stub(movieRepository, 'findAllMoviesMatchingGenres').resolves(expectedDbMovies);
      const dbMovies: DbMovie[] = await movieRepository.findAllMoviesMatchingGenresAndNarrowedByRuntime(
        duration,
        genres
      );
      expect(dbMovies).to.eql(expectedDbMovies);
      sinon.restore();
    });
  });

  describe('findAllMovies', () => {
    it('Should return array of all movies', async () => {
      const movieRepository: MovieRepository = new MovieRepository();
      const dbMovies: DbMovie[] = await movieRepository.findAllMovies();
      expect(dbMovies).to.be.an('array').length(146);

      for (const dbMovie of dbMovies) {
        expect(dbMovie).to.have.keys([
          'id',
          'genres',
          'title',
          'year',
          'runtime',
          'director',
          'actors',
          'plot',
          'posterUrl'
        ]);
      }
    });
  });

  describe('saveMovie', () => {
    // Clear db after test so other tests can still run properly
    after(async () => {
      const dbPath: string = join(process.cwd(), process.env.DB_PATH as string);
      const buffer = await fs.promises.readFile(dbPath);
      const jsonDb: JsonDatabase = await JSON.parse(buffer.toString());
      jsonDb.movies.pop();
      const updatedJsonDb: string = JSON.stringify(jsonDb, null, 3);
      await fs.promises.writeFile(dbPath, updatedJsonDb);
    });

    it('Should save new movie in json db file', async () => {
      const movieRepository: MovieRepository = new MovieRepository();
      const newMovie: DbMovie = {
        id: 147,
        title: 'The Matrix',
        year: '1999',
        runtime: '136',
        genres: ['Action', 'Sci-Fi'],
        director: 'Lilly Wachowski, Lana Wachowski',
        actors:
          'Keanu Reeves, Carrie-Anne Moss, Laurence Fishburne, Hugo Weaving, Gloria Foster, Joe Pantoliano, Marcus Chong, Julian Arahanga, Belinda McClory',
        plot: 'Computer hacker Neo learns from mysterious rebels that the world he lives in is just an image sent to his brain by robots.',
        posterUrl: 'https://m.media-amazon.com/images/I/51JSM0+hDmL._AC_.jpg'
      };
      await movieRepository.saveMovie(newMovie);
      const dbMovies: DbMovie[] = await movieRepository.findAllMovies();
      expect(dbMovies[dbMovies.length - 1]).to.eql(newMovie);
    });
  });

  describe('findAllGenres', () => {
    it('Should return array of all genres', async () => {
      const expectedGenres: string[] = [
        'Comedy',
        'Fantasy',
        'Crime',
        'Drama',
        'Music',
        'Adventure',
        'History',
        'Thriller',
        'Animation',
        'Family',
        'Mystery',
        'Biography',
        'Action',
        'Film-Noir',
        'Romance',
        'Sci-Fi',
        'War',
        'Western',
        'Horror',
        'Musical',
        'Sport'
      ];
      const movieRepository: MovieRepository = new MovieRepository();
      const genres: string[] = await movieRepository.findAllGenres();
      expect(genres).to.eql(expectedGenres);
    });
  });
});
