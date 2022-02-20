
module.exports = (sequelize, DataType) => {
  const log_servicio_siprunpcd = sequelize.define('log_servicio_siprunpcd', {
    id_log_servicio_siprunpcd: {
      type: sequelize.Sequelize.UUID,
      primaryKey: true,
      defaultValue: sequelize.Sequelize.UUIDV4,
      // autoIncrement: true,
    },
    observacion: {
      type: DataType.STRING(500),
      field: 'observacion',
      allowNull: false,
    },
    fecha_peticion: {
      type: DataType.DATE,
      field: 'fecha_peticion',
      allowNull: false,
    },
    fecha_inicio: {
      type: DataType.DATE,
      field: 'fecha_inicio',
      allowNull: false,
    },
    fecha_fin: {
      type: DataType.DATE,
      field: 'fecha_fin',
      allowNull: false,
    },
    documento_identidad: {
      type: DataType.STRING(15),
      field: 'documento_identidad',
      allowNull: false,
    },
    fecha_nacimiento: {
      type: DataType.DATEONLY,
      field: 'fecha_nacimiento',
      allowNull: false,
    },
    estado: {
      type: DataType.STRING(30),
      field: 'estado',
      xlabel: 'Estado',
      allowNull: false,
      defaultValue: 'OBSERVADO',
      validate: {
        isIn: {
          args: [
            ['REGISTRADO', 'OBSERVADO', 'ENVIADO', 'CORREGIDO'],
          ],
          msg: 'El campo estado sólo permite valores: REGISTRADO, OBSERVADO, ENVIADO o CORREGIDO.',
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
    },
    tableName: 'log_servicio_siprunpcd',
  });

  return log_servicio_siprunpcd;
};
