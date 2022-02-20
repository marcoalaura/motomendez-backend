'use strict';
// # No Permission Error
// Custom error class with status code and type prefilled.
class NoPermissionError extends Error {
  constructor (message) {
    super();

    this.name = 'NoPermissionError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 403;
    this.errorType = this.name;
  }
}

module.exports = NoPermissionError;
