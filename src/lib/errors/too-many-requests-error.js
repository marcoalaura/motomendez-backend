'use strict';
// # Too Many Requests Error
// Custom error class with status code and type prefilled.
class TooManyRequestsError extends Error {
  constructor (message) {
    super();

    this.name = 'TooManyRequestsError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 429;
    this.errorType = this.name;
  }
}

module.exports = TooManyRequestsError;
