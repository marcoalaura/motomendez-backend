module.exports = (sequelize, DataType) => {
  const control_corte = sequelize.define('control_corte', {
    id_control_corte: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id del control del corte_mensual',
    },
    gestion: {
      type: DataType.STRING(4),
      field: 'gestion',
    },
    mes: {
      type: DataType.INTEGER,
      field: 'mes',
    },
    estado: {
      type: DataType.STRING(20),
      field: 'estado',
      xlabel: 'Estado',
      allowNull: false,
      defaultValue: 'PENDIENTE',
      validate: {
        isIn: {
          args: [
            ['PENDIENTE', 'FINALIZADO'],
          ],
          msg: 'El campo estado sólo permite valores: PENDIENTE, FINALIZADO',
        },
      },
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
    pasos: {
      type: DataType.TEXT,
      field: 'pasos',
      xlabel: 'Paso',
      allowNull: false,
      defaultValue: '',
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
    tableName: 'control_corte',
  });

  return control_corte;
};
