module.exports = (sequelize, DataTypes) => {
  const reporte_mensual = sequelize.define('reporte_mensual', {
    id_reporte_mensual: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hash: {
      type: DataTypes.TEXT,
      field: 'hash',
    },
    ruta_documento: {
      type: DataTypes.STRING(255),
      field: 'ruta_documento',
    },
    observacion: {
      type: DataTypes.STRING(255),
      field: 'observacion',
    },
    estado: {
      type: DataTypes.STRING(30),
      field: 'estado',
      xlabel: 'Estado',
      allowNull: false,
      defaultValue: 'PENDIENTE',
      validate: {
        isIn: {
          args: [
            ['GENERADO', 'PENDIENTE'],
          ],
          msg: 'El campo estado sólo permite valores: GENERADO, PENDIENTE.',
        },
      },
    },
  }, {
    createdAt: '_fecha_creacion',
    updateDAt: '_fecha_modificacion',
    classMethods: {
      associate: (models) => {
        reporte_mensual.belongsTo(models.mes, {
          as: 'municipio_mes',
          foreignKey: {
            name: 'fid_mes',
            targetKey: 'id_mes',
            allowNull: false,
            unique: 'unique',
          },
        });
        reporte_mensual.belongsTo(models.dpa, {
          as: 'dpa',
          foreignKey: {
            name: 'fid_municipio',
            targetKey: 'cod_municipio',
            allowNull: false,
            unique: 'unique',
          },
        });
      },
    },
    tableName: 'reporte_mensual',
  });
  return reporte_mensual;
};
