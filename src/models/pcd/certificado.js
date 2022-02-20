/**
 * Módulo que mapea los carnet's de las personas con discapacidad.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const certificado = sequelize.define('certificado', {
    id_certificado: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id de la certificado',
    },
    numero_registro: {
      type: DataType.STRING(20),
      field: 'numero_registro',
      xlabel: 'Número del certificado de la PCD',
      allowNull: false,
    },
    fecha_emision: {
      type: DataType.DATEONLY,
      field: 'fecha_emision',
      xlabel: 'Fecha de emisión',
      allowNull: false,
    },
    fecha_vigencia: {
      type: DataType.DATEONLY,
      field: 'fecha_vigencia',
      xlabel: 'Fecha de vigencia',
      allowNull: false,
    },
    tipo_discapacidad: {
      type: DataType.STRING(50),
      field: 'tipo_discapacidad',
      xlabel: 'Tipo de discapacidad',
      allowNull: false,
    },
    grado_discapacidad: {
      type: DataType.STRING(50),
      field: 'grado_discapacidad',
      xlabel: 'Grado de discapacidad',
      allowNull: false,
    },
    porcentaje_discapacidad: {
      type: DataType.INTEGER,
      field: 'porcentaje_discapacidad',
      xlabel: 'Porcentaje de discapacidad',
      allowNull: false,
    },
    tipo_certificado: {
      type: DataType.STRING(30),
      field: 'tipo_certificado',
      xlabel: 'Tipo certificado',
      allowNull: false,
      validate: {
        isIn: {
          args: [
            ['SIPRUNPCD', 'IBC'],
          ],
          msg: 'El campo Tipo certificado sólo permite valores: SIPRUNPCD, IBC',
        },
      },
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
        certificado.belongsTo(models.pcd, {
          as: 'pcd',
          foreignKey: {
            name: 'fid_pcd',
            targetKey: 'id_pcd',
            allowNull: false,
          },
        });
      },
    },
    tableName: 'certificado',
  });

  return certificado;
};