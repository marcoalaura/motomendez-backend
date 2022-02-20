/**
 * Módulo que mapea los carnet's de las personas con discapacidad.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const corte_anual = sequelize.define('corte_anual', {
    id_corte_anual: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id de corte_anual',
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
            ['ACTIVO', 'INACTIVO'],
          ],
          msg: 'El campo estado sólo permite valores: ACTIVO, INACTIVO',
        },
      },
    },
    codigo_beneficiario: {
      type: DataType.INTEGER,
      field: 'codigo_beneficiario',
      allowNull: true,
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
        corte_anual.belongsTo(models.gestion, {
          as: 'gestion',
          foreignKey: {
            name: 'fid_gestion',
            targetKey: 'id_gestion',
            allowNull: false,
            unique: 'uniqueSelectedItem',
          },
        });
        corte_anual.belongsTo(models.pcd, {
          as: 'pcd',
          foreignKey: {
            name: 'fid_pcd',
            targetKey: 'id_pcd',
            allowNull: false,
            unique: 'uniqueSelectedItem',
          },
        });
        corte_anual.belongsTo(models.persona, {
          as: 'persona',
          foreignKey: {
            name: 'fid_persona',
            unique: 'uniqueSelectedItem',
            targetKey: 'id_persona',
            allowNull: false,
          },
        });

        corte_anual.belongsTo(models.dpa, {
          as: 'pcd_dpa',
          foreignKey: {
            name: 'cod_municipio',
            targetKey: 'cod_municipio',
            allowNull: false,
          },
        });
      },
    },
    tableName: 'corte_anual',
  });

  return corte_anual;
};
