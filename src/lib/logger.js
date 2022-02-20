/* eslint global-require: 0 */
import winston from 'winston';
import fs from 'fs';
import cls from 'continuation-local-storage';

const getNamespaceFunction = cls.getNamespace;
const loggerContinuation = getNamespaceFunction('loggerApp123');
const env = process.env.NODE_ENV || 'development';
console.log("Entorno de logs:"+env);
const tsFormat = () => (new Date()).toLocaleTimeString();
winston.emitErrs = true;

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs/all-logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }),
    new winston.transports.Console({
      timestamp: tsFormat,
      level: 'debug',
      handleExceptions: true,
      json:true,
      colorize: true,
    }),
    new winston.transports.Http({
      host: 'localhost',
      port: '8081',
    }),
  ],
  exitOnError: false,
});


if (env !== 'test') {
  logger.rewriters.push((level, msg, metaParam) => {
    let meta = metaParam;
    if (typeof (metaParam) === 'object') {
      meta = JSON.parse(JSON.stringify(metaParam));
    }
    meta.logId = loggerContinuation.get('logId');
    meta.timestamp = new Date();
    meta.appName = require('../../package.json').name;
    return meta;
  });
}


if (env !== 'development') {
  logger.remove(winston.transports.Console);
}

module.exports = logger;
