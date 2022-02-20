'use strict';
// # Validation Error
// Custom error class with status code and type prefilled.

class ValidationError extends Error {
  constructor (message, offendingProperty) {
    super();

    this.name = 'ValidationError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 422;
    if (offendingProperty) {
      this.property = offendingProperty;
    }
    this.errorType = this.name;
  }
}

module.exports = ValidationError;
