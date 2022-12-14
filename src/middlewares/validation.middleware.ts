import { HttpErrorCodes, HttpErrorMessages } from '@errors/errors.enum';
import HttpError from '@errors/http.error';
import { ValidationResult } from '@interfaces/validation-result.interface';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let plainData = null;

    if (value === 'body') {
      plainData = req.body;
    } else if (value === 'query') {
      plainData = req.query;
    }

    const obj = plainToClass(type, plainData);
    const validationErrors = await validate(obj, { skipMissingProperties, whitelist, forbidNonWhitelisted });

    if (validationErrors.length > 0) {
      next(
        new HttpError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          HttpErrorCodes.UNPROCESSABLE_ENTITY,
          HttpErrorMessages.DTO_VALIDATION_ERRORS_OCCURED,
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
