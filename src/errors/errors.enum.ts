export enum HttpErrorCodes {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB = 'REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB'
}

export enum HttpErrorMessages {
  INTERNAL_SERVER_ERROR = 'Something went wrong on the server.',
  DTO_VALIDATION_ERRORS_OCCURED = 'Dto validation errors occured.',
  REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB = 'Requested movie data already exists in database.'
}

export enum ValidationMessages {
  INVALID_GENRES = 'genres must contains only predefined values from db file'
}
