'use strict';

class IncorrectUsage extends Error {
  constructor (message, context) {
    super();

    this.name = 'IncorrectUsage';
    this.stack = new Error().stack;
    this.statusCode = 400;
    this.errorType = this.name;
    this.message = message || '';
    this.context = context;
  }
}

module.exports = IncorrectUsage;
