'use strict';
// # Unauthorized error
// Custom error class with status code and type prefilled.
class UnauthorizedError extends Error {
  constructor (message) {
    super();

    this.name = 'UnauthorizedError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 401;
    this.errorType = this.name;
  }
}

module.exports = UnauthorizedError;
