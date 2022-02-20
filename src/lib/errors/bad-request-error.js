'use strict';
// # Bad request error
// Custom error class with status code and type prefilled.

class BadRequestError extends Error {
  constructor (message) {
    super();

    this.name = 'BadRequestError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 400;
    this.errorType = this.name;
  }
}

module.exports = BadRequestError;
