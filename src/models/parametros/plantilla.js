/**
 * Modelo para la tabla plantilla
 * @param {type} sequelize
 * @param {type} DataType
 * @returns plantilla
 */
module.exports = function (sequelize, DataType) {
  const plantilla = sequelize.define('plantilla', {
    id_plantilla: {
      type: DataType.INTEGER,
      primaryKey: true,
      xlabel: 'ID',
      autoIncrement: true,
    },
    nombre: {
      type: DataType.STRING(100),
      allowNull: false,
      xlabel: 'Nombre',
    },
    remitente: {
      type: DataType.STRING(150),
      allowNull: false,
      xlabel: 'Remitente',
    },
    origen: {
      type: DataType.STRING(150),
      allowNull: false,
      xlabel: 'Correo origen',
    },
    asunto: {
      type: DataType.STRING(150),
      allowNull: false,
      xlabel: 'Asunto',
    },
    contenido: {
      type: DataType.TEXT,
      allowNull: false,
      xlabel: 'Contenido del mensaje',
    },
    tipo: {
      type: DataType.STRING(30),
      xlabel: 'Tipo',
      allowNull: false,
      defaultValue: 'EMAIL',
      validate: {
        isIn: {
          args: [
            ['EMAIL'],
          ],
          msg: 'El campo Tipo permite valores: EMAIL.',
        },
      },
    },
    estado: {
      type: DataType.STRING(30),
      xlabel: 'Estado',
      allowNull: false,
      defaultValue: 'ACTIVO',
      validate: {
        isIn: {
          args: [
            ['ACTIVO', 'INACTIVO'],
          ],
          msg: 'El campo Estado permite valores: ACTIVO e INACTIVO.',
        },
      },
    },
    _usuario_creacion: {
      type: DataType.INTEGER,
      allowNull: false,
      xlabel: 'Usuario de creación',
    },
    _usuario_modificacion: {
      type: DataType.INTEGER,
      allowNull: true,
      xlabel: 'Usuario de modificación',
    },
  }, {
    createdAt: '_fecha_creacion',
    updatedAt: '_fecha_modificacion',
    freezeTableName: true,
  });

  return plantilla;
};
