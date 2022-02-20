'use strict';
// # Email error
// Custom error class with status code and type prefilled.
class EmailError extends Error {
  constructor (message) {
    super();

    this.name = 'EmailError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 500;
    this.errorType = this.name;
  }
}

module.exports = EmailError;
