module.exports = (sequelize, DataType) => {
  const control_api = sequelize.define('control_api', {
    id_control_api: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id del control del control_api',
    },
    tipo_corte: {
      type: DataType.STRING(20),
      field: 'tipo_corte',
      xlabel: 'Tipo de corte',
      allowNull: false,
      validate: {
        isIn: {
          args: [
            ['ANUAL', 'MENSUAL'],
          ],
          msg: 'El campo tipo de corte sólo permite valores: ANUAL, MENSUAL',
        },
      },
    },
    orden: {
      type: DataType.INTEGER,
      field: 'orden',
      xlabel: 'Orden',
      allowNull: false,
      defaultValue: '',
    },
    paso: {
      type: DataType.TEXT,
      field: 'paso',
      xlabel: 'Paso',
      allowNull: false,
      defaultValue: '',
    },
    estado: {
      type: DataType.STRING(20),
      field: 'estado',
      xlabel: 'Estado',
      allowNull: false,
      defaultValue: 'HABILITADO',
      validate: {
        isIn: {
          args: [
            ['HABILITADO', 'EJECUCION'],
          ],
          msg: 'El campo estado sólo permite valores: HABILITADO, EJECUCION',
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
    tableName: 'control_api',
  });

  return control_api;
};
