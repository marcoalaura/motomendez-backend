'use strict';
// # Internal Server Error
// Custom error class with status code and type prefilled.
class InternalServerError extends Error {
  constructor (message) {
    super();

    this.name = 'InternalServerError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 500;
    this.errorType = this.name;
  }
}

module.exports = InternalServerError;
