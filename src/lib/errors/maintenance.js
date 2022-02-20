'use strict';

class Maintenance extends Error {
  constructor (message) {
    super();
    this.name = 'Maintenance';
    this.message = message || '';
    this.stack = new Error().stack;
    this.statusCode = 503;
    this.errorType = this.name;
  }
}

module.exports = Maintenance;
