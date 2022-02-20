/**
 * Módulo par usuario
 *
 * @module
 *
 **/
import crypto from 'crypto';


module.exports = (sequelize, DataType) => {
  const usuario = sequelize.define('usuario', {
    id_usuario: {
      type: DataType.INTEGER,
      field: 'id_usuario',
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'ID',
    },
    email: {
      type: DataType.STRING(100),
      field: 'email',
      xlabel: 'Correo electrónico',
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { args: true, msg: 'El campo \'Correo Electrónico\' no tiene el formato correcto' },
        len: { args: [4, 100], msg: 'El campo \'Correo Electrónico\' permite un mínimo de 4 caracteres y un máximo de 100 caracteres' },
      },
    },
    usuario: {
      type: DataType.STRING(100),
      field: 'usuario',
      xlabel: 'Nombre de usuario',
      allowNull: false,
      unique: true,
      validate: {
        len: { args: [3, 100], msg: 'El campo \'Nombre de Usuario\' permite un mínimo de 3 caracteres y un máximo de 100 caracteres' },
      },
    },
    contrasena: {
      type: DataType.STRING,
      field: 'contrasena',
      xlabel: 'Contraseña',
      allowNull: false,
      defaultValue: '',
    },
    observaciones: {
      type: DataType.STRING(100),
      field: 'observaciones',
      xlabel: 'Observaciones',
      validate: {
        len: { args: [0, 100], msg: 'El campo \'Observaciones\' permite un máximo de 100 caracteres' },
      },
    },
    codigo_contrasena: {
      type: DataType.STRING(8),
      field: 'codigo_contrasena',
      xlabel: 'Código Contraseña',
      allowNull: true,
    },
    fecha_expiracion: {
      type: DataType.DATE,
      field: 'fecha_expiracion',
      xlabel: 'Fecha Expiración',
      allowNull: true,
    },
    token: {
      type: DataType.STRING(50),
      field: 'token',
      xlabel: 'Certificado digital',
      allowNull: true,
      validate: {
        len: { args: [0, 50], msg: 'El campo \'Certificado digital\' permite un máximo de 50 caracteres.' },
        is: { args: /^([A-Z|a-z|0-9| ]|)+$/i, msg: 'El campo \'Certificado digital\' sólo permite letras sin tíldes.' },
      },
    },
    estado: {
      type: DataType.STRING(30),
      field: 'estado',
      xlabel: 'Estado',
      allowNull: false,
      defaultValue: 'ACTIVO',
      validate: {
        isIn: {
          args: [['ACTIVO', 'BAJA', 'INACTIVO', 'PENDIENTE', 'ELIMINADO']],
          msg: 'El campo estado sólo permite valores: ACTIVO, BAJA, INACTIVO, PENDIENTE o ELIMINADO.',
        },
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
      // Creando asociaciones para la entidad
      associate: (models) => {
        usuario.belongsTo(models.persona, { as: 'persona', foreignKey: { name: 'fid_persona', targetKey: 'id_persona', allowNull: false, xchoice: 'nombres', xlabel: 'Nombres' } });
        usuario.belongsTo(models.dpa, { as: 'dpa', foreignKey: { name: 'cod_municipio', targetKey: 'cod_municipio', allowNull: true } });
        usuario.hasMany(models.usuario_rol, { as: 'usuarios_roles', foreignKey: { name: 'fid_usuario', allowNull: false } });
      },
      tableName: 'usuario',
      buscarIncluye: (Persona, UsuarioRol, Rol, Dpa, condicion, condicionRol) => usuario.findAndCountAll({
        attributes: ['id_usuario', 'email', 'estado', 'observaciones', 'fid_persona', 'cod_municipio'],
        where: condicion.where,
        offset: condicion.offset,
        limit: condicion.limit,
        order: condicion.order,
        distinct: true,
        include: [{
          model: Persona,
          as: 'persona',
          attributes: ['documento_identidad', 'complemento_documento', 'fecha_nacimiento', 'nombres', 'primer_apellido', 'segundo_apellido', 'casada_apellido', 'sexo', 'nombre_completo'],
          required: true,
        },
        {
          model: Dpa,
          as: 'dpa',
          attributes: ['cod_municipio', 'municipio', 'cod_provincia', 'provincia', 'cod_departamento', 'departamento'],
          requerid: false,
        },
        {
          model: UsuarioRol,
          as: 'usuarios_roles',
          attributes: ['id_usuario_rol'],
          // where: {
          //   estado: 'ACTIVO',
          // },
          where: condicionRol,
          include: [{
            model: Rol,
            as: 'rol',
            attributes: ['id_rol', 'nombre'],
          }],
        },
        ],
      }),
      buscarIncluyeOne: (id, Persona, UsuarioRol, Rol, Dpa) => usuario.findOne({
        attributes: ['id_usuario', 'email', 'estado', 'observaciones'],
        where: {
          id_usuario: id,
        },
        include: [{
          model: Persona,
          as: 'persona',
          attributes: ['documento_identidad', 'complemento_documento', 'fecha_nacimiento', 'nombres', 'primer_apellido',
            'segundo_apellido', 'casada_apellido', 'sexo', 'nombre_completo'],
        },
        {
          model: UsuarioRol,
          as: 'usuarios_roles',
          attributes: ['fid_rol'],
          where: {
            estado: 'ACTIVO',
          },
          include: [{
            model: Rol,
            as: 'rol',
            attributes: ['id_rol', 'nombre'],
          }],
        },
        {
          model: Dpa,
          as: 'dpa',
          attributes: ['cod_municipio', 'municipio', 'cod_provincia', 'provincia', 'cod_departamento', 'departamento'],
        },
        ],
      }),
    },
  });

  // Hash password usuario MD5 para eventos de actualizacion y creacion
  const hashPasswordHook = (instance) => {
    if (!instance.changed('contrasena')) return false;
    if (instance.get('contrasena').length < 8) {
      throw new Error('La contraseña debe contener al menos 8 caracteres.');
    }
    const contrasena = instance.get('contrasena');
    const password = crypto.createHash('md5').update(contrasena).digest('hex');
    instance.set('contrasena', password);
  };
  usuario.beforeCreate((usuario, options) => {
    hashPasswordHook(usuario);
    usuario.usuario = usuario.usuario.toLowerCase();
  });

  usuario.beforeUpdate(hashPasswordHook);
  return usuario;
};
