import e, { NextFunction, Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import HttpError from '@errors/http.error';
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';

@Service()
@Middleware({ type: 'after' })
export default class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: Error, req: Request, res: Response, next: (err?: any) => NextFunction): void {
    if (error instanceof HttpError) {
      res.status(error.getStatus()).json({
        errorCode: error.getErrorCode(),
        message: error.getMessage(),
        status: error.getStatus(),
        details: error.getDetails()
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong on the server.',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        details: []
      });
    }
  }
}
