'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    queryInterface.dropTable('control_corte');
    return queryInterface.createTable({ tableName: 'control_corte' }, {
      id_control_corte: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        xlabel: 'ID del corte',
      },
      gestion: {
        type: DataTypes.STRING(4),
        field: 'gestion',
      },
      mes: {
        type: DataTypes.INTEGER,
        field: 'mes',
      },
      tipo_corte: {
        type: DataTypes.STRING(20),
        field: 'tipo_corte',
        xlabel: 'Tipo de corte',
        allowNull: false,
        validate: {
          isIn: {
            args: [
              ['ANUAL', 'MENSUAL'],
            ],
            msg: 'El campo tipo de corte sólo permite valores: ANUAL, MENSUAL',
          },
        },
      },
      estado: {
        type: DataTypes.STRING(20),
        field: 'estado',
        xlabel: 'Estado',
        allowNull: false,
        defaultValue: 'PENDIENTE',
        validate: {
          isIn: {
            args: [
              ['PENDIENTE', 'GENERADO'],
            ],
            msg: 'El campo estado sólo permite valores: PENDIENTE, GENERADO',
          },
        },
      },
      pasos: {
        type: DataTypes.TEXT,
        field: 'pasos',
        xlabel: 'Pasos',
        allowNull: false,
        defaultValue: '',
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
      createdAt: {
        type: DataTypes.DATE,
        field: '_fecha_creacion',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: '_fecha_modificacion',
      },
    }, {
      uniqueKeys: {
        actions_unique: {
          fields: ['mes', 'gestion'],
        },
      },
    });
  },
};
