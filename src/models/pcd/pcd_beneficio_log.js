/**
 * Módulo que mapea los beneficios que tiene la persona con discapacidad.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const pcd_beneficio_log = sequelize.define('pcd_beneficio_log', {
    id_pcd_beneficio_log: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id del pcd_beneficio_log',
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
      xlabel: 'Descripción del beneficio',
      allowNull: true,
    },
    observacion: {
      type: DataType.TEXT,
      field: 'observacion',
      xlabel: 'Observación del beneficio',
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
    nit: {
      field: 'nit',
      type: DataType.BIGINT,
      xlabel: 'Nit de la empresa enviado en el servicio',
      allowNull: true,
    },
    matricula: {
      field: 'matricula',
      type: DataType.BIGINT,
      xlabel: 'Matricula de la empresa enviado en el servicio',
      allowNull: true,
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
            ['DIRECTO', 'INDIRECTO'],
          ],
          msg: 'El campo estado sólo permite valores: DIRECTO, INDIRECTO',
        },
      },
    },
    mes: {
      type: DataType.INTEGER,
      field: 'mes',
      allowNull: false,
    },
    modalidad_contrato: {
      type: DataType.STRING(30),
      field: 'modalidad_contrato',
      xlabel: 'Modalidad contrato',
      allowNull: true,
    },
    documento_identidad: {
      type: DataType.STRING(15),
      field: 'documento_identidad',
      xlabel: 'Documento identidad',
      allowNull: true,
    },
    complemento_documento: {
      type: DataType.STRING(20),
      field: 'complemento_documento',
      xlabel: 'Complemento del documento',
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataType.DATEONLY,
      field: 'fecha_nacimiento',
      xlabel: 'Fecha de nacimiento',
      allowNull: true,
    },
    nombres: {
      type: DataType.STRING(100),
      field: 'nombres',
      xlabel: 'Nombres',
      allowNull: true,
    },
    primer_apellido: {
      type: DataType.STRING(20),
      field: 'primer_apellido',
      xlabel: 'Primer apellido',
      allowNull: true,
    },
    segundo_apellido: {
      type: DataType.STRING(20),
      field: 'segundo_apellido',
      xlabel: 'Segundo apellido',
      allowNull: true,
    },
    tipo_documento_identidad: {
      type: DataType.INTEGER,
      field: 'tipo_documento_identidad',
      xlabel: 'Tipo documento identidad',
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
        pcd_beneficio_log.belongsTo(models.pcd, {
          as: 'pcd',
          foreignKey: {
            name: 'fid_pcd',
            targetKey: 'id_pcd',
            allowNull: true,
          },
        });
        pcd_beneficio_log.belongsTo(models.beneficio, {
          as: 'beneficio',
          foreignKey: {
            name: 'fid_beneficio',
            targetKey: 'id_beneficio',
            allowNull: false,
          },
        });
        pcd_beneficio_log.belongsTo(models.tutor_ovt, {
          as: 'tutor_ovt',
          foreignKey: {
            name: 'fid_tutor_ovt',
            targetKey: 'id_tutor_ovt',
            allowNull: true,
          },
        });
        pcd_beneficio_log.belongsTo(models.gestion, {
          as: 'gestion',
          foreignKey: {
            name: 'fid_gestion',
            targetKey: 'id_gestion',
            allowNull: false
          }
        });
      },
    },
    tableName: 'pcd_beneficio_log',
  });

  return pcd_beneficio_log;
};
