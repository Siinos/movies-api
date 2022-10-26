import MoviesQueryParamsDto from '@dtos/movies-query-params.dto';
import { validationMiddleware } from '@middlewares/validation.middleware';
import MovieService from '@services/movie.service';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller, Get, QueryParams, Res, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';

@Controller('/v1/movies')
@Service()
export default class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('')
  @UseBefore(validationMiddleware(MoviesQueryParamsDto, 'query'))
  public async getMovies(@QueryParams() queryParams: MoviesQueryParamsDto, @Res() res: Response): Promise<Response> {
    const result = await this.movieService.getMovies(queryParams);
    return res.status(StatusCodes.OK).json(Array.isArray(result) ? { movies: result } : { movie: result });
  }
}
