'use strict';
// # Not found error
// Custom error class with status code and type prefilled.

class MethodNotAllowedError extends Error {
  constructor (message) {
    super();
    this.name = 'MethodNotAllowedError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 405;
    this.errorType = this.name;
  }
}

module.exports = MethodNotAllowedError;
