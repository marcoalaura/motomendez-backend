'use strict';

let _ = require('lodash');
let chalk = require('chalk');
let NotFoundError = require('./not-found-error');
let BadRequestError = require('./bad-request-error');
let InternalServerError = require('./internal-server-error');
let NoPermissionError = require('./no-permission-error');
let MethodNotAllowedError = require('./method-not-allowed-error');
let RequestEntityTooLargeError = require('./request-too-large-error');
let UnauthorizedError = require('./unauthorized-error');
let ValidationError = require('./validation-error');
let UnsupportedMediaTypeError = require('./unsupported-media-type-error');
let EmailError = require('./email-error');
let DataImportError = require('./data-import-error');
let TooManyRequestsError = require('./too-many-requests-error');
let TokenRevocationError = require('./token-revocation-error');
let IncorrectUsage = require('./incorrect-usage');
let Maintenance = require('./maintenance');
let i18n = require('../i18n');

/**
* Basic error handling helpers
*/
let errors = {
  logComponentInfo: function (component, info) {
    if (process.env.NODE_LEVEL === 'DEBUG' ||
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production') {
      console.info(chalk.cyan(component + ':', info));
    }
  },

  logComponentWarn: function (component, warning) {
    if (process.env.NODE_LEVEL === 'DEBUG' ||
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production') {
      console.info(chalk.yellow(component + ':', warning));
    }
  },

  logWarn: function (warn, context, help) {
    if (process.env.NODE_LEVEL === 'DEBUG' ||
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production') {
      warn = warn || i18n.t('errors.errors.noMessageSupplied');
      var msgs = [chalk.yellow(i18n.t('errors.errors.warning'), warn), '\n'];

      if (context) {
        msgs.push(chalk.white(context), '\n');
      }

      if (help) {
        msgs.push(chalk.green(help));
      }

      // add a new line
      msgs.push('\n');

      console.log.apply(console, msgs);
    }
  },

  logError: function (err, context, help) {
    let self = this;
    let origArgs = _.toArray(arguments).slice(1);
    let stack;
    let msgs;

    if (_.isArray(err)) {
      _.each(err, function (e) {
        var newArgs = [e].concat(origArgs);
        errors.logError.apply(self, newArgs);
      });
      return;
    }

    stack = err ? err.stack : null;

    if (!_.isString(err)) {
      if (_.isObject(err) && _.isString(err.message)) {
        err = err.message || '';
      } else {
        err = i18n.t('errors.errors.unknownErrorOccurred');
      }
    }

    // TODO: Logging framework hookup
    // Eventually we'll have better logging which will know about envs
    // you can use DEBUG=true when running tests and need error stdout
    if ((process.env.NODE_LEVEL === 'DEBUG' ||
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'staging' ||
      process.env.NODE_ENV === 'production')) {
      msgs = [chalk.red(i18n.t('errors.errors.error'), err), '\n'];

      if (context) {
        msgs.push(chalk.white(context), '\n');
      }

      if (help) {
        msgs.push(chalk.green(help));
      }

      // add a new line
      msgs.push('\n');

      if (stack) {
        msgs.push(stack, '\n');
      }

      console.error.apply(console, msgs);
    }
  }
};

// Ensure our 'this' context for methods and preserve method arity by
// using Function#bind for expressjs
_.each([
  'logWarn',
  'logComponentInfo',
  'logComponentWarn',
  'logError'
], function (funcName) {
  errors[funcName] = errors[funcName].bind(errors);
});

module.exports = errors;
module.exports.NotFoundError = NotFoundError;
module.exports.BadRequestError = BadRequestError;
module.exports.InternalServerError = InternalServerError;
module.exports.NoPermissionError = NoPermissionError;
module.exports.UnauthorizedError = UnauthorizedError;
module.exports.ValidationError = ValidationError;
module.exports.RequestEntityTooLargeError = RequestEntityTooLargeError;
module.exports.UnsupportedMediaTypeError = UnsupportedMediaTypeError;
module.exports.EmailError = EmailError;
module.exports.DataImportError = DataImportError;
module.exports.MethodNotAllowedError = MethodNotAllowedError;
module.exports.TooManyRequestsError = TooManyRequestsError;
module.exports.TokenRevocationError = TokenRevocationError;
module.exports.IncorrectUsage = IncorrectUsage;
module.exports.Maintenance = Maintenance;
