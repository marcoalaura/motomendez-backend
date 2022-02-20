import util from './../../../lib/util';
import moment from 'moment';

module.exports = (app) => {
  const _app = app;
  const PcdModel = app.src.db.models.pcd;
  const CertificadoModel = app.src.db.models.certificado;
  const DpaModel = app.src.db.models.dpa;
  const PersonaModel = app.src.db.models.persona;
  const TutorModel = app.src.db.models.tutor;
  const BeneficioModel = app.src.db.models.beneficio;
  const PcdBeneficioModel = app.src.db.models.pcd_beneficio;
  const PcdBeneficioModelMes = app.src.db.models.pcd_beneficio_mes;
  const ParametroModel = app.src.db.models.parametro;
  const LogServicioModel = app.src.db.models.log_servicio_siprunpcd;
  const TmpSiprunPcdModel = app.src.db.models.tmp_siprunpcd;
  const TutorOVTModel = app.src.db.models.tutor_ovt;
  const LogServicioSigepModel = app.src.db.models.log_servicio_sigep;

  /**
   * listarPcd - Método para listar las personas con discapacidad
   * @return {Promise}
   */
  const listarPcd = (datosPaginado) => {
    const paginado = util.paginar(datosPaginado);
    const whereDpa = {};
    const wherePersona = {};
    if (datosPaginado.codigo_municipio) {
      whereDpa.cod_municipio = datosPaginado.codigo_municipio;
    }
    if (datosPaginado.documento_identidad) {
      wherePersona.documento_identidad = datosPaginado.documento_identidad;
    }
    const query = {
      where: {
        estado: 'ACTIVO',
      },
      attributes: ['id_pcd', 'estado', 'observacion'],
      include: [
        {
          model: PersonaModel,
          as: 'persona',
          attributes: [['nombre_completo', 'nombres'], 'fecha_nacimiento', 'documento_identidad'],
          where: wherePersona,
          required: true,
        },
        {
          model: CertificadoModel,
          as: 'pcd_certificado',
          attributes: [
            'grado_discapacidad',
            'tipo_discapacidad',
          ],
         // required: true,
        },
        {
          model: DpaModel,
          as: 'pcd_dpa',
          attributes: [
            'departamento',
            'provincia',
            'municipio',
          ],
          where: whereDpa,
        //  required: true,
        },
        {
          model: TutorModel,
          as: 'pcd_tutor',
          attributes: ['documento_descripcion', 'estado'],
          include: [
            {
              model: PersonaModel,
              as: 'persona',
              attributes: ['documento_identidad', 'nombre_completo'],
            },
          ],
          where: {
            estado: ['ACTIVO'],
          },
          required: false,
        },
      ],
      order: '"persona.nombres" ASC',
    };
    Object.assign(query, paginado);
    return PcdModel.findAndCountAll(query);
  };

  /**
   * crearPcd - Método para crear un pcd
   * @param {Object} pcd
   * @return {Promise}
   */
  const crearPcd = (pcd) => {
    return PcdModel.create(pcd);
  };

  /**
   * crearCertificado - Métod para crear certificado
   * @param {Object} datosCertificado
   * @return {Promise}
   */
  const crearCertificado = (datosCertificado) => {
    return CertificadoModel.create(datosCertificado);
  };

  /**
   * buscarPcd - Método para obtener PCD
   * @return {Promise}
   */
  const buscarPcd = (idPersona) => {
    const query = {
      where: {
        // estado: 'CREADO',
        fid_persona: idPersona,
      },
      attributes: ['id_pcd', 'estado', 'observacion', 'fid_persona', 'cod_municipio'],
    };
    return PcdModel.find(query);
  };

  /**
  * buscarPcdPorId - Método para obtener PCD por id
  * @return {Promise}
  */
  const buscarPcdPorId = (idPcd) => {
    const query = {
      where: {
        // estado: 'CREADO',
        id_pcd: idPcd,
      },
      attributes: ['id_pcd', 'estado', 'observacion', 'fid_persona'],
    };
    return PcdModel.find(query);
  };

  const obtenerIdPcdPorCi = (ci) => {
    const query = {
      attributes: ['id_pcd'],
      include: [
        {
          model: PersonaModel,
          as: 'persona',
          attributes: ['documento_identidad'],
          where: {
            documento_identidad: ci,
          },
        },
      ],
    };
    return PcdModel.findOne(query);
  };

  const mostrarDetallePcd = (ci) => {
    const query = {
      attributes: ['id_pcd', 'estado'],
      include: [
        {
          model: PersonaModel,
          as: 'persona',
          attributes: ['nombre_completo', 'fecha_nacimiento', 'documento_identidad', 'direccion', 'telefono', 'correo_electronico', 'primer_apellido', 'segundo_apellido', 'nombres', 'casada_apellido', 'formato_inf', 'estado_civil', 'expedido', 'complemento_documento'],
          where: {
            documento_identidad: ci,
          },
        },
        {
          model: CertificadoModel,
          as: 'pcd_certificado',
          attributes: ['fecha_vigencia', 'fecha_emision', 'tipo_discapacidad', 'grado_discapacidad', 'porcentaje_discapacidad', 'tipo_certificado'],
        },
        {
          model: DpaModel,
          as: 'pcd_dpa',
          attributes: ['departamento', 'provincia', 'municipio'],
          required: true,
        },
        {
          model: TutorModel,
          as: 'pcd_tutor',
          attributes: ['documento_descripcion', 'estado'],
          include: [{
            model: PersonaModel,
            as: 'persona',
            attributes: ['nombre_completo', 'documento_identidad', 'estado', 'direccion', 'telefono'],
          },
          {
            model: ParametroModel,
            as: 'parentesco',
            attributes: ['nombre'],
          }],
        },
        // {
        //   model: PcdBeneficioModelMes,
        //   as: 'pcd_beneficio_mes',
        //   attributes: ['descripcion', 'observacion', 'mes', 'nit', 'matricula', 'fid_gestion'],
        //   // where: {
        //   //   fid_gestion: moment().format('YYYY'),
        //   // },
        //   include: [{
        //     model: BeneficioModel,
        //     as: 'beneficio',
        //     attributes: ['nombre_beneficio', 'institucion'],
        //   },
        //   {
        //     model: TutorOVTModel,
        //     as: 'tutor_ovt',
        //     attributes: ['documento_identidad', 'primer_apellido', 'segundo_apellido', 'nombres'],
        //   }],
        // },
      ],
    };
    return PcdModel.findAll(query);
  };

  /**
   * obtenerBeneficios - Método para obtener beneficios con restriccion por idPcd
   * @param {number} idPcd
   * @return {Promise}
   */
  const obtenerBeneficios = (idPcd) => {
    const query = {
      attributes: ['id_pcd_beneficio_mes', 'estado'],
      where: {
        fid_pcd: idPcd,
      },
      include: [{
        model: BeneficioModel,
        as: 'beneficio',
        attributes: ['id_beneficio', 'restriccion'],
        where: {
          restriccion: true,
          estado: 'ACTIVO',
        },
      }],
    };
    return PcdBeneficioModelMes.find(query);
  };

  /**
   * obtenerPcds - Método que obtiene el listado de pcds que cumplen los requisitos para el pago del bono
   * @param {number} idGestion
   * @param {number} usuarioAuditoria
   * @return {Promise}
   */
  const obtenerPcds = (idGestion, usuarioAuditoria) => {
    // inner join dpa as d on (p.fid_dpa = d.id_dpa)
    const query = `
      select p.id_pcd as fid_pcd, ${idGestion} as fid_gestion, ${usuarioAuditoria} as _usuario_creacion, 'GENERADO' as estado, ps.nombre_completo, c.tipo_discapacidad, c.grado_discapacidad, c.porcentaje_discapacidad,c.fecha_vigencia, d.cod_municipio, d.departamento, d.provincia, d.municipio
      from pcd as p
      inner join certificado as c on (p.id_pcd = c.fid_pcd)
      inner join persona as ps on (p.fid_persona = ps.id_persona)
      inner join dpa as d on (p.cod_municipio = d.cod_municipio)
      and c.tipo_certificado = 'SIPRUNPCD' and c.fecha_vigencia > now()
      -- tipo de discapacidad
      and grado_discapacidad in ('GRAVE', 'MUY GRAVE')
      -- si tiene registro en el IBC
      and p.id_pcd not in ( select fid_pcd
                            from certificado
                            where tipo_certificado = 'IBC')
      -- si ya cumplio 60 años;
      and EXTRACT(YEAR FROM age(date_trunc('month',current_date) +'1month' ::interval -'1sec' ::interval, ps.fecha_nacimiento)) < 60
      -- si goza de algun beneficio
      and p.id_pcd not in ( select pb.fid_pcd
                            from pcd_beneficio  pb
                            inner join beneficio as b on (pb.fid_beneficio = b.id_beneficio)
                            where b.restriccion = true);
      `;
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  /**
   * crearLogServicio - Método para crear Log Servicio
   * @param {object} datosLog
   */
  const crearLogServicio = (datosLog) => {
    return LogServicioModel.create(datosLog);
  };

  /**
   * obtenerObservados - Método para obtener observados segun una fecha
   * @param {date} fecha
   */
  const obtenerObservados = (fecha) => {
    const query = {
      attributes: ['observacion', 'documento_identidad', 'estado'],
      where: {
        fecha_peticion: fecha,
        estado: 'OBSERVADO',
      },
      raw: true,
    };
    return LogServicioModel.findAndCountAll(query);
  };

  /**
   * actualizarLogServicio - Método para actualizar de estado a log Servicio
   * @param {number} idRegistro
   * @param {object} datos
   */
  const actualizarLogServicio = (ci, datos) => {
    const query = {
      where: {
        documento_identidad: ci,
      },
    };
    return LogServicioModel.update(datos, query);
  };

  const actualizarMunicipioPcd = (idPcd, datos) => {
    const query = {
      where: {
        id_pcd: idPcd
      }
    };
    return PcdModel.update(datos, query);
  };

  /**
   * buscarLogServicio - Método para buscar un servicio
   * @param {number} ci
   * @param {object} datos
   */
  const buscarLogServicio = (ci) => {
    const query = {
      where: {
        documento_identidad: ci,
      },
    };
    return LogServicioModel.findOne(query);
  };

  const obtenerPcd = (ci, fechaNacimiento) => {
    const query = {
      attributes: ['id_pcd'],
      where: { estado: 'ACTIVO' },
      include: [
        {
          model: PersonaModel,
          as: 'persona',
          attributes: ['documento_identidad', 'complemento_documento', 'nombre_completo', 'nombres', 'primer_apellido', 'segundo_apellido', 'casada_apellido', 'formato_inf', 'estado_civil'],
          where: {
            documento_identidad: ci,
            fecha_nacimiento: fechaNacimiento,
          },
        },
        {
          model: DpaModel,
          as: 'pcd_dpa',
          attributes: ['departamento', 'provincia', 'municipio'],
          required: true,
        },
      ],
    };
    // return PcdModel.findOne(query);
    return PcdModel.findAll(query);
  };

  /**
   * obtenerPcdComplemento - Método para buscar un pcd por ci, complemento y fecha de nacimiento
   * @param {number} ci
   * @param {string} complemento
   * @param {date} fechaNacimiento
   */
  const obtenerPcdComplemento = (ci, complemento, fechaNacimiento) => {
    const query = {
      attributes: ['id_pcd'],
      where: { estado: 'ACTIVO' },
      include: [
        {
          model: PersonaModel,
          as: 'persona',
          attributes: ['documento_identidad', 'complemento_documento', 'nombre_completo'],
          where: {
            documento_identidad: ci,
            complemento_documento: complemento,
            fecha_nacimiento: fechaNacimiento,
          },
        },
        {
          model: DpaModel,
          as: 'pcd_dpa',
          attributes: ['departamento', 'provincia', 'municipio'],
          required: true,
        },
      ],
    };
    return PcdModel.findOne(query);
  };

  /**
   * buscarTmpSirpunPcd - Método para buscar si un ci existe en tmp_siprunpcd
   * @param {string} ci
   * @param {string} fechaNacimiento
   */
  const buscarTmpSiprunPcd = (ci) => {
    const query = {
      attributes: ['nro_documento'],
      where: {
        nro_documento: ci,
      },
    };
    return TmpSiprunPcdModel.findOne(query);
  };

  const obtenerPcdCompleto = (ci, fechaNacimiento) => {
    const query = {
      attributes: ['id_pcd'],
      where: { estado: 'ACTIVO' },
      include: [
        {
          model: PersonaModel,
          as: 'persona',
          attributes: ['id_persona', 'documento_identidad', 'fecha_nacimiento', 'complemento_documento', 'nombre_completo'],
          where: {
            documento_identidad: ci,
            fecha_nacimiento: fechaNacimiento,
          },
        },
        {
          model: DpaModel,
          as: 'pcd_dpa',
          attributes: ['cod_municipio', 'departamento', 'provincia', 'municipio'],
          required: true,
        },
      ],
    };
    return PcdModel.findOne(query);
  };

  const consultarPorcentajeMes = async (fid_pcd, gestion, mes) => {
    let query = '';
    
    query = `select fn_porcentaje('${fid_pcd}', '${gestion}', '${mes}');`
    
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  const obtenerLogServicioSigep = (where) => {
    const query = { where };
    return LogServicioSigepModel.findOne(query);
  };

  const buscarPersonaPorNombre = async (fechaNacimiento, nombres, primerApellido, segundoApellido) => {
    let query = '';
    if (!primerApellido) {
      query = `select l.documento_identidad, l.primer_apellido, l.segundo_apellido, l.nombres, l.apellido_casada, l.fecha_nacimiento,
      dpa.cod_municipio, dpa.municipio, l.observacion, dpa.departamento, dpa.provincia, dpa.municipio
      from log_servicio_sigep as l
      inner join dpa on dpa.id_entidad = l.id_entidad_pago
      where (fecha_nacimiento = '${fechaNacimiento}' AND nombres = '${nombres}' AND (primer_apellido is null) and (segundo_apellido = '${segundoApellido}'))
      ORDER BY 1 LIMIT 1;`;
    } else if (!segundoApellido) {
      query = `select l.documento_identidad, l.primer_apellido, l.segundo_apellido, l.nombres, l.apellido_casada, l.fecha_nacimiento,
      dpa.cod_municipio, dpa.municipio, l.observacion, dpa.departamento, dpa.provincia, dpa.municipio
      from log_servicio_sigep as l
      inner join dpa on dpa.id_entidad = l.id_entidad_pago
      where (fecha_nacimiento = '${fechaNacimiento}' AND nombres = '${nombres}' AND (primer_apellido = '${primerApellido}') and (segundo_apellido is NULL))
      ORDER BY 1 LIMIT 1;`;
    } else {
      query = `select l.documento_identidad, l.primer_apellido, l.segundo_apellido, l.nombres, l.apellido_casada, l.fecha_nacimiento,
      dpa.cod_municipio, dpa.municipio, l.observacion, dpa.departamento, dpa.provincia, dpa.municipio
      from log_servicio_sigep as l
      inner join dpa on dpa.id_entidad = l.id_entidad_pago
      where (fecha_nacimiento = '${fechaNacimiento}' AND nombres = '${nombres}' AND (primer_apellido = '${primerApellido}') and (segundo_apellido = '${segundoApellido}'))
      ORDER BY 1 LIMIT 1;`;
    }
    return app.src.db.sequelize.query(query, { type: app.src.db.sequelize.QueryTypes.SELECT });
  };

  /**
   * listarPcdBeneficio - Método para listar beneficios de una personas con discapacidad
   * @return {Promise}
   */
  const listarPcdBeneficio = (datosPaginado) => {
    const paginado = util.paginar(datosPaginado);
    const query = {
      where: {
        fid_pcd: datosPaginado.id_pcd,
      },
      attributes: ['descripcion', 'observacion', 'mes', 'nit', 'matricula', 'fid_gestion'],
      order: 'id_pcd_beneficio_mes DESC',
      include: [{
        model: BeneficioModel,
        as: 'beneficio',
        attributes: ['nombre_beneficio', 'institucion'],
      },
      {
        model: TutorOVTModel,
        as: 'tutor_ovt',
        attributes: ['documento_identidad', 'primer_apellido', 'segundo_apellido', 'nombres'],
      }],
    };
    Object.assign(query, paginado);
    return PcdBeneficioModelMes.findAndCountAll(query);
  };

  _app.dao.pcd = {
    listarPcd,
    crearPcd,
    crearCertificado,
    buscarPcd,
    buscarPcdPorId,
    obtenerIdPcdPorCi,
    mostrarDetallePcd,
    obtenerBeneficios,
    obtenerPcds,
    crearLogServicio,
    obtenerObservados,
    actualizarLogServicio,
    buscarLogServicio,
    obtenerPcd,
    buscarTmpSiprunPcd,
    obtenerPcdComplemento,
    obtenerPcdCompleto,
    consultarPorcentajeMes,
    actualizarMunicipioPcd,
    obtenerLogServicioSigep,
    buscarPersonaPorNombre,
    listarPcdBeneficio,
  };
};
