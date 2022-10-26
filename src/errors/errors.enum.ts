export enum HTTP_ERROR_CODE {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB = 'REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB'
}

export enum HTTP_ERROR_MESSAGE {
  DTO_VALIDATION_ERRORS_OCCURED = 'Dto validation errors occured.',
  REQUESTED_MOVIE_ALREADY_EXISTS_IN_DB = 'Requested movie data already exists in database.'
}

export enum VALIDATION_MESSAGE {
  INVALID_GENRES = 'genres must contains only predefined values from db file'
}
