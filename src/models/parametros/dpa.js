module.exports = (sequelize, DataTypes) => {
  const dpa = sequelize.define('dpa', {
    cod_municipio: {
      primaryKey: true,
      type: DataTypes.STRING(6),
      field: 'cod_municipio',
      xlabel: 'CodMunicipio',
      allowNull: false,
    },
    municipio: {
      type: DataTypes.STRING(50),
      field: 'municipio',
      xlabel: 'Municipio',
      allowNull: false,
    },
    cod_provincia: {
      type: DataTypes.STRING(4),
      field: 'cod_provincia',
      xlabel: 'CodProvincia',
      allowNull: false,
    },
    provincia: {
      type: DataTypes.STRING(100),
      field: 'provincia',
      xlabel: 'Provincia',
      allowNull: false,
    },
    cod_departamento: {
      type: DataTypes.STRING(2),
      field: 'cod_departamento',
      xlabel: 'CodDepartamento',
      allowNull: false,
    },
    departamento: {
      type: DataTypes.STRING(15),
      field: 'departamento',
      xlabel: 'Departamento',
      allowNull: false,
    },
    id_ubigeo: {
      type: DataTypes.INTEGER,
      field: 'id_ubigeo',
      xlabel: 'id_ubigeo',
      allowNull: false,
    },
    entidad: {
      type: DataTypes.STRING(10),
      field: 'entidad',
      xlabel: 'entidad',
      allowNull: false,
    },
    id_entidad: {
      type: DataTypes.STRING(10),
      field: 'id_entidad',
      xlabel: 'id_entidad',
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(30),
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
        dpa.hasMany(models.pcd, {
          as: 'pda_pcd',
          foreignKey: {
            name: 'cod_municipio',
            allowNull: false,
          },
        });
        /* dpa.belongsTo(models.dpa, { as: 'dpa_superior', foreignKey: { name: 'fid_dpa_superior', targetKey: 'id_dpa', allowNull: true, xchoice: 'nombre' } }); */
      },
    },
    tableName: 'dpa',
  });
  return dpa;
};
