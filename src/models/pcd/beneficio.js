/**
 * Módulo que mapea los beneficios registrados.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const beneficio = sequelize.define('beneficio', {
    id_beneficio: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id del beneficio',
    },
    nombre_beneficio: {
      type: DataType.STRING(20),
      field: 'nombre_beneficio',
      xlabel: 'Nombre del beneficio',
      allowNull: false,
    },
    restriccion: {
      type: DataType.BOOLEAN,
      field: 'restriccion',
      xlabel: 'Restricción para bono',
      allowNull: false,
    },
    institucion: {
      type: DataType.STRING(255),
      field: 'institucion',
      xlabel: 'Institución',
      allowNull: false,
    },
    descripcion: {
      type: DataType.TEXT,
      field: 'descripcion',
      xlabel: 'Descripción',
      allowNull: true,
    },
    empresa: {
      type: DataType.BOOLEAN,
      field: 'empresa',
      xlabel: 'Identificador para solicitar atributo ID Empresa',
      defaultValue: false,
      allowNull: true,
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
            ['ACTIVO', 'INACTIVO', 'ELIMINADO'],
          ],
          msg: 'El campo estado sólo permite valores: ACTIVO, INACTIVO Y ELIMINADO',
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
        beneficio.belongsTo(models.rol, {
          as: 'rol',
          foreignKey: {
            name: 'fid_rol',
            targetKey: 'id_rol',
            allowNull: false,
            unique: 'unique',
          },
        });
      },
    },
    tableName: 'beneficio',
  });

  return beneficio;
};
