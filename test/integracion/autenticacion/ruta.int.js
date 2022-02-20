
            /**
            *Archivo para realizar pruebas integrales
            */

            'use strict';

            const request = require('supertest');
            const should = require('should');
            let token = '';
            let rutaRespuesta = '';
            global.server = {};
            const user = { username: 'admin', password: 'Developer' };
            require('../../registrarBabel');
            console.log('************************ se esta ejecutando el archivo ruta.js ***********************');
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
            it('>>> POST (Objeto) Configurar la constante crear_ruta segun el modelo ruta /api/v1/ruta', (done) => {

            const crear_ruta = {
              "_fecha_creacion": new Date(),
              "_fecha_modificacion": new Date(),
            };

            request(server)
              .post('/api/v1/ruta')
              .set('Authorization', `Bearer ${token}` )
              .set('Content-Type','application/json')
              .send(crear_ruta)
              .expect(201)
              .end((err, res) => {
                if (err) return done(err);
                res.body.datos.should.have.property('id_ruta');
                rutaRespuesta = res.body.datos;
                done();
              });
            });

            // Opciones de peticion para el verbo GET

            it('>>> GET (Lista) Se obtiene una lista completa de /api/v1/ruta', (done) => {
            request(server)
              .get('/api/v1/ruta')
              .set('Authorization', `Bearer ${token}` )
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
                done();
              });
            });

            // Opciones de peticion para el verbo GET/:id

            it('>>> GET (Objecto) Verificar que el modelo ruta es creado correctamente  /api/v1/ruta', (done) => {
            request(server)
              .get(`/api/v1/ruta/${rutaRespuesta.id_ruta}`)
              .set('Authorization', `Bearer ${token}` )
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if ( err ) return done(err);
                res.body.datos.should.be.not.null();
                done();
              });
            });

            // Opciones de peticion para el verbo PUT

            const rutaModificado = {
              "estado":"INACTIVO"
            };

            it('>>> PUT (Objecto) Modificar la constante rutaModificado para que sea correcto /api/v1/ruta', (done) => {
            request(server)
              .put(`/api/v1/ruta/${rutaRespuesta.id_ruta}`)
              .set('Authorization', `Bearer ${token}` )
              .set('Content-Type','application/json')
              .send(rutaModificado )
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
                res.body.datos.should.be.not.null();
                res.body.datos.should.have.property('id_ruta');
                done();
              });
            });

            });
            