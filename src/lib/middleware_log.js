/* eslint prefer-rest-params: 0 */
/* eslint func-names: 0 */
import uuid from 'uuid';
import cls from 'continuation-local-storage';

const ns = cls.createNamespace('loggerApp123');
const logger = require('./logger');

module.exports = (app) => {
    // namespace
  app.use((req, res, next) => {
    ns.bindEmitter(req);
    ns.bindEmitter(res);
    ns.run(() => {
      next();
    });
  });

  // setting log id in cls
  app.use((req, res, next) => {
    ns.set('logId', uuid());
    next();
  });

  // para loguear el request
  app.use((req, res, next) => {
    // logger.log('info',
    //   `[${__filename}][**REQUEST**]`,
    //   {
    //     request: {
    //       headers: req.headers,
    //       method: req.method,
    //       url: req.url,
    //       params: req.params,
    //       query: req.query,
    //     },
    //   },
    // );
    next();
  });

  app.use((req, response, next) => {
    const res = response;
    const oldWrite = response.write;
    const oldEnd = response.end;
    const chunks = [];

    res.write = function (chunk) {
      chunks.push(new Buffer(chunk));
      oldWrite.apply(res, arguments);
    };

    // save last chunk, then parse body
    res.end = function (chunk) {
      if (chunk) {
        chunks.push(new Buffer(chunk));
      }

      let body = Buffer.concat(chunks).toString('utf8');

      // what if there is no response, or is not JSON >_<
      try {
        body = JSON.parse(body);
      } catch (ex) {
      }

      // logger.log('info',
      //   `[${__filename}][**RESPONSE**]`,
      //   {
      //     response: {
      //       body,
      //       headers: res._headers,
      //       statusCode: res.statusCode,
      //     },
      //   },
      // );
      oldEnd.apply(res, arguments);
    };
    next();
  });
};
