'use strict';
// # Request Entity Too Large Error
// Custom error class with status code and type prefilled.
class RequestEntityTooLargeError extends Error {
  constructor (message) {
    super();

    this.name = 'RequestEntityTooLargeError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 413;
    this.errorType = this.name;
  }
}

module.exports = RequestEntityTooLargeError;
