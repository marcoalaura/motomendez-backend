/**
 * Módulo que mapea los USUARIOS_ROLES.
 *
 * @module
 *
 **/

module.exports = (sequelize, DataType) => {
  const usuario_rol = sequelize.define('usuario_rol', {
    id_usuario_rol: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id usuario rol',
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
        usuario_rol.belongsTo(models.usuario, { as: 'usuario', foreignKey: { name: 'fid_usuario', targetKey: 'id_usuario', allowNull: false } });
        usuario_rol.belongsTo(models.rol, { as: 'rol', foreignKey: { name: 'fid_rol', targetKey: 'id_rol', allowNull: false } });
      },
      tableName: 'usuario_rol',
    },
  });
  return usuario_rol;
};
