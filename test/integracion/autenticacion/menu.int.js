
            /**
            *Archivo para realizar pruebas integrales
            */

            'use strict';

            const request = require('supertest');
            const should = require('should');
            let token = '';
            let menuRespuesta = '';
            global.server = {};
            const user = { username: 'admin', password: 'Developer' };
            require('../../registrarBabel');
            console.log('************************ se esta ejecutando el archivo menu.js ***********************');
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
            it('>>> POST (Objeto) Configurar la constante crear_menu segun el modelo menu /api/v1/menu', (done) => {

            /*const crear_menu = {
              "_fecha_creacion": new Date(),
              "_fecha_modificacion": new Date(),
            };*/

            const crear_menu = {
              "nombre": "CONFIGURACIÓN",
              "descripcion": "Configuración",
              "orden": 1,
              "ruta": "config",
              "icono": "config",
              "method_get": true,
              "method_post": true,
              "method_put": true,
              "method_delete": true,
              "fid_menu_padre": null
            };

            request(server)
              .post('/api/v1/menu')
              .set('Authorization', `Bearer ${token}` )
              .set('Content-Type','application/json')
              .send(crear_menu)
              .expect(201)
              .end((err, res) => {
                if (err) return done(err);
                res.body.datos.should.have.property('id_menu');
                menuRespuesta = res.body.datos;
                done();
              });
            });

            // Opciones de peticion para el verbo GET

            it('>>> GET (Lista) Se obtiene una lista completa de /api/v1/menu', (done) => {
            request(server)
              .get('/api/v1/menu')
              .set('Authorization', `Bearer ${token}` )
              .expect('Content-Type', /json/)
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
                done();
              });
            });

            // Opciones de peticion para el verbo GET/:id

            it('>>> GET (Objecto) Verificar que el modelo menu es creado correctamente  /api/v1/menu', (done) => {
            request(server)
              .get(`/api/v1/menu/${menuRespuesta.id_menu}`)
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

            /*const menuModificado = {
              "estado":"INACTIVO"
            };*/

            const menuModificado = {
              "nombre": "CONFIGURACIÓN",
              "descripcion": "Configuración modificada",
              "orden": 1,
              "ruta": "config",
              "icono": "config",
              "method_get": true,
              "method_post": true,
              "method_put": true,
              "method_delete": true,
              "fid_menu_padre": null
            };

            it('>>> PUT (Objecto) Modificar la constante menuModificado para que sea correcto /api/v1/menu', (done) => {
            request(server)
              .put(`/api/v1/menu/${menuRespuesta.id_menu}`)
              .set('Authorization', `Bearer ${token}` )
              .set('Content-Type','application/json')
              .send(menuModificado )
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
                res.body.datos.should.be.not.null();
                res.body.datos.should.have.property('id_menu');
                done();
              });
            });

            });
