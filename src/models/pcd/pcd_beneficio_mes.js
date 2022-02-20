/**
 * Módulo que mapea los beneficios que tiene la persona con discapacidad.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const pcd_beneficio_mes = sequelize.define('pcd_beneficio_mes', {
    id_pcd_beneficio_mes: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id del pcd_beneficio_mes'
    },
    fecha_inicio: {
      type: DataType.DATEONLY,
      field: 'fecha_inicio',
      xlabel: 'Fecha inicio del beneficio',
      allowNull: false,
    },
    fecha_fin: {
      type: DataType.DATEONLY,
      field: 'fecha_fin',
      xlabel: 'Fecha fin del beneficio',
      allowNull: true,
    },
    descripcion: {
      type: DataType.TEXT,
      field: 'descripcion',
      xlabel: 'Descripción',
      allowNull: true
    },
    observacion: {
      type: DataType.TEXT,
      field: 'observacion',
      xlabel: 'Observación',
      allowNull: true
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
            ['ACTIVO', 'INACTIVO', 'ELIMINADO']
          ],
          msg: 'El campo estado sólo permite valores: ACTIVO, INACTIVO Y ELIMINADO'
        }
      }
    },
    nit: {
      field: 'nit',
      type: DataType.BIGINT,
      xlabel: 'Nit de la empresa enviado en el servicio',
      allowNull: true
    },
    matricula: {
      field: 'matricula',
      type: DataType.BIGINT,
      xlabel: 'Matricula de la empresa enviado en el servicio',
      allowNull: true
    },
    tipo: {
      type: DataType.STRING(30),
      field: 'tipo',
      xlabel: 'Tipo',
      allowNull: false,
      defaultValue: 'DIRECTO',
      validate: {
        isIn: {
          args: [
            ['DIRECTO', 'INDIRECTO']
          ],
          msg: 'El campo estado sólo permite valores: DIRECTO, INDIRECTO'
        }
      }
    },
    mes: {
      type: DataType.INTEGER,
      field: 'mes',
      allowNull: false
    },
    _usuario_creacion: {
      type: DataType.INTEGER,
      field: '_usuario_creacion',
      xlabel: 'Usuario de creación',
      allowNull: false
    },
    _usuario_modificacion: {
      type: DataType.INTEGER,
      field: '_usuario_modificacion',
      xlabel: 'Usuario de modificación'
    }
  }, {
    createdAt: '_fecha_creacion',
    updatedAt: '_fecha_modificacion',
    classMethods: {
      // Creando asociaciones para la entidad
      associate: (models) => {
        pcd_beneficio_mes.belongsTo(models.pcd, {
          as: 'pcd',
          foreignKey: {
            name: 'fid_pcd',
            targetKey: 'id_pcd',
            allowNull: false
          }
        });
        pcd_beneficio_mes.belongsTo(models.beneficio, {
          as: 'beneficio',
          foreignKey: {
            name: 'fid_beneficio',
            targetKey: 'id_beneficio',
            allowNull: false
          }
        });
        pcd_beneficio_mes.belongsTo(models.tutor_ovt, {
          as: 'tutor_ovt',
          foreignKey: {
            name: 'fid_tutor_ovt',
            targetKey: 'id_tutor_ovt',
            allowNull: true
          }
        });
        pcd_beneficio_mes.belongsTo(models.gestion, {
          as: 'gestion',
          foreignKey: {
            name: 'fid_gestion',
            targetKey: 'id_gestion',
            allowNull: false
          }
        });
      }
    },
    tableName: 'pcd_beneficio_mes'
  });

  return pcd_beneficio_mes;
};
