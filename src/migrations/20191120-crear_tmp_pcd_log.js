'use strict';

module.exports = {
  up: (queryInterface, DataType) => {
    return queryInterface.createTable({
      tableName: 'tmp_pcd_log',
    }, {
      id: { type: DataType.INTEGER, primaryKey: true, autoIncrement: true },
      datos: { type: DataType.JSONB },
      _usuario_creacion: { type: DataType.INTEGER, allowNull: false },
      _fecha_creacion: { type: DataType.DATE }
    }, {});
  },
  down: (migration, DataTypes, done) => {
    migration.sequelize.query('')
      .finally(done);
  },
};
