module.exports = (sequelize, DataTypes) => {
    const reporte_retroactivo = sequelize.define('reporte_retroactivo', {
      id_reporte_retroactivo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      hash: {
        type: DataTypes.TEXT,
        field: 'hash',
      },
      ruta_documento: {
        type: DataTypes.STRING(255),
        field: 'ruta_documento',
      },
      observacion: {
        type: DataTypes.STRING(255),
        field: 'observacion',
      },
      estado: {
        type: DataTypes.STRING(30),
        field: 'estado',
        xlabel: 'Estado',
        allowNull: false,
        defaultValue: 'PENDIENTE',
        validate: {
          isIn: {
            args: [
              ['GENERADO', 'PENDIENTE'],
            ],
            msg: 'El campo estado sólo permite valores: GENERADO, PENDIENTE.',
          },
        },
      },
      mes: {
        type: DataTypes.INTEGER,
        field: 'mes',
        allowNull: false,
        unique: 'unique',
      },
    }, {
      createdAt: '_fecha_creacion',
      updatedAt: '_fecha_modificacion',
      classMethods: {
        associate: (models) => {
          reporte_retroactivo.belongsTo(models.gestion, {
            as: 'gestion',
            foreignKey: {
              name: 'fid_gestion',
              targetKey: 'id_gestion',
              allowNull: false,
              unique: 'unique',
            },
          });
          reporte_retroactivo.belongsTo(models.dpa, {
            as: 'dpa',
            foreignKey: {
              name: 'cod_municipio',
              targetKey: 'cod_municipio',
              allowNull: false,
              unique: 'unique',
            },
          });
        },
      },
      tableName: 'reporte_retroactivo',
    });
  return reporte_retroactivo;
};
