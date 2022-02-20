/**
 * Módulo que mapea los MENUS existentes
 *
 * @module
 *
 **/

module.exports = (sequelize, DataType) => {
  const menu = sequelize.define('menu', {
    id_menu: {
      type: DataType.INTEGER,
      primaryKey: true,
      xlabel: 'Id Menú',
      autoIncrement: true,
    },
    nombre: {
      type: DataType.STRING(100),
      field: 'nombre',
      xlabel: 'Nombre',
      allowNull: false,
      // unique: true,
    },
    descripcion: {
      type: DataType.STRING(150),
      field: 'descripcion',
      xlabel: 'Descripción',
      allowNull: true,
    },
    orden: {
      type: DataType.INTEGER,
      field: 'orden',
      xlabel: 'Orden',
      allowNull: false,
    },
    ruta: {
      type: DataType.STRING(100),
      field: 'ruta',
      xlabel: 'Ruta',
      allowNull: true,
    },
    icono: {
      type: DataType.STRING(100),
      field: 'icono',
      xlabel: 'Ícono',
      allowNull: true,
    },
    method_get: {
      type: DataType.BOOLEAN,
      filed: 'method_get',
      xlabel: 'Ver',
      allowNull: true,
    },
    method_post: {
      type: DataType.BOOLEAN,
      field: 'method_post',
      xlabel: 'Crear',
      allowNull: true,
    },
    method_put: {
      type: DataType.BOOLEAN,
      field: 'method_put',
      xlabel: 'Modificar',
      allowNull: true,
    },
    method_delete: {
      type: DataType.BOOLEAN,
      field: 'method_delete',
      xlabel: 'Eliminar',
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
        menu.belongsTo(models.menu, { as: 'menu_padre', foreignKey: { name: 'fid_menu_padre', targetKey: 'id_menu', allowNull: true, xchoice: 'nombre' } });
        menu.hasMany(models.menu, { as: 'submenus', foreignKey: { name: 'fid_menu_padre', allowNull: true } });
        menu.hasMany(models.rol_menu, { as: 'rol_menu', foreignKey: { name: 'fid_menu', allowNull: false } });
      },
      tableName: 'menu',
      buscarMenusSubmenus: () => menu.findAll({
        attributes: ['id_menu', 'nombre', 'descripcion', 'orden', 'ruta', 'icono', 'method_get', 'method_post', 'method_put', 'method_delete', 'estado', 'fid_menu_padre'],
        where: { estado: 'ACTIVO', fid_menu_padre: null },
        include: [
          {
            model: sequelize.models.menu,
            join: 'left',
            attributes: ['id_menu', 'nombre', 'descripcion', 'orden', 'ruta', 'icono', 'method_get', 'method_post', 'method_put', 'method_delete', 'estado', 'fid_menu_padre'],
            as: 'submenus',
            where: { estado: 'ACTIVO' },
            paranoid: false,
            required: false,
            order: 'orden ASC',
          },
        ],
        order: 'orden ASC',
      }),
      buscarPorId: (id_menu) => menu.findById(id_menu, {
        attributes: ['id_menu', 'nombre', 'descripcion', 'orden', 'ruta', 'icono', 'method_get', 'method_post', 'method_put', 'method_delete', 'estado', 'fid_menu_padre'],
      }),
    },
  });

  menu.beforeCreate((menu, options) => {
    if (menu.nombre === undefined) {
      throw new Error('El campo nombre menú es obligatorio.');
    }
    if (menu.nombre != null) {
      menu.nombre = menu.nombre.toUpperCase();
    }
  });

  menu.beforeUpdate((menu, options) => {
    if (menu.nombre === undefined) {
      throw new Error('El campo nombre menú es obligatorio.');
    }
    if (menu.nombre != null) {
      menu.nombre = menu.nombre.toUpperCase();
    }
  });

  return menu;
};
