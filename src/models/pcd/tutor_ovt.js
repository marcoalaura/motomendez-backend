
module.exports = (sequelize, DataType) => {
  const tutor_ovt = sequelize.define('tutor_ovt', {
    id_tutor_ovt: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      xlabel: 'Id de tutor OVT',
    },
    documento_identidad: {
      type: DataType.STRING(15),
      field: 'documento_identidad',
      allowNull: false,
      unique: 'uniqueSelectedItem',
    },
    complemento_documento: {
      type: DataType.STRING(20),
      field: 'complemento_documento',
      xlabel: 'Complemento del documento',
      unique: 'uniqueSelectedItem',
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
    },
    primer_apellido: {
      type: DataType.STRING(100),
      field: 'primer_apellido',
      xlabel: 'Primer apellido',
      allowNull: true,
    },
    segundo_apellido: {
      type: DataType.STRING(100),
      field: 'segundo_apellido',
      xlabel: 'Segundo apellido',
      allowNull: true,
    },
    tipo_documento_identidad: {
      type: DataType.INTEGER,
      field: 'tipo_documento_identidad',
      xlabel: 'Tipo de documento de identidad',
      unique: 'uniqueSelectedItem',
      allowNull: false,
    },
    observacion: {
      type: DataType.STRING(100),
      field: 'observacion',
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
    },
    tableName: 'tutor_ovt',
  });

  return tutor_ovt;
};
