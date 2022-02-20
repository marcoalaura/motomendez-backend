'use strict';
// # Not found error
// Custom error class with status code and type prefilled.
class NotFoundError extends Error {
  constructor (message) {
    super();
    this.name = 'NotFoundError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 404;
    this.errorType = this.name;
  }
}

module.exports = NotFoundError;
