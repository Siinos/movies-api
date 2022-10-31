import { HttpErrorCodes, HttpErrorMessages } from '@errors/errors.enum';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../../src/index';
import { AddMovie, Movie } from '@interfaces/movie.interface';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import { join } from 'path';
import JsonDatabase from '@interfaces/json-database.interface';

chai.use(chaiHttp);

describe('MoviesController', () => {
  describe('getMovies', () => {
    it('Should return status 200 and a single random movie [Movie type] if no query parameters (duration, genres) were provided', (done) => {
      chai
        .request(server)
        .get('/v1/movies')
        .end((err, res) => {
          expect(res.status).to.equals(StatusCodes.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('movie');
          expect(res.body.movie).to.have.all.keys([
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
          done();
        });
    });

    it('Should return status 200 and a single random movie [Movie type] in runtime range if only query.duration parameter was provided', (done) => {
      chai
        .request(server)
        .get('/v1/movies?duration=150')
        .end((err, res) => {
          expect(res.status).to.equals(StatusCodes.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('movie');
          expect(res.body.movie).to.have.all.keys([
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
          done();
        });
    });

    it('Should return status 200 and array of movies [Movie[] type] ordered by a number of matching genres if only query.genres param was provided', (done) => {
      chai
        .request(server)
        .get('/v1/movies?genres=Animation&genres=Adventure&genres=Comedy')
        .end((err, res) => {
          expect(res.status).to.equals(StatusCodes.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('movies');
          expect(res.body.movies).to.be.an('array').length(64);

          for (const movie of res.body.movies) {
            expect(movie).to.have.all.keys([
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

          done();
        });
    });

    it('Should return status 200 and array of movies [Movie[] type] matching genres narrowed by runtime if both query.duration and query.genres were provided', (done) => {
      chai
        .request(server)
        .get('/v1/movies?genres=Animation&genres=Drama&genres=Mystery&duration=199')
        .end((err, res) => {
          expect(res.status).to.equals(StatusCodes.OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('movies');
          expect(res.body.movies).to.be.an('array').length(2);

          for (const movie of res.body.movies) {
            expect(movie).to.have.all.keys([
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
          done();
        });

      it('Should return status 422 and detailed errors messages if any of provided query parameters was invalid', (done) => {
        const expectedResponse = {
          errorCode: HttpErrorCodes.UNPROCESSABLE_ENTITY,
          message: HttpErrorMessages.DTO_VALIDATION_ERRORS_OCCURED,
          status: StatusCodes.UNPROCESSABLE_ENTITY,
          details: [
            {
              field: 'duration',
              value: null,
              messages: ['duration must not be less than 10', 'duration must be a positive number']
            }
          ]
        };
        chai
          .request(server)
          .get('/v1/movies?genres=Animation&genres=Drama&genres=Mystery&duration=199invalid')
          .end((err, res) => {
            expect(res.status).to.equals(StatusCodes.UNPROCESSABLE_ENTITY);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql(expectedResponse);
            done();
          });
      });
    });

    describe('addMovie', () => {
      after(async () => {
        const dbPath: string = join(process.cwd(), process.env.TEST_DB_PATH as string);
        const buffer = await fs.promises.readFile(dbPath);
        const jsonDb: JsonDatabase = await JSON.parse(buffer.toString());
        jsonDb.movies.pop();
        const updatedJsonDb: string = JSON.stringify(jsonDb, null, 3);
        await fs.promises.writeFile(dbPath, updatedJsonDb);
      });

      it('Should return status 201 and new added movie [Movie type] with assigned id if requested data was correct', (done) => {
        const newMovie: AddMovie = {
          genres: ['Action', 'Sci-Fi'],
          title: 'The Matrix',
          year: 1999,
          runtime: 136,
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

        chai
          .request(server)
          .post('/v1/movies')
          .send(newMovie)
          .end((err, res) => {
            expect(res.status).to.equals(StatusCodes.CREATED);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql(expectedResponse);
            done();
          });
      });

      it('Should return status 422 and detailed errors messages if requested data was invalid', (done) => {
        const newInvalidMovie = {
          genres: [],
          title: 'The Matrix',
          year: 'test',
          runtime: 'test',
          director: 'Lilly Wachowski, Lana Wachowski',
          actors:
            'Keanu Reeves, Carrie-Anne Moss, Laurence Fishburne, Hugo Weaving, Gloria Foster, Joe Pantoliano, Marcus Chong, Julian Arahanga, Belinda McClory',
          plot: 'Computer hacker Neo learns from mysterious rebels that the world he lives in is just an image sent to his brain by robots.',
          posterUrl: 'https://m.media-amazon.com/images/I/51JSM0+hDmL._AC_.jpg'
        };
        const expectedResponse = {
          errorCode: HttpErrorCodes.UNPROCESSABLE_ENTITY,
          message: HttpErrorMessages.DTO_VALIDATION_ERRORS_OCCURED,
          status: StatusCodes.UNPROCESSABLE_ENTITY,
          details: [
            {
              field: 'year',
              value: 'test',
              messages: ['year must be an integer number']
            },
            {
              field: 'runtime',
              value: 'test',
              messages: ['runtime must be an integer number']
            }
          ]
        };

        chai
          .request(server)
          .post('/v1/movies')
          .send(newInvalidMovie)
          .end((err, res) => {
            expect(res.status).to.equals(StatusCodes.UNPROCESSABLE_ENTITY);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql(expectedResponse);
            done();
          });
      });

      it('Should return status 422 and detailed errors messages if requested data contained already existing movie in db', (done) => {
        const newDuplicatedMovie: AddMovie = {
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
        const expectedResponse = {
          errorCode: HttpErrorCodes.REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB,
          message: HttpErrorMessages.REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB,
          status: StatusCodes.UNPROCESSABLE_ENTITY,
          details: {
            movieFromDb: {
              id: 146,
              title: 'The Big Short',
              year: '2015',
              runtime: '130',
              genres: ['Biography', 'Comedy', 'Drama'],
              director: 'Adam McKay',
              actors: 'Ryan Gosling, Rudy Eisenzopf, Casey Groves, Charlie Talbert',
              plot: 'Four denizens in the world of high-finance predict the credit and housing bubble collapse of the mid-2000s, and decide to take on the big banks for their greed and lack of foresight.',
              posterUrl:
                'https://images-na.ssl-images-amazon.com/images/M/MV5BNDc4MThhN2EtZjMzNC00ZDJmLThiZTgtNThlY2UxZWMzNjdkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg'
            }
          }
        };

        chai
          .request(server)
          .post('/v1/movies')
          .send(newDuplicatedMovie)
          .end((err, res) => {
            expect(res.status).to.equals(StatusCodes.UNPROCESSABLE_ENTITY);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql(expectedResponse);
            done();
          });
      });
    });
  });
});
