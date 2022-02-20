'use strict';
// # Token Revocation ERror
// Custom error class with status code and type prefilled.

class TokenRevocationError extends Error {
  constructor (message) {
    super();
    this.name = 'TokenRevocationError';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 503;
    this.errorType = this.name;
  }
}

module.exports = TokenRevocationError;
