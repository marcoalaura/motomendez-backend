/**
 * Módulo que mapea la gestión y el mes de los listados para los pagos.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const gestion = sequelize.define('gestion', {
    id_gestion: {
      type: DataType.INTEGER,
      primaryKey: true,
      xlabel: 'Gestión',
    },
    estado: {
      type: DataType.STRING(30),
      field: 'estado',
      xlabel: 'Estado',
      allowNull: false,
      defaultValue: 'ACTIVO',
      validate: {
        isIn: {
          args: [
            ['ACTIVO', 'INACTIVO'],
          ],
          msg: 'El campo estado sólo permite valores: ACTIVO, INACTIVO',
        },
      },
    },
    hash: {
      type: DataType.TEXT,
      field: 'hash',
    },
    ruta_documento: {
      type: DataType.STRING(255),
      field: 'ruta_documento',
    },
    observacion: {
      type: DataType.STRING(255),
      field: 'observacion',
    },
    _usuario_creacion: {
      type: DataType.INTEGER,
      field: '_usuario_creacion',
      xlabel: 'Usuario de creación',
      allowNull: false,
    },
    _usuario_modificacion: {
      type: DataType.INTEGER,
      field: '_usuario_modificacion',
      xlabel: 'Usuario de modificación',
    },
  }, {
    createdAt: '_fecha_creacion',
    updatedAt: '_fecha_modificacion',
    classMethods: {
      associate: (models) => {
        gestion.hasMany(models.mes, {
          as: 'mes',
          foreignKey: {
            name: 'fid_gestion',
          },
        });
      },
    },
    tableName: 'gestion',
  });

  return gestion;
};
