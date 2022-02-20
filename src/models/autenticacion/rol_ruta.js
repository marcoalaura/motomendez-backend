/**
 * Módulo que mapea los ROLES_RUTAS.
 *
 * @module
 *
 **/

module.exports = (sequelize, DataType) => {
  const rol_ruta = sequelize.define('rol_ruta', {
    id_rol_ruta: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id rol ruta',
    },
    method_get: {
      type: DataType.BOOLEAN,
      field: 'method_get',
      xlabel: 'Ver',
      defaultValue: false,
    },
    method_post: {
      type: DataType.BOOLEAN,
      field: 'method_post',
      xlabel: 'Crear',
      defaultValue: false,
    },
    method_put: {
      type: DataType.BOOLEAN,
      field: 'method_put',
      xlabel: 'Modificar',
      defaultValue: false,
    },
    method_delete: {
      type: DataType.BOOLEAN,
      field: 'method_delete',
      xlabel: 'Eliminar',
      defaultValue: false,
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
      allowNull: true,
    },
  }, {
    createdAt: '_fecha_creacion',
    updatedAt: '_fecha_modificacion',
    classMethods: {
      associate: (models) => {
        rol_ruta.belongsTo(models.rol, { as: 'rol', foreignKey: { name: 'fid_rol', targetKey: 'id_rol', allowNull: false, xchoice: 'rol', unique: 'compositeIndex' } });
        rol_ruta.belongsTo(models.ruta, { as: 'ruta', foreignKey: { name: 'fid_ruta', targetKey: 'id_ruta', allowNull: false, xchoice: 'ruta', unique: 'compositeIndex' } });
      },
      tableName: 'rol_ruta',
    },
  });

  return rol_ruta;
};
