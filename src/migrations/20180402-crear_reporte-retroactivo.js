'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable({ tableName: 'reporte_retroactivo' }, {
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
        unique: 'unique',
        allowNull: false,
      },
      fid_gestion: {
        type: DataTypes.INTEGER,
        references: {
          model: 'gestion',
          key: 'id_gestion',
        },
        allowNull: false,
        unique: 'unique',
      },
      cod_municipio: {
        type: DataTypes.STRING(6),
        references: {
          model: 'dpa',
          key: 'cod_municipio',
        },
        allowNull: false,
        unique: 'unique',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: '_fecha_creacion',
      },
      updatedAtAt: {
        type: DataTypes.DATE,
        field: '_fecha_modificacion',
      },
    }, {
      uniqueKeys: {
          actions_unique: {
              fields: ['mes', 'fid_gestion', 'cod_municipio']
          }
      }
  });
  },
};
