'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable({
      tableName: 'tmp_corte_anual'
    }, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nro: { type: DataTypes.INTEGER },
      exp_departamento: { type: DataTypes.STRING(30) },
      cod_beneficiario: { type: DataTypes.INTEGER },
      nro_documento: { type: DataTypes.STRING(30) },
      complemento: { type: DataTypes.STRING(30) },
      exp_pais: { type: DataTypes.STRING(30) },
      primer_apellido: { type: DataTypes.STRING(30) },
      segundo_apellido: { type: DataTypes.STRING(30) },
      apellido_casada: { type: DataTypes.STRING(30) },
      nombres: { type: DataTypes.STRING(30) },
      estado_civil: { type: DataTypes.STRING(30) },
      formato_inf: { type: DataTypes.STRING(30) },
      fecha_nacimiento: { type: DataTypes.STRING(30) },
      tipo_discapacidad: { type: DataTypes.STRING(30) },
      grados_disc: { type: DataTypes.STRING(30) },
      porcentaje: { type: DataTypes.STRING(30) },
      fecha_vigencia: { type: DataTypes.STRING(30) },
      pais: { type: DataTypes.STRING(30) },
      codigo_municipal: { type: DataTypes.STRING(30) },
      nombre_municipio: { type: DataTypes.STRING(100) },
      direccion: { type: DataTypes.STRING(255) },
      telefono: { type: DataTypes.STRING(30) },
      celular: { type: DataTypes.STRING(30) },
      observacion_contrastacion: { type: DataTypes.STRING(100) },
      estado_contrastacion: { type: DataTypes.STRING(30) },
      gestion: { type: DataTypes.INTEGER },
      tipo: { type: DataTypes.STRING(10) },
      estado: { type: DataTypes.STRING(20), defaultValue: 'PENDIENTE' },
      observacion: { type: DataTypes.STRING(100), defaultValue: '' },
      _usuario_creacion: { type: DataTypes.INTEGER, allowNull: false },
      _usuario_modificacion: { type: DataTypes.INTEGER },
      _fecha_creacion: { type: DataTypes.DATE },
      _fecha_modificacion: { type: DataTypes.DATE },
    }, {});
  },
  down: (migration, DataTypes, done) => {
    migration.sequelize.query('')
      .finally(done);
  },
};