class APIError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

class ValidationError extends Error {
  constructor(message, fields = {}) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.fields = fields;
  }
}

module.exports = {
  APIError,
  ValidationError
};