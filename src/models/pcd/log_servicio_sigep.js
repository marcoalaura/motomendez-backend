module.exports = (sequelize, DataTypes) => {
  const log_servicio_sigep = sequelize.define('log_servicio_sigep', {
    id_log_servicio_sigep: {
     // type: sequelize.Sequelize.UUID,
     // primaryKey: true,
     // defaultValue: sequelize.Sequelize.UUIDV4,
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numero_documento: {
      type: DataTypes.STRING(25),
      field: 'documento_identidad',
      allowNull: false,
    },
    complemento: {
      type: DataTypes.STRING(2),
      field: 'complemento',
      allowNull: true,
    },
    exp_departamento: {
      type: DataTypes.INTEGER,
      field: 'exp_departamento',
      allowNull: false,
    },
    exp_pais: {
      type: DataTypes.STRING(2),
      field: 'exp_pais',
      allowNull: false,
    },
    primer_apellido: {
      type: DataTypes.STRING(100),
      field: 'primer_apellido',
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'El campo \'Primer apellido\' permite un mínimo de 1 caracter y un máximo de 100 caracteres',
        },
        is: {
          args: /^([A-Z|Á|É|Í|Ó|Ú|À|È|Ì|Ò|Ù|Ä|Ë|Ï|Ö|Ü|Â|Ê|Î|Ô|Û|Ñ|'|´| ]|)+$/i,
          msg: 'El campo \'Primer apellido\' permite sólo letras',
        },
      },
    },
    segundo_apellido: {
      type: DataTypes.STRING(100),
      field: 'segundo_apellido',
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'El campo \'Segundo apellido\' permite un mínimo de 1 caracter y un máximo de 100 caracteres',
        },
        is: {
          args: /^([A-Z|Á|É|Í|Ó|Ú|À|È|Ì|Ò|Ù|Ä|Ë|Ï|Ö|Ü|Â|Ê|Î|Ô|Û|Ñ|'|´| ]|)+$/i,
          msg: 'El campo \'Segundo apellido\' permite sólo letras',
        },
      },
    },
    apellido_casada: {
      type: DataTypes.STRING(100),
      field: 'apellido_casada',
      xlabel: 'Apellido de casada',
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'El campo \'Apellido de casada\' permite un máximo de 100 caracteres',
        },
        is: {
          args: /^([A-Z|Á|É|Í|Ó|Ú|À|È|Ì|Ò|Ù|Ä|Ë|Ï|Ö|Ü|Â|Ê|Î|Ô|Û|Ñ|'|´| ]|)+$/i,
          msg: 'El campo \'Apellido de casada\' permite solo letras',
        },
      },
    },
    nombres: {
      type: DataTypes.STRING(100),
      field: 'nombres',
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: 'El campo \'Nombres\' permite un mínimo de 1 caracter y un máximo de 100 caracteres',
        },
        is: {
          args: /^[A-Z|Á|É|Í|Ó|Ú|À|È|Ì|Ò|Ù|Ä|Ë|Ï|Ö|Ü|Â|Ê|Î|Ô|Û|Ñ|'|´| ]+$/i,
          msg: 'El campo \'Nombres\' permite sólo letras',
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: {
          args: [true],
          msg: "El campo 'Correo Electrónico' no cuenta con el formato de un correo electrónico válido. Ej.: micorreo@midominio.com",
        },
        len: {
          args: [5, 100],
          msg: "El campo 'Correo electrónico' permite un mínimo de 5 caracteres y un máximo de 100 caracteres.",
        },
      },
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      field: 'fecha_nacimiento',
      allowNull: false,
    },
    estado_civil: {
      type: DataTypes.STRING(1),
      field: 'estado_civil',
      allowNull: false,
    },
    formato_inf: {
      type: DataTypes.STRING(4),
      field: 'formato_inf',
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING(2),
      field: 'pais',
    },
    ciudad: {
      type: DataTypes.STRING(25),
      field: 'ciudad',
    },
    casilla_postal: {
      type: DataTypes.STRING(50),
      field: 'casilla_postal',
    },
    localidad: {
      type: DataTypes.STRING(50),
      field: 'localidad',
    },
    direccion: {
      type: DataTypes.STRING(300),
      field: 'direccion',
    },
    telefono: {
      type: DataTypes.STRING(15),
      field: 'telefono',
    },
    celular: {
      type: DataTypes.STRING(15),
      field: 'celular',
    },
    fax: {
      type: DataTypes.STRING(25),
      field: 'fax',
    },
    cod_beneficiario: {
      type: DataTypes.INTEGER(),
      field: 'cod_beneficiario',
    },
    id_ubigeo: {
      type: DataTypes.INTEGER(),
      field: 'id_ubigeo',
      allowNull: false,
    },
    id_entidad_pago: {
      type: DataTypes.STRING(10),
      field: 'id_entidad_pago',
      allowNull: false,
    },
    observacion: {
      type: DataTypes.STRING(500),
      field: 'observacion',
    },
    estado: {
      type: DataTypes.STRING(30),
      field: 'estado',
      allowNull: false,
      defaultValue: 'CREADO',
      validate: {
        isIn: {
          args: [
            ['CREADO', 'REGISTRADO_SIGEP', 'ACTUALIZADO_SIGEP', 'OBSERVADO_REG', 'OBSERVADO_ACT'],
          ],
          msg: 'El campo estado sólo permite valores: CREADO, REGISTRADO_SIGEP, ACTUALIZADO_SIGEP, OBSERVADO_REG, OBSERVADO_ACT',
        },
      },
    },
    _usuario_creacion: {
      type: DataTypes.INTEGER,
      field: '_usuario_creacion',
      xlabel: 'Usuario de creación',
      allowNull: false,
    },
    _usuario_modificacion: {
      type: DataTypes.INTEGER,
      field: '_usuario_modificacion',
      xlabel: 'Usuario de modificación',
    },
  }, {
    createdAt: '_fecha_creacion',
    updatedAt: '_fecha_modificacion',
    classMethods: {
      associate: (models) => {
        log_servicio_sigep.belongsTo(models.pcd, {
          as: 'servicio_segip_pcd',
          foreignKey: {
            name: 'fid_pcd',
            targetKey: 'id_pcd',
            allowNull: false,
          },
        });
      },
    },
    tableName: 'log_servicio_sigep',
  });
  return log_servicio_sigep;
};
