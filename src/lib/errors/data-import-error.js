'use strict';
// # Data import error
// Custom error class with status code and type prefilled.

class DataImportError extends Error {
  constructor (message, offendingProperty, value) {
    super();

    this.name = 'DataImportError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 500;
    this.errorType = this.name;
    this.property = offendingProperty || undefined;
    this.value = value || undefined;
  }
}

module.exports = DataImportError;
