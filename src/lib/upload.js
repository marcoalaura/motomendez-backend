'use strict';

// const csvToJson = require('csvtojson');
// const { bufferToStream, createObject } = require('./util_upload');
// const csvFilePath = 'app/assets/export.csv';
// const csv = require('csvtojson');

// function csv(rutaArchivo, headers) {
//   return new Promise((resolve, reject) => {
//     let items = [];
//     let message = null;
//     csvToJson().fromFile(rutaArchivo)
//       .then((registro) => {
//         items.push(createObject(headers, registro));
//         // console.log('*** csvToJson - registro: \n', JSON.stringify(registro, null, 2));
//       });
//   });
// }

function obtenerArchivo(req, form) {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
}

module.exports = {
  obtenerArchivo,
};
