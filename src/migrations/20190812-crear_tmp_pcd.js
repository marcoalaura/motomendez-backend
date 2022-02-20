'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable({
      tableName: 'tmp_pcd',
    }, {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      documento_identidad: { type: DataTypes.STRING(25), allowNull: false },
      complemento_documento: { type: DataTypes.STRING(20) },
      expedido: { type: DataTypes.INTEGER },
      tipo_documento: { type: DataTypes.INTEGER },
      fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
      nombres: { type: DataTypes.STRING(100) },
      primer_apellido: { type: DataTypes.STRING(100) },
      segundo_apellido: { type: DataTypes.STRING(100) },
      casada_apellido: { type: DataTypes.STRING(100) },
      formato_inf: { type: DataTypes.STRING(4) },
      sexo: { type: DataTypes.STRING(1) },
      estado_civil: { type: DataTypes.STRING(1) },
      direccion: { type: DataTypes.STRING(250) },
      telefono: { type: DataTypes.STRING(25) },
      codigo_municipio: { type: DataTypes.STRING(6) },
      numero_registro: { type: DataTypes.STRING(20) },
      fecha_emision: { type: DataTypes.DATEONLY },
      fecha_vigencia: { type: DataTypes.DATEONLY },
      tipo_discapacidad: { type: DataTypes.STRING(50) },
      grado_discapacidad: { type: DataTypes.STRING(50) },
      porcentaje_discapacidad: { type: DataTypes.INTEGER },
      tipo: { type: DataTypes.STRING(10) },
      observacion_contrastacion: { type: DataTypes.STRING(500) },
      estado_contrastacion: { type: DataTypes.STRING(30), defaultValue: 'PENDIENTE' },
      fecha_registro: { type: DataTypes.DATEONLY },
      mes_carga: { type: DataTypes.INTEGER },
      gestion_carga: { type: DataTypes.INTEGER },
      estado: { type: DataTypes.STRING(30), defaultValue: 'ACTIVO' },
      observacion_estado: { type: DataTypes.STRING(500) },
      estado_corte_anual: { type: DataTypes.STRING(15), defaultValue: 'HABILITADO' },
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
