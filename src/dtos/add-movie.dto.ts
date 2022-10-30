import { ValidationMessages } from '@errors/errors.enum';
import { AddMovie } from '@interfaces/movie.interface';
import { IsCorrectGenre } from '@validators/is-correct-genre.validator';
import { IsNotEmpty, IsString, IsArray, MaxLength, IsInt, IsOptional } from 'class-validator';

export default class AddMovieDto implements AddMovie {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @IsCorrectGenre({ message: ValidationMessages.INVALID_GENRES, each: true })
  public genres: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public title: string;

  @IsInt()
  @IsNotEmpty()
  public year: number;

  @IsInt()
  @IsNotEmpty()
  public runtime: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public director: string;

  @IsOptional()
  @IsString()
  public actors?: string;

  @IsOptional()
  @IsString()
  public plot?: string;

  @IsOptional()
  @IsString()
  public posterUrl?: string;
}
