import { MoviesQueryParams } from '@interfaces/movies-query-params.interface';
import { IsPositive, IsOptional, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export default class MoviesQueryParamsDto implements MoviesQueryParams {
  @IsOptional()
  @Type(() => Number) // Query params are always strings, this allows to validate same as number
  @IsPositive()
  @Min(10) // 10 is a min value to avoid allowing filtering in range with negative minRange value (10-10=0 is still ok)
  public duration?: number;

  @IsOptional()
  @IsArray()
  public genres?: string[];
}
