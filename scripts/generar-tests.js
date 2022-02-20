/**
* @Description Archivo base para generar archivos de test
* @Description Code 1 : verificacion de la ruta para las pruebas integrales
* @Description Code 2 : inicio de la creacion de todos los metodos simples
* @Description Code 3 : seccion de creacion de cada uno de los archivos para el test
* @Description Code 4 : fin seccion de creacion de cada uno de los archivos para el REST
*/

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import auth from './src/config/config.development';
const basename = path.basename(module.filename);
const route = {};
const pathTestIntegration = `${__dirname}/test/integracion`;
const pathTest = `${__dirname}/test/`;
const dirModels = `${__dirname}/src/models`;
const sequelize = new Sequelize(
  auth.database,
  auth.username,
  auth.password,
  auth.params
);

// Code 1
fs.exists(pathTest, (exists) => {
  if ( !exists ) {
      fs.mkdirSync(pathTest);
      console.log(">>> Carpeta /test creada satisfactoriamente");
  }
})

fs.exists(pathTestIntegration, (exists) => {
  if ( !exists ) {
      fs.mkdirSync(pathTestIntegration);
      console.log(">>> Carpeta /test/integracion creada satisfactoriamente");
  }
})
// Code 2
let arrayFiles = '';
let sfile = '';
let dirRoutesFileTest = '';
let _folder = '';
let _dirActual = '';
let _path = '';
let _attrObj = '';
const espacio = '\n\t\t\t\t\t\t\t';


const objeto_con_datos = (model) => {

const attr = Object.keys(model.attributes);
let objeto_retonar = `${espacio}`;
attr.forEach( ( file ) => {
    switch (model.tableAttributes[file].type.constructor.key) {
      case 'INTEGER':
        if(file.toUpperCase().indexOf('ID_') == -1)
          objeto_retonar += `"${file}" : 1,${espacio}`;
        break;
      case 'STRING':
        if(file.toUpperCase() == 'ESTADO'){
          objeto_retonar += `"${file}" : "ACTIVO",${espacio}`;
        }else{
            objeto_retonar += `"${file}" : "${file}",${espacio}`;
        }
        break;
      case 'JSONB':
        objeto_retonar += `"${file}" : { "${file}": ""},${espacio}`;
        break;
      case 'BOOLEAN':
        objeto_retonar += `"${file}" : true,${espacio}`;
        break;
      case 'DATE':
        objeto_retonar += `"${file}" : new Date(),${espacio}`;
        break;
      default:
       objeto_retonar += `"${file}" : "",${espacio}`;
    }
});
  return objeto_retonar;
}

const _dirRecursive = ( dirModels ) => {
arrayFiles = fs.readdirSync( dirModels );
arrayFiles.forEach( ( file ) => {
  fs.stat(`${dirModels}/${file}`, function( err, resPath ) {
      if( resPath && resPath.isFile() ){
        _dirActual = dirModels.substr(dirModels.lastIndexOf("/"), dirModels.length);
        _path = `${pathTestIntegration}${_dirActual}`;
        if( !fs.existsSync(_path) ){
          if( _dirActual !== '/models' ){
            _folder = _dirActual;
            fs.mkdirSync( _path );
            console.log(`>>> Carpeta ${_dirActual} creada satisfactoriamente`);
          }else
            _folder = '';
        }else
          _folder = ( _dirActual !== '/models' ) ? _dirActual : '';
        // Code 3
        sfile = file.toString().replace('.js','');
        if( !fs.existsSync(`${_path}/${sfile}.int.js`) ){
          if( _folder.lastIndexOf('s') != -1 ){
            const posIndexOf = _folder.lastIndexOf('s');
            const posStringFolder = _folder.length;
            _folder = (posIndexOf == posStringFolder - 1)?_folder.substr(0,_folder.length - 1):_folder;
          }
          _folder = ( _folder !== '/autenticacion' )? _folder : '';
            _attrObj = sequelize.import(`${dirModels}/${file}`);
            let datos = objeto_con_datos(_attrObj);

            const contenidoTest = `
            /**
            *Archivo para realizar pruebas integrales
            */

            'use strict';

            const request = require('supertest');
            const should = require('should');
            let token = '';
            let ${sfile}Respuesta = '';
            global.server = {};
            const user = { username: 'admin', password: 'Developer' };
            require('babel-core/register')({
              ignore: /node_modules/,
            });
            console.log('************************ se esta ejecutando el archivo ${file} ***********************');
            describe('Iniciando el test', () => {
            before((done) => {
              server = require('../../../index');
              done();
            });

            it('>>> /autentication', (done) => {
            request(server)
              .post('/autenticar')
              .send(user)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                res.body.should.have.property('token');
                const result = JSON.parse(res.text);
                token = result.token;
                done();
              });
            });

            // Opciones de peticion para el verbo POST
            it('>>> POST (Objeto) Configurar la constante crear_${sfile} segun el modelo ${sfile} /api/v1${_folder}/${sfile}', (done) => {

            const crear_${sfile} = {${datos}};

            request(server)
              .post('/api/v1${_folder}/${sfile}')
              .set('Authorization', \`Bearer \$\{token\}\`)
              .set('Content-Type','application/json')
              .send(crear_${sfile})
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
                res.body.datos.should.have.property('id_${sfile}');
                ${sfile}Respuesta = res.body.datos;
                done();
              });
            });

            // Opciones de peticion para el verbo GET

            it('>>> GET (Lista) Se obtiene una lista completa de /api/v1${_folder}/${sfile}', (done) => {
            request(server)
              .get('/api/v1${_folder}/${sfile}')
              .set('Authorization', \`Bearer \$\{token\}\`)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
                done();
              });
            });

            // Opciones de peticion para el verbo GET/:id

            it('>>> GET (Objecto) Verificar que el modelo ${sfile} es creado correctamente  /api/v1${_folder}/${sfile}', (done) => {
            request(server)
              .get(\`/api/v1${_folder}/${sfile}${_folder}/\$\{${sfile}Respuesta.id_${sfile}\}\`)
              .set('Authorization', \`Bearer \$\{token\}\`)
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if ( err ) return done(err);
                res.body.datos.should.be.not.null();
                done();
              });
            });

            // Opciones de peticion para el verbo PUT

            const ${sfile}Modificado = {${datos}};

            it('>>> PUT (Objecto) Modificar la constante ${sfile}Modificado para que sea correcto /api/v1${_folder}/${sfile}', (done) => {
            request(server)
              .put(\`/api/v1${_folder}/${sfile}${_folder}/\$\{${sfile}Respuesta.id_${sfile}\}\`)
              .set('Authorization', \`Bearer \$\{token\}\`)
              .set('Content-Type','application/json')
              .send(${sfile}Modificado )
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
                res.body.datos.should.be.not.null();
                res.body.datos.should.have.property('id_${sfile}');
                done();
              });
            });

            });
            `;
            dirRoutesFileTest = (_dirActual !== '/models')?`${_path}/${sfile}.int.js`:`${pathTestIntegration}/${sfile}.int.js`;

            if(!fs.existsSync(dirRoutesFileTest)){
              fs.writeFile(dirRoutesFileTest, contenidoTest, { flag: 'wx' }, (err) => {
                  if (err) throw err;
              });
            }

          }
          // Code 4
        }
        if (resPath && resPath.isDirectory()) {
          return _dirRecursive(`${dirModels}/${file}`);
        }
    });
  });
}
_dirRecursive(dirModels);
