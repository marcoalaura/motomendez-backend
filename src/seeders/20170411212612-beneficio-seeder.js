// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('beneficio', [
      {
        // 1
        nombre_beneficio: 'INAMOVILIDAD LABORAL',
        institucion: 'Ministerio de Trabajo, Empleo y Previsón Social',
        descripcion: 'Inamovilidad laboral registrado a partir del OVT',
        restriccion: true,
        empresa: true,
        estado: 'ACTIVO',
        fid_rol: 5, // SERVICIO_OVT
        _usuario_creacion: '1',
        _fecha_creacion: new Date(),
        _fecha_modificacion: new Date(),
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
