'use strict';

const request = require('supertest');
const should = require('should');
let token = '';
let rutaRespuesta = '';
global.server = {};
require('../../registrarBabel');
console.log('** archivo tmp_siprunpcd en ejecucion');
describe('Iniciando el test', () => {
before((done) => {
  server = require('../../../index');
  done();
});

// app.api.get('/centralizador/listar_corte', app.controller.tmp_corte_anual.listarCorte);
it('>>> GET - Obentener corte para siprun', (done) => {
  request(server)
    .get('/centralizador/siprun/corte')
    .set('Authorization', `Bearer ${token}` )
    .set('Content-Type','application/json')
    .expect(201)
    .end((err, res) => {
      if (err) return done(err);
      rutaRespuesta = res.body.datos;
      done();
  });
});