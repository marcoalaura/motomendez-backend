'use strict';
// # Unsupported Media Type
// Custom error class with status code and type prefilled.
class UnsupportedMediaTypeError extends Error {
  constructor (message) {
    super();

    this.name = 'UnsupportedMediaTypeError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 415;
    this.errorType = this.name;
  }
}

module.exports = UnsupportedMediaTypeError;
