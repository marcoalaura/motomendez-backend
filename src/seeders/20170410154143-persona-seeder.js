// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('persona', [{
      documento_identidad: '0000001',
      complemento_documento: '00',
      fecha_nacimiento: '1980/01/01',
      nombres: 'AGETIC',
      primer_apellido: 'AGETIC',
      segundo_apellido: 'AGETIC',
      nombre_completo: 'AGETIC AGETIC AGETIC',
      sexo: 'M',
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date(),
      fid_tipo_documento: 100,
    },
    {
      documento_identidad: '0000006',
      complemento_documento: '00',
      fecha_nacimiento: '1980/01/01',
      nombres: 'NOTARIO',
      primer_apellido: 'NOTARIO',
      segundo_apellido: 'NOTARIO',
      nombre_completo: 'NOTARIO NOTARIO NOTARIO',
      sexo: 'F',
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date(),
      fid_tipo_documento: 100,
    },
    {
      documento_identidad: '1000006',
      complemento_documento: '00',
      fecha_nacimiento: '1980/01/01',
      nombres: 'Juan',
      primer_apellido: 'Perez',
      segundo_apellido: 'Perez',
      nombre_completo: 'Juan Perez Perez',
      direccion: 'calle 3',
      telefono: '67546754',
      correo_electronico: 'correo@dominio.com',
      sexo: 'M',
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date(),
      fid_tipo_documento: 100,
    },
    ], {});
  },

  down() {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  },
};
