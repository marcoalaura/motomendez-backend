// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('parametro', [
      // Tipos de Documentos de identidad
      {
        id_parametro: 21,
        sigla: 'PV',
        nombre: '1',
        descripcion: 'Pivote del número máximo de validación',
        orden: 1,
        grupo: 'PIVOTE',
        estado: 'ACTIVO',
        _usuario_creacion: 1,
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
