/**
 * Módulo que mapea el registro nuevo domicilio de las personas con discapacidad.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const domicilio = sequelize.define('domicilio', {
    id_domicilio: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gestion: {
      type: DataType.INTEGER,
      field: 'gestion',
      allowNull: false,
      unique: 'unique'
    },
    documento_identidad: {
      type: DataType.STRING(25),
      field: 'documento_identidad',
      allowNull: false,
      unique: 'unique'
    },
    fecha_nacimiento: {
      type: DataType.DATEONLY,
      field: 'fecha_nacimiento',
      allowNull: false,
      unique: 'unique'
    },
    direccion: {
      type: DataType.STRING(300),
      field: 'direccion',
      allowNull: false
    },
    ci_solicitante: {
      type: DataType.STRING(25),
      field: 'ci_solicitante'
    },
    solicitante: {
      type: DataType.STRING(500),
      field: 'solicitante'
    },
    documento_siprun: {
      type: DataType.STRING(100),
      field: 'documento_siprun',
      allowNull: true
    },
    documento_factura: {
      type: DataType.STRING(100),
      field: 'documento_factura',
      allowNull: true
    },
    estado: {
      type: DataType.STRING(30),
      field: 'estado',
      allowNull: false,
      defaultValue: 'ACTIVO',
      validate: {
        isIn: {
          args: [
            ['ACTIVO', 'INACTIVO']
          ],
          msg: 'El campo estado sólo permite valores: ACTIVO, INACTIVO',
        }
      }
    },
    _usuario_creacion: {
      type: DataType.INTEGER,
      field: '_usuario_creacion',
      allowNull: false
    },
    _usuario_modificacion: {
      type: DataType.INTEGER,
      field: '_usuario_modificacion'
    }
  }, {
    createdAt: '_fecha_creacion',
    updatedAt: '_fecha_modificacion',
    classMethods: {
      // Creando asociaciones para la entidad
      associate: (models) => {
        domicilio.belongsTo(models.dpa, {
          as: 'pcd_dpa_nuevo',
          foreignKey: {
            name: 'cod_municipio_nuevo',
            targetKey: 'cod_municipio',
            allowNull: false
          }
        });
        domicilio.belongsTo(models.dpa, {
          as: 'pcd_dpa_vigente',
          foreignKey: {
            name: 'cod_municipio_vigente',
            targetKey: 'cod_municipio',
            allowNull: false
          }
        });
        domicilio.belongsTo(models.pcd, {
          as: 'pcd',
          foreignKey: {
            name: 'fid_pcd',
            targetKey: 'id_pcd',
            allowNull: false
          }
        });
        domicilio.belongsTo(models.persona, {
          as: 'persona',
          foreignKey: {
            name: 'fid_persona',
            targetKey: 'id_persona',
            allowNull: false
          }
        });
      }
    },
    tableName: 'domicilio'
  });

  return domicilio;
};