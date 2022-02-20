/**
 * Módulo que mapea las RUTAS existentes, rutas con las que se relaciona los
 * roles
 *
 * @module
 *
 **/

module.exports = (sequelize, DataType) => {
  const ruta = sequelize.define('ruta', {
    id_ruta: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id Ruta',
    },
    ruta: {
      type: DataType.STRING(150),
      field: 'ruta',
      xlabel: 'Ruta',
      allowNull: false,
      unique: true,
      validate: {
        len: { args: [3, 150], msg: 'El campo \'Ruta\' permite un mínimo de 3 caracteres y un máximo de 150 caracteres' },
      },
    },
    descripcion: {
      type: DataType.STRING(200),
      field: 'descripcion',
      xlabel: 'Descripción',
      allowNull: true,
      validate: {
        len: { args: [0, 200], msg: 'El campo \'Descripción\' permite un máximo de 200 caracteres' },
      },
    },
    method_get: {
      type: DataType.BOOLEAN,
      field: 'method_get',
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
        ruta.hasMany(models.rol_ruta, { as: 'rol_ruta', foreignKey: { name: 'fid_ruta', allowNull: false, xchoice: 'rutas' } });
      },
      tableName: 'ruta',
      buscar: (condicion) => ruta.findAll({
        attributes: ['id_ruta', 'ruta', 'descripcion', 'method_get', 'method_post', 'method_put', 'method_delete', 'estado'],
        where: condicion,
      }),
      buscarPaginacion: (condicion, resultados, pagina) => ruta.findAndCountAll({
        attributes: ['id_ruta', 'ruta', 'descripcion', 'method_get', 'method_post', 'method_put', 'method_delete', 'estado'],
        where: {estado: 'ACTIVO' },
        limit: resultados,
        offset: pagina,
      }),
      buscarPorId: (id_ruta) => ruta.findById(id_ruta, {
        attributes: ['id_ruta', 'ruta', 'descripcion', 'method_get', 'method_post', 'method_put', 'method_delete', 'estado'],
      }),
    },
  });
  return ruta;
};
