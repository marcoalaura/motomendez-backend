/**
 * Módulo que mapea la gestión y el mes de los listados para los pagos.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const mes = sequelize.define('mes', {
    id_mes: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id del mes',
    },
    mes: {
      type: DataType.INTEGER,
      field: 'mes',
      xlabel: 'Mes',
      unique: 'uniqueSelectedItem',
      allowNull: false,
    },
    fecha_envio: {
      type: DataType.DATEONLY,
      field: 'fecha_envio',
      xlabel: 'Fecha de envio',
      allowNull: true,
    },
    estado: {
      type: DataType.STRING(30),
      field: 'estado',
      xlabel: 'Estado',
      allowNull: false,
      defaultValue: 'GENERADO',
      validate: {
        isIn: {
          args: [
            ['GENERADO', 'ENVIADO'],
          ],
          msg: 'El campo estado sólo permite valores: GENERADO, ENVIADO',
        },
      },
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
      // Creando asociaciones para la entidad
      associate: (models) => {
        mes.belongsTo(models.gestion, {
          as: 'gestion',
          foreignKey: {
            name: 'fid_gestion',
            targetKey: 'id_gestion',
            allowNull: false,
            unique: 'uniqueSelectedItem',
          },
        });
      },
    },
    tableName: 'mes',
  });

  return mes;
};
