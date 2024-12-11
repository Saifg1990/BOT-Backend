const { APIError, ValidationError } = require('../utils/errors');
const ResponseHandler = require('../utils/response.utils');

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err instanceof APIError || err instanceof ValidationError) {
    return ResponseHandler.error(res, err);
  }

  const serverError = new APIError(
    'Internal server error',
    500,
    process.env.NODE_ENV === 'development' ? err : undefined
  );

  return ResponseHandler.error(res, serverError);
}

module.exports = errorHandler;