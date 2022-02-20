'use strict';

module.exports = {
  up: (queryInterface, DataType) => {
    return queryInterface.createTable({
      tableName: 'control_api',
    }, {
      id_control_api: { type: DataType.INTEGER, primaryKey: true, autoIncrement: true },
      tipo_corte: { type: DataType.STRING(20) },
      orden: { type: DataType.INTEGER },
      paso: { type: DataType.STRING(150) },
      estado: { type: DataType.STRING(20) },
      _usuario_creacion: { type: DataType.INTEGER, allowNull: false },
      _usuario_modificacion: { type: DataType.INTEGER, allowNull: false },
      _fecha_creacion: { type: DataType.DATE },
      _fecha_modificacion: { type: DataType.DATE }
    }, {});
  },
  down: (migration, DataTypes, done) => {
    migration.sequelize.query('')
      .finally(done);
  },
};
