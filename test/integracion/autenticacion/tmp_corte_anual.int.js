'use strict';

const request = require('supertest');
const should = require('should');
let token = '';
let rutaRespuesta = '';
global.server = {};
const user = { username: 'admin', password: 'Developer' };
require('../../registrarBabel');
console.log('** archivo tmp_corte_anual.js en ejecucion');
describe('Iniciando el test', () => {
before((done) => {
  server = require('../../../index');
  done();
});

// app.api.post('/centralizador/crear_corte', app.controller.tmp_corte_anual.importar);
it('>>> POST (Archivo CSV) Configurar la constante crear_ruta segun el modelo ruta /api/v1/ruta', (done) => {
  const crear_corte = {
    "_fecha_creacion": new Date(),
    "_fecha_modificacion": new Date(),
  };

  request(server)
    .post('/centralizador/crear_corte')
    .set('Authorization', `Bearer ${token}` )
    .set('Content-Type','application/json')
    .send(crear_corte)
    .expect(201)
    .end((err, res) => {
      if (err) return done(err);
      res.body.datos.should.have.property('id_ruta');
      rutaRespuesta = res.body.datos;
      done();
  });
});

// app.api.get('/centralizador/listar_corte', app.controller.tmp_corte_anual.listarCorte);
it('>>> GET - Listar pcd registradas en el corte anual', (done) => {
  request(server)
    .get('/centralizador/crear_corte')
    .set('Authorization', `Bearer ${token}` )
    .set('Content-Type','application/json')
    .expect(201)
    .end((err, res) => {
      if (err) return done(err);
      rutaRespuesta = res.body.datos;
      done();
  });
});

// app.api.post('/centralizador/filtrar_corte', app.controller.tmp_corte_anual.filtrar);
it('>>> POST - Filtrado de pcd por gestion', (done) => {
  const gestion = 2019;

  request(server)
    .post('/centralizador/crear_corte')
    .set('Authorization', `Bearer ${token}` )
    .set('Content-Type','application/json')
    .send(gestion)
    .expect(201)
    .end((err, res) => {
      if (err) return done(err);
      rutaRespuesta = res.body.datos;
      done();
  })
});

// app.api.get('/centralizador/tmp_corte_anual/:id', app.controller.tmp_corte_anual.obtenerRegistro);
it('>>> GET - Obtener datos de persona', (done) => {
  const id = 1;

  request(server)
    .get('/centralizador/tmp_corte_anual/' + id)
    .set('Authorization', `Bearer ${token}` )
    .set('Content-Type','application/json')
    .expect(201)
    .end((err, res) => {
      if(err) return done(err);
      res.body.datos.should.have.property('id');
      rutaRespuesta = res.body.datos;
      done();
    })
});

// app.api.put('/centralizador/tmp_corte_anual/:id', app.controller.tmp_corte_anual.modificar);
it('>>> PUT - Modificar datos de pcd', (done) => {
  const datos = {
    id: 5688, 
    exp_departamento: "2", 
    nro_documento: "10000468", 
    complemento: null, 
    exp_pais: "BO", 
    primer_apellido: "CASTAÑETA", 
    segundo_apellido: "CONDORI", 
    apellido_casada: null, 
    nombres: "RONALD", 
    estado_civil: "S", 
    formato_inf: "NUAC", 
    fecha_nacimiento: "07/02/2003", 
    tipo_discapacidad: "INTELECTUAL", 
    grados_disc: "GRAVE", 
    porcentaje: "74", 
    fecha_vigencia: "09/01/2018", 
    pais: "BO", 
    codigo_municipal: "20201", 
    nombre_municipio: "ACHACACHI", 
    direccion: "Z/ MASAYA CALLE PACAJES S/N", 
    telefono: null, 
    celular: null, 
    observacion_contrastacion: null, 
    gestion: 2020, 
    tipo: "SIPRUN", 
    estado: "PENDIENTE" 
  };

  request(server)
    .put('/centralizador/tmp_corte_anual/')
    .set('Authorization', `Bearer ${token}` )
    .set('Content-Type','application/json')
    .send(datos)
    .expect(201)
    .end((err, res) => {
      if (err) return done(err);
      rutaRespuesta = res.body.datos;
      done();
  })
});