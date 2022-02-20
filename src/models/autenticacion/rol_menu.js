/**
 * Módulo que mapea los ROLES_MENUS.
 *
 * @module
 *
 **/

module.exports = (sequelize, DataType) => {
  const rol_menu = sequelize.define('rol_menu', {
    id_rol_menu: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id rol menú',
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
        rol_menu.belongsTo(models.rol, { as: 'rol', foreignKey: { name: 'fid_rol', targetKey: 'id_rol', allowNull: false, xchoice: 'rol', unique: 'compositeIndex' } });
        rol_menu.belongsTo(models.menu, { as: 'menu', foreignKey: { name: 'fid_menu', targetKey: 'id_menu', allowNull: false, xchoice: 'menu', unique: 'compositeIndex' } });
      },
      tableName: 'rol_menu',
    },
  });
  return rol_menu;
};
