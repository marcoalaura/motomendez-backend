/**
 * Módulo que mapea las personas con discapacidad.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const pcd = sequelize.define('pcd', {
    id_pcd: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id de la pcd',
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
            ['CREADO', 'ACTIVO', 'INACTIVO', 'ELIMINADO'],
          ],
          msg: 'El campo estado sólo permite valores: ACTIVO, INACTIVO o ELIMINADO.',
        },
      },
    },
    observacion: {
      type: DataType.TEXT,
      field: 'observacion',
      xlabel: 'Observación',
      allowNull: true,
    },
    codigo_beneficiario: {
      type: DataType.INTEGER,
      field: 'codigo_beneficiario',
      xlabel: 'Código beneficiario SIGEP',
      allowNull: true,
    },
    fecha_habilitacion: {
      type: DataType.INTEGER,
      field: 'fecha_habilitacion',
      xlabel: 'Fecha de habilitación',
      allowNull: true,
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
        pcd.belongsTo(models.persona, {
          as: 'persona',
          foreignKey: {
            name: 'fid_persona',
            unique: 'uniqueSelectedItem',
            targetKey: 'id_persona',
            allowNull: false,
          },
        });
        pcd.belongsTo(models.dpa, {
          as: 'pcd_dpa',
          foreignKey: {
            name: 'cod_municipio',
            targetKey: 'cod_municipio',
            allowNull: false,
          },
        });
        pcd.hasMany(models.certificado, {
          as: 'pcd_certificado',
          foreignKey: {
            name: 'fid_pcd',
            targetKey: 'id_dpcd',
            allowNull: false,
          },
        });
        pcd.hasMany(models.tutor, {
          as: 'pcd_tutor',
          foreignKey: {
            name: 'fid_pcd',
            targetKey: 'id_pcd',
            allowNull: false,
          },
        });
        pcd.hasMany(models.pcd_beneficio, {
          as: 'pcd_beneficio',
          foreignKey: {
            name: 'fid_pcd',
            targetKey: 'id_pcd',
            allowNull: false,
          },
        });
        pcd.hasMany(models.pcd_beneficio_mes, {
          as: 'pcd_beneficio_mes',
          foreignKey: {
            name: 'fid_pcd',
            targetKey: 'id_pcd',
            allowNull: false,
          },
        });
      },
    },
    tableName: 'pcd',
  });

  return pcd;
};
