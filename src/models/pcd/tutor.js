/**
 * Módulo que mapea los tutores de las personas con discapacidad.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const tutor = sequelize.define('tutor', {
    id_tutor: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id de la tutor',
    },
    documento_descripcion: {
      type: DataType.TEXT,
      field: 'documento_descripcion',
      xlabel: 'Descripción documento que acredita al tutor',
      allowNull: false,
    },
    documento_ruta: {
      type: DataType.TEXT,
      field: 'documento_ruta',
      xlabel: 'Ruta documento adjunto que acredita al tutor',
      allowNull: false,
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
        tutor.belongsTo(models.persona, {
          as: 'persona',
          foreignKey: {
            name: 'fid_persona',
            targetKey: 'id_persona',
            allowNull: false,
          },
        });
        tutor.belongsTo(models.parametro, {
          as: 'parentesco',
          foreignKey: {
            name: 'fid_parametro',
            targetKey: 'id_parametro',
            allowNull: false,
          },
        });
      },
    },
    tableName: 'tutor',
  });

  return tutor;
};
