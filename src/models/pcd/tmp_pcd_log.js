module.exports = (sequelize, DataType) => {
  const tmpPcdLog = sequelize.define('tmp_pcd_log', {
    id: { type: DataType.INTEGER, primaryKey: true, autoIncrement: true },
    datos: { type: DataType.JSONB },
    tipo_caso: {
      type: DataType.STRING(30),
      field: 'tipo_caso',
      xlabel: 'Tipo de caso',
      allowNull: false,
      validate: {
        isIn: {
          args: [
            ['SIPRUNPCD', 'TMPPCD'],
          ],
          msg: 'El campo tipo_caso sólo permite los valores: SIPRUNPCD o TMPPCD.',
        },
      },
    },
    _usuario_creacion: { type: DataType.INTEGER, allowNull: false },
    _fecha_creacion: { type: DataType.DATE },
  }, {
    createdAt: '_fecha_creacion',
    updatedAt: false,
    classMethods: {
      // Creando asociaciones para la entidad
      associate: () => {
      },
    },
    tableName: 'tmp_pcd_log',
  });
  tmpPcdLog.removeAttribute('id');

  return tmpPcdLog;
};
