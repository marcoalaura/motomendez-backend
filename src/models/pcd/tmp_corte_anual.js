module.exports = (sequelize, DataType) => {
  const tmpCorteAnual = sequelize.define('tmp_corte_anual', {
    id: { type: DataType.INTEGER, primaryKey: true, autoIncrement: true },
    nro: { type: DataType.INTEGER },
    exp_departamento: { type: DataType.STRING(30) },
    cod_beneficiario: { type: DataType.INTEGER },
    nro_documento: { type: DataType.STRING(30) },
    complemento: { type: DataType.STRING(30) },
    exp_pais: { type: DataType.STRING(30) },
    primer_apellido: { type: DataType.STRING(30) },
    segundo_apellido: { type: DataType.STRING(30) },
    apellido_casada: { type: DataType.STRING(30) },
    nombres: { type: DataType.STRING(30) },
    estado_civil: { type: DataType.STRING(30) },
    formato_inf: { type: DataType.STRING(30) },
    fecha_nacimiento: { type: DataType.STRING(30) },
    tipo_discapacidad: { type: DataType.STRING(30) },
    grados_disc: { type: DataType.STRING(30) },
    porcentaje: { type: DataType.STRING(30) },
    fecha_vigencia: { type: DataType.STRING(30) },
    pais: { type: DataType.STRING(30) },
    codigo_municipal: { type: DataType.STRING(30) },
    nombre_municipio: { type: DataType.STRING(100) },
    direccion: { type: DataType.STRING(255) },
    telefono: { type: DataType.STRING(30) },
    celular: { type: DataType.STRING(30) },
    observacion_contrastacion: { type: DataType.STRING(30) },
    estado_contrastacion: { type: DataType.STRING(30) },
    gestion: { type: DataType.INTEGER },
    tipo: { type: DataType.STRING(10) },
    estado: { type: DataType.STRING(20) },
    observacion: { type: DataType.STRING(100) },
    _usuario_creacion: { type: DataType.INTEGER, allowNull: false },
    _usuario_modificacion: { type: DataType.INTEGER },
  }, {
    createdAt: '_fecha_creacion',
    updatedAt: '_fecha_modificacion',
    classMethods: {
      // Creando asociaciones para la entidad
      associate: () => {
      },
    },
    tableName: 'tmp_corte_anual',
  });

  return tmpCorteAnual;
};
