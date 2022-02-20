module.exports = (sequelize, DataType) => {
  const tmpPcd = sequelize.define('tmp_pcd', {
    id: { type: DataType.INTEGER, primaryKey: true, autoIncrement: true },
    documento_identidad: { type: DataType.STRING(25), allowNull: false },
    complemento_documento: { type: DataType.STRING(20) },
    expedido: { type: DataType.INTEGER },
    tipo_documento: { type: DataType.INTEGER },
    fecha_nacimiento: { type: DataType.DATEONLY, allowNull: false },
    nombres: { type: DataType.STRING(100) },
    primer_apellido: { type: DataType.STRING(100) },
    segundo_apellido: { type: DataType.STRING(100) },
    casada_apellido: { type: DataType.STRING(100) },
    formato_inf: { type: DataType.STRING(4) },
    sexo: { type: DataType.STRING(1) },
    estado_civil: { type: DataType.STRING(1) },
    direccion: { type: DataType.STRING(250) },
    telefono: { type: DataType.STRING(25) },
    codigo_municipio: { type: DataType.STRING(6) },
    numero_registro: { type: DataType.STRING(20) },
    fecha_emision: { type: DataType.DATEONLY },
    fecha_vigencia: { type: DataType.DATEONLY },
    tipo_discapacidad: { type: DataType.STRING(50) },
    grado_discapacidad: { type: DataType.STRING(50) },
    porcentaje_discapacidad: { type: DataType.INTEGER },
    tipo: { type: DataType.STRING(10) },
    observacion_contrastacion: { type: DataType.STRING(500) },
    estado_contrastacion: { type: DataType.STRING(30), defaultValue: 'PENDIENTE' },
    fecha_registro: { type: DataType.DATEONLY },
    mes_carga: { type: DataType.INTEGER },
    gestion_carga: { type: DataType.INTEGER },
    estado: { type: DataType.STRING(30), defaultValue: 'ACTIVO' },
    observacion_estado: { type: DataType.STRING(500) },
    estado_corte_anual: { type: DataType.STRING(15), defaultValue: 'HABILITADO' },
    _usuario_creacion: { type: DataType.INTEGER, allowNull: false },
    _usuario_modificacion: { type: DataType.INTEGER },
    _fecha_creacion: { type: DataType.DATE },
    _fecha_modificacion: { type: DataType.DATE },
  }, {
    createdAt: '_fecha_creacion',
    updatedAt: '_fecha_modificacion',
    classMethods: {
      // Creando asociaciones para la entidad
      associate: () => {
      },
    },
    tableName: 'tmp_pcd',
  });
  tmpPcd.removeAttribute('id');

  return tmpPcd;
};
