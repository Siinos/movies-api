import MovieRepository from '@repositories/movie.repository';
import { registerDecorator, ValidationOptions } from 'class-validator';
import Container from 'typedi';

export function IsCorrectGenre(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsCorrectGenre',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any) {
          const movieRepository: MovieRepository = Container.get(MovieRepository);
          const genres: string[] = await movieRepository.findAllGenres();
          return genres.includes(value);
        }
      }
    });
  };
}
