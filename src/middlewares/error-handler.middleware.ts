import e, { NextFunction, Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import HttpError from '@errors/http.error';
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';
import { logger } from '@commons/logger';
import { HttpErrorCodes, HttpErrorMessages } from '@errors/errors.enum';

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
        errorCode: HttpErrorCodes.INTERNAL_SERVER_ERROR,
        message: HttpErrorMessages.INTERNAL_SERVER_ERROR,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        details: []
      });
      logger.error(error);
    }
    next();
  }
}
