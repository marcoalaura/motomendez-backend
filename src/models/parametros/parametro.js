/**
 * Módulo que mapea los PARAMETROS existentes, conjunto de valores parametricos
 * que son asignados a distintas tablas.
 *
 * @module
 *
 **/

module.exports = (sequelize, DataType) => {
  const parametro = sequelize.define('parametro', {
    id_parametro: {
      type: DataType.INTEGER,
      primaryKey: true,
      xlabel: 'ID',
    },
    grupo: {
      type: DataType.STRING(30),
      field: 'grupo',
      xlabel: 'Grupo',
      allowNull: false,
    },
    sigla: {
      type: DataType.STRING(30),
      field: 'sigla',
      xlabel: 'Sigla',
      allowNull: false,
    },
    nombre: {
      type: DataType.STRING(50),
      field: 'nombre',
      xlabel: 'Nombre',
      allowNull: false,
    },
    descripcion: {
      type: DataType.STRING(100),
      field: 'descripcion',
      xlabel: 'Descripción',
    },
    orden: {
      type: DataType.INTEGER,
      field: 'orden',
      xlabel: 'Orden',
      allowNull: false,
    },
    estado: {
      type: DataType.STRING(30),
      field: 'estado',
      xlabel: 'Estado',
      allowNull: false,
      defaultValue: 'ACTIVO',
      validate: {
        isIn: { args: [['ACTIVO', 'INACTIVO', 'ELIMINADO']], msg: 'El campo estado sólo permite valores: ACTIVO, INACTIVO o ELIMINADO.' },
      },
    },
    _usuario_creacion: {
      type: DataType.STRING(50),
      field: '_usuario_creacion',
      xlabel: 'Usuario de creación',
      allowNull: false,
    },
    _usuario_modificacion: {
      type: DataType.STRING(50),
      field: '_usuario_modificacion',
      xlabel: 'Usuario de modificación',
    },
  }, {
    createdAt: '_fecha_creacion',
    updatedAt: '_fecha_modificacion',
    classMethods: {
      associate: (models) => {
       
      },
    },
    tableName: 'parametro',
  });
  return parametro;
};
