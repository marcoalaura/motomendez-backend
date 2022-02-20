/**
 * Módulo que mapea las PERSONAS existentes, cada persona sólo debería estar
 * registrada una vez en esta tabla.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const persona = sequelize.define('persona', {
    id_persona: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id de la persona',
    },
    documento_identidad: {
      type: DataType.STRING(25),
      field: 'documento_identidad',
      xlabel: 'Documento de identidad',
      allowNull: false,
      unique: 'uniqueSelectedItem',
      validate: {
        len: {
          args: [3, 25],
          msg: 'El campo \'Documento de identidad\' permite un mínimo de 3 caracter y un máximo de 25 caracteres',
        },
        is: {
          args: /^[0-9|A-Z|-|-|.]+$/i,
          msg: 'El campo \'Documento de identidad\' permite sólo letras, números, guiones y puntos.',
        },
      },
    },
    complemento_documento: {
      type: DataType.STRING(20),
      field: 'complemento_documento',
      xlabel: 'Complemento del documento',
      unique: 'uniqueSelectedItem',
      validate: {
        len: {
          args: [0, 20],
          msg: 'El campo \'Complemento del documento\' permite un mínimo de 0 caracteres y un máximo de 20 caracteres',
        },
      },
    },
    expedido: {
      type: DataType.INTEGER,
      field: 'expedido',
    },
    estado_civil: {
      type: DataType.STRING(1),
      field: 'estado_civil',
    },
    localidad: {
      type: DataType.STRING(30),
      field: 'localidad',
    },
    fecha_nacimiento: {
      type: DataType.DATEONLY,
      field: 'fecha_nacimiento',
      xlabel: 'Fecha de nacimiento',
      unique: 'uniqueSelectedItem',
      allowNull: false,
    },
    nombres: {
      type: DataType.STRING(100),
      field: 'nombres',
      xlabel: 'Nombres',
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
    primer_apellido: {
      type: DataType.STRING(100),
      field: 'primer_apellido',
      xlabel: 'Primer apellido',
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
      type: DataType.STRING(100),
      field: 'segundo_apellido',
      xlabel: 'Segundo apellido',
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'El campo \'Segundo apellido\' permite un máximo de 100 caracteres',
        },
        is: {
          args: /^([A-Z|Á|É|Í|Ó|Ú|À|È|Ì|Ò|Ù|Ä|Ë|Ï|Ö|Ü|Â|Ê|Î|Ô|Û|Ñ|'|´| ]|)+$/i,
          msg: 'El campo \'Segundo apellido\' permite solo letras',
        },
      },
    },
    casada_apellido: {
      type: DataType.STRING(100),
      field: 'casada_apellido',
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
    formato_inf: {
      type: DataType.STRING(4),
      field: 'formato_inf',
      defaultValue: 'NUAC',
      validate: {
        isIn: {
          args: [
            ['NUAC', 'U1AC', 'UTAC'],
          ],
          msg: 'El campo formato_inf sólo permite valores NUAC, U1AC y UTAC.',
        },
      },
    },
    nombre_completo_siprunpcd: {
      type: DataType.STRING(100),
      field: 'nombre_completo_siprunpcd',
      allowNull: true,
    },
    sexo: {
      type: DataType.CHAR(1),
      field: 'sexo',
      xlabel: 'Sexo',
      allowNull: true,
      validate: {
        isIn: {
          args: [
            ['M', 'F'],
          ],
          msg: 'El campo sexo sólo permite valores F(Femenino) y M(Masculino).',
        },
      },
    },
    direccion: {
      type: DataType.STRING(250),
      field: 'direccion',
      xlabel: 'Dirección',
      allowNull: true,
    },
    telefono: {
      type: DataType.STRING(25),
      xlabel: 'Teléfono',
      allowNull: true,
      validate: {
        len: {
          args: [0, 25],
          msg: "El campo 'Teléfono' permite un mínimo de 5 caracteres y un máximo de 25 caracteres",
        },
      },
    },
    correo_electronico: {
      type: DataType.STRING(100),
      xlabel: 'Correo electrónico',
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
    nombre_completo: {
      type: DataType.STRING(400),
      xlabel: 'Nombre Completo',
      allowNull: false,
      defaultValue: '',
    },
    estado: {
      type: DataType.STRING(30),
      field: 'estado',
      xlabel: 'Estado',
      allowNull: false,
      defaultValue: 'ACTIVO',
      validate: {
        isIn: {
          args: [
            ['ACTIVO', 'INACTIVO', 'ELIMINADO'],
          ],
          msg: 'El campo estado sólo permite valores: ACTIVO, INACTIVO o ELIMINADO.',
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
    classMethods: {
      // Creando asociaciones para la entidad
      associate: (models) => {
        persona.belongsTo(models.parametro, {
          as: 'tipo_documento_identidad',
          foreignKey: {
            name: 'fid_tipo_documento',
            unique: 'uniqueSelectedItem',
            targetKey: 'id_parametro',
            allowNull: false,
          },
        });
      },
    },
    tableName: 'persona',
  });

  persona.beforeCreate((instance, option) => {
    instance.nombre_completo = nombreCompleto(instance);
  });

  persona.beforeUpdate((instance, option) => {
    instance.nombre_completo = nombreCompleto(instance);
  });

  function nombreCompleto(instance) {
    if (instance.nombres && (instance.primer_apellido || instance.segundo_apellido || instance.casada_apellido)) {
      instance.nombre_completo = `${instance.primer_apellido ? instance.primer_apellido : ''}`;
      instance.nombre_completo = `${instance.nombre_completo} ${instance.segundo_apellido ? instance.segundo_apellido : ''}`;
      instance.nombre_completo = `${instance.nombre_completo} ${instance.casada_apellido ? instance.casada_apellido : ''}`;
      instance.nombre_completo = `${instance.nombre_completo} ${instance.nombres} `;
      instance.nombre_completo = instance.nombre_completo.replace(/\s\s+/g, ' ');
      instance.nombre_completo = instance.nombre_completo.trim();
    }
    return instance.nombre_completo;
  }

  return persona;
};
