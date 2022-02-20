/**
 * Módulo que mapea los carnet's de las personas con discapacidad.
 *
 * @module
 *
 */

module.exports = (sequelize, DataType) => {
  const corte_mensual = sequelize.define('corte_mensual', {
    id_corte_mensual: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id de corte_mensual',
    },
    id_bono: {
      type: DataType.INTEGER,
      field: 'id_bono',
    },
    observacion: {
      type: DataType.STRING(500),
      field: 'observacion',
    },
    observacion_pago: {
      type: DataType.STRING(50),
      field: 'observacion_pago',
    },
    fecha_pago: {
      type: DataType.DATE,
      field: 'fecha_pago',
    },
    estado: {
      type: DataType.STRING(30),
      field: 'estado',
      xlabel: 'Estado',
      allowNull: false,
      defaultValue: 'GENERADO',
      validate: {
        isIn: {
          args: [
            ['GENERADO', 'REGISTRADO_SIGEP', 'OBSERVADO_SIGEP', 'PAGADO', 'EN_PROCESO'],
          ],
          msg: 'El campo estado sólo permite valores: GENERADO, REGISTRADO_SIGEP, OBSERVADO_SIGEP, PAGADO, EN_PROCESO',
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
        corte_mensual.belongsTo(models.gestion, {
          as: 'corte_mensual_gestion',
          foreignKey: {
            name: 'fid_gestion',
            targetKey: 'id_gestion',
            allowNull: false,
            // unique: 'uniqueSelectedItem',
          },
        });
        corte_mensual.belongsTo(models.mes, {
          as: 'corte_mensual_mes',
          foreignKey: {
            name: 'fid_mes',
            targetKey: 'id_mes',
            allowNull: false,
          },
        });
        /* corte_mensual.belongsTo(models.corte_anual, {
          as: 'corte_anual',
          foreignKey: {
            name: 'fid_corte_anual',
            targetKey: 'id_corte_anual',
            allowNull: false,
          },
        }); */
        corte_mensual.belongsTo(models.pcd, {
          as: 'pcd',
          foreignKey: {
            name: 'fid_pcd',
            targetKey: 'id_pcd',
            allowNull: false,
           // unique: 'uniqueSelectedItem',
          },
        });
        corte_mensual.belongsTo(models.dpa, {
          as: 'pcd_dpa',
          foreignKey: {
            name: 'cod_municipio',
            targetKey: 'cod_municipio',
            allowNull: false,
          },
        });
      },
    },
    tableName: 'corte_mensual',
  });

  return corte_mensual;
};
