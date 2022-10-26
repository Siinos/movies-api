import { HTTP_ERROR_CODE, HTTP_ERROR_MESSAGE } from '@errors/errors.enum';
import HttpError from '@errors/http.error';
import { ValidationResult } from '@interfaces/validation-result.interface';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const obj = plainToClass(type, req[value]);
    const validationErrors = await validate(obj, { skipMissingProperties, whitelist, forbidNonWhitelisted });

    if (validationErrors.length > 0) {
      next(
        new HttpError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          HTTP_ERROR_CODE.UNPROCESSABLE_ENTITY,
          HTTP_ERROR_MESSAGE.DTO_VALIDATION_ERRORS_OCCURED,
          formatValidationErrors(validationErrors)
        )
      );
    } else {
      next();
    }
  };
};

const formatValidationErrors = (validationErrors: ValidationError[]): ValidationResult[] => {
  const errors: ValidationResult[] = [];

  for (const error of validationErrors) {
    const messages: string[] = [];

    if (error.constraints) {
      for (const message of Object.keys(error.constraints)) {
        const errMsg = error.constraints[message];
        messages.push(errMsg);
      }
    }

    errors.push({ field: error.property, value: error.value, messages });
  }

  return errors;
};
