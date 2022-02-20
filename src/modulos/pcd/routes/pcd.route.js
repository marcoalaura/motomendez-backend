import validate from 'express-validation';
import pcdValidation from './pcd.validation';

module.exports = (app) => {
  app.get('/status', app.controller.pcd.status);
  /**
   * @api {get} /api/v1/centralizador/pcd Lista de PCD
   * @apiName Listar personas con discapacidad
   * @apiGroup PCD
   * @apiVersion  1.0.0
   * @apiDescription Obtiene la lista de personas con Discapacidad
   *
   * @apiParam (Query) {Numerico} limit (Opcional) Cantidad de resultados a obtener
   * @apiParam (Query) {Numerico} page (Opcional) Número de página de resultados
   * @apiParam (Query) {Numerico} codigo_municipio {opcional} Codigo del municipio
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Integer} datos.count cantidad de resultados obtenidos
   * @apiSuccess {Object[]} datos.rows array con los resultados
   * @apiSuccess {Integer} datos.rows.id_pcd Id del tipo de la persona con discapacidad
   * @apiSuccess {String} datos.rows.estado Estado del dato persona con discapacidad
   * @apiSuccess {String} datos.rows.observacion Observacion de la persona con discapacidad
   * @apiSuccess {Object} datos.rows.persona Objeto con los datos de persona
   * @apiSuccess {String} datos.rows.persona.nombres Nombres de la persona con discapacidad
   * @apiSuccess {String} datos.rows.persona.fecha_nacimiento Fecha de Nacimiento de la persona con discapacidad
   * @apiSuccess {String} datos.rows.persona.documento_identidad Numero del documento de identidad de la persona con discapacidad
   * @apiSuccess {Object} datos.rows.pcd_certificado Objeto con los datos del certificado
   * @apiSuccess {Object} datos.rows.pcd_certificado.grado_discapacidad Grado de Discapacidad
   * @apiSuccess {Object} datos.rows.pcd_certificado.tipo_discapacidad Tipo de Discapacidad
   * @apiSuccess {Object} datos.rows.pcd_dpa Objeto con los datos del certificado
   * @apiSuccess {Object} datos.rows.pcd_dpa.departamento Departamento
   * @apiSuccess {Object} datos.rows.pcd_dpa.provincia Provincia
   * @apiSuccess {Object} datos.rows.pcd_dpa.provincia Municipio
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   * {
   *   "finalizado": true,
   *   "mensaje": "Obtencion de dato exitoso.",
   *   "datos": {
   *     "count": 1,
   *     "rows": [
   *       {
   *         "id_pcd": 1,
   *         "estado": "ACTIVO",
   *         "observacion": null,
   *         "persona": {
   *           "nombres": "Juan Perez Perez",
   *           "fecha_nacimiento": "1980-01-01T04:00:00.000Z",
   *           "documento_identidad": "1000006"
   *         },
   *         "pcd_certificado": [
   *           {
   *             "grado_discapacidad": "20",
   *             "tipo_discapacidad": "GRAVE"
   *           }
   *         ],
   *         "pcd_dpa": {
   *           "departamento": "Chuquisaca",
   *           "provincia": "Oropeza",
   *           "municipio": "Yotala"
   *         },
   *         "pcd_tutor": [{
   *           "documento_descripcion": "CÉDULA DE IDENTIDAD",
   *           "estado": "ACTIVO",
   *           "persona": {
   *             "documento_identidad": "1234567",
   *             "nombre_completo": "JUAN MAMANI MAMANI"
   *           }
   *         }]
   *       }
   *     ]
   *   }
   * }
   */
  app.api.get('/centralizador/pcd', app.controller.pcd.listarPcd);

  // Registrar Personas con Discapacidad
  app.api.post('/centralizador/pcd', app.controller.pcd.crearPcdLote);

  /**
   * @api {get} /api/v1/centralizador/detalle-pcd Detalle de PCD
   * @apiName obtener detalle de  Personas con Discapacidad
   * @apiGroup PCD
   * @apiVersion  1.0.0
   * @apiDescription Obtiene el detalle de una persona con Discapacidad
   * @apiParam (Query) {Numerico} documento_identidad (Obligatorio) CI para búsqueda
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Integer} id_pcd Id del pcd
   * @apiSuccess {Object} persona Datos de la persona
   * @apiSuccess {Object[]} pcd_certificado Datos de los certificados de la pcd
   * @apiSuccess {Object[]} pcd_tutor Datos de los tutores de la pcd
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Exito",
   *    "datos": [{
   *      "id_pcd": 1,
   *      "persona": {
   *        "nombre_completo": "MAMANI MAMANI JUAN",
   *        "fecha_nacimiento": "2000-01-01",
   *        "documento_identidad": "1234567",
   *        "direccion": "S/N",
   *        "telefono": null,
   *        "correo_electronico": null,
   *        "primer_apellido": "MAMANI",
   *        "segundo_apellido": "MAMANI",
   *        "nombres": "JUAN",
   *        "casada_apellido": null,
   *        "formato_inf": "NUAC",
   *        "estado_civil": "S",
   *        "expedido": 3,
   *        "complemento_documento": null
   *      },
   *      "pcd_certificado": [{
   *        "fecha_vigencia": "2019-10-13",
   *        "fecha_emision": "2015-10-13",
   *        "tipo_discapacidad": "AUDITIVO",
   *        "grado_discapacidad": "GRAVE",
   *        "porcentaje_discapacidad": 50,
   *        "tipo_certificado": "SIPRUNPCD"
   *      }],
   *      "pcd_dpa": {
   *        "departamento": "La Paz",
   *        "provincia": "Murillo",
   *        "municipio": "La Paz"
   *      },
   *      "pcd_tutor": [{
   *        "documento_descripcion": "Certificado de nacimiento de PCD.",
   *        "estado": "ACTIVO",
   *        "persona": {
   *          "nombre_completo": "MAMANI MAMANI MATEO",
   *          "documento_identidad": "6543219",
   *          "estado": "ACTIVO",
   *          "direccion": null,
   *          "telefono": ""
   *        },
   *        "parentesco": {
   *          "nombre": "PADRE/MADRE"
   *        }
   *      }],
   *      "pcd_beneficio_mes": [{
   *        "descripcion": "",
   *        "observacion": "",
   *        "mes": 11,
   *        "nit": "45454545454",
   *        "matricula": null,
   *        "fid_gestion": 2019,
   *        "beneficio": {
   *          "nombre_beneficio": "INAMOVILIDAD LABORAL",
   *          "institucion": "Ministerio de Trabajo, Empleo y Previsón Social"
   *        },
   *        "tutor_ovt": {
   *          "documento_identidad": "9876543",
   *          "primer_apellido": "MAMANI",
   *          "segundo_apellido": "MAMANI",
   *          "nombres": "MARIA"
   *        }
   *      }]
   *    }]
   *  }
   */
  app.api.get('/centralizador/detalle-pcd', app.controller.pcd.mostrarDetallePcd);

  /* app.api.get('/centralizador/corte', app.controller.pcd.corteAnual);

  app.api.get('/centralizador/registro_segip', app.controller.pcd.corteAnual); */

  /**
   * @api {get} /api/v1/pcd/:documento_identidad Consulta pública
   * @apiName obtener detalle de bonos habilitados de una Persona con Discapacidad
   * @apiGroup PCD
   * @apiVersion  1.0.0
   * @apiDescription Obtiene el detalle de bonos habilitados de una persona con Discapacidad
   * @apiParam (Param) {String} documento_identidad (Obligatorio) CI para búsqueda (0 en caso de búsqueda avanzada)
   * @apiParam (Query) {String} fecha_nacimiento (Obligatorio) Fecha de nacimiento para la búsqueda
   * @apiParam (Query) {String} nombres (Obligatorio) Nombres para búsqueda (caso búsqueda avanzada)
   * @apiParam (Query) {String} primer_apellido (Opcional) Primer apellido para búsqueda (caso búsqueda avanzada)
   * @apiParam (Query) {String} segundo_apellido (Opcional) Segundo apellido para búsqueda (caso búsqueda avanzada)
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Boolean} datos.encontrado Atributo que indica si el registro fue encontrado
   * @apiSuccess {Boolean} datos.observacion Atributo que indica si el registro tiene observación
   * @apiSuccess {String} datos.mensaje_observacion Mensaje de observación
   * @apiSuccess {String} datos.numero_documento Número documento de identidad de la persona
   * @apiSuccess {String} datos.nombre_completo Nombre completo de la persona
   * @apiSuccess {String} datos.fecha_nacimiento Fecha de nacimiento de la persona
   * @apiSuccess {String} datos.departamento Departamento donde se encuentra habilitado para cobro
   * @apiSuccess {String} datos.provincia Provicia donde se encuentra habilitado para cobro
   * @apiSuccess {String} datos.municipio Municipio donde se encuentra habilitado para cobro
   * @apiSuccess {String} datos.fecha Fecha de consulta
   * @apiSuccess {Object[]} datos.datos_mes Datos de habilitación
   * @apiSuccess {String} datos.datos_mes.observacion Observación del registro mensual
   * @apiSuccess {String} datos.datos_mes.estado Observación
   * @apiSuccess {String} datos.datos_mes.fid_gestion Gestión
   * @apiSuccess {String} datos.datos_mes.fid_mes Identificador del mes
   * @apiSuccess {String} datos.datos_mes.mes Número de mes
   * @apiSuccess {String} datos.datos_mes.observado Atributo que indica que el registro mensual esta observado
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   * {
   *   "finalizado": true,
   *   "mensaje": "Datos obtenidos exitosamente",
   *   "datos": {
   *     "encontrado": true,
   *     "observacion": false,
   *     "mensaje_observacion": null,
   *     "numero_documento": "123456",
   *     "nombre_completo": "JUAN MAMANI MAMANI",
   *     "fecha_nacimiento": "1900-01-01",
   *     "departamento": "Potosí",
   *     "provincia": "General Bilbao",
   *     "municipio": "Arampampa",
   *     "fecha": "2019-01-01",
   *     "datos_mes": [
   *       {
   *         "observacion": "HABILITADO",
   *         "estado": "REGISTRADO_SIGEP",
   *         "fid_gestion": 2019,
   *         "fid_mes": 24,
   *         "mes": 11,
   *         "observado": false
   *       }
   *     ]
   *   }
   * }
   */
  app.get('/pcd/:ci', validate(pcdValidation.verificar), app.controller.pcd.verificar);

  /**
   * @api {POST} /api/v1/registrar Cambio de municipio
   * @apiName Registrar cambio de municipio
   * @apiGroup PCD
   * @apiVersion  1.0.0
   * @apiDescription Api para registrar cambio de municipio
   * @apiParam {String} documento_identidad Documento de identidad de la persona
   * @apiParam {String} fecha_nacimiento Fecha de nacimiento de la persona
   * @apiParam {String} cod_municipio Código de municipio nuevo
   * @apiParam {String} direccion Descripción dirección nueva
   * @apiParam {String} documento_siprun (Opcional) Documento de respaldo pdf o jpg
   * @apiParam {String} ci_solicitante (Opcional) Documento de identidad de solicitante
   * @apiParam {String} solicitante Nombre o usuario del solicitante
   * @apiParamExample {json} Request
   * {
   *   "documento_identidad": "123456",
   *   "fecha_nacimiento": "1900-01-01",
   *   "cod_municipio": "021304",
   *   "direccion": "calle 10",
   *   "documento_siprun": null,
   *   "ci_solicitante": "",
   *   "solicitante": "ministerio"
   * }
   * @apiSuccess (201) {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess (201) {String} mensaje Indica el mensaje de éxito del envio
   * @apiSuccess (201) {Object[]} datos datos resultantes
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *    "finalizado": true,
   *    "mensaje": "Creación del registro exitoso.",
   *    "datos": {}
   * }
   *
  */
  app.post('/registrar', validate(pcdValidation.registrar), app.controller.domicilio.crearDomicilio);
  app.api.post('/solicitudes', app.controller.domicilio.obtenerSolicitudes);
  // --------------------RUTAS DE SERVICIOS -------------------------
  app.api.get('/siprunpcd-corteanual', app.controller.pcd.obtenerDatosSiprunCorteAnual);

  /**
   * @api {get} /api/v1/siprunpcd Obtiene valores del servicio SIPRUNPCD a la temporal PCD
   * @apiName Obtiene información de Siprunpcd
   * @apiGroup TMP_PCD
   * @apiVersion  1.0.0
   * @apiDescription Obtiene información de la base de datos del servicio SIPRUNPCD a la temporal PCD
   * @apiParam (Query) {fecha_inicio} fecha_inicio desde donde obtendrá la información del servicio del SIPRUNPCD
   * @apiParam (Query) {fecha_final} fecha_final hasta donde obtendrá la información del servicio del SIPRUNPCD
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Creación/Actualización de registros exitoso.",
   *    "datos": []
   *  }
   */
  app.api.get('/siprunpcd', app.controller.pcd.obtenerDatosSiprun);

   /**
   * @api {get} /api/v1/siprunpcd Obtiene valores del servicio SIPRUNPCD a la temporal PCD, para un carnet en específico
   * @apiName Obtiene información de Siprunpcd para un carnet en específico
   * @apiGroup TMP_PCD
   * @apiVersion  1.0.0
   * @apiDescription Obtiene información de la base de datos del servicio SIPRUNPCD a la temporal PCD para un carnet en específico
   * @apiParam (Query) {documento_identidad} documento de identidad para el caso que se quiere recuperar del servicio del SIPRUNPCD
   * @apiParam (Query) {fecha_emision} fecha de emisión de donde se consultara al servicio del SIPRUNPCD
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Creación/Actualización de registros exitoso.",
   *    "datos": []
   *  }
   */
  app.api.get('/siprunpcd-ci', app.controller.pcd.obtenerDatosSiprunCi);

  /**
   * @api {get} /api/v1/siprunpcd Obtiene valores del servicio IBC a la temporal PCD
   * @apiName Obtiene información del IBC
   * @apiGroup TMP_PCD
   * @apiVersion  1.0.0
   * @apiDescription Obtiene información de la base de datos del servicio IBC a la temporal PCD
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Creación/Actualización de registros exitoso.",
   *    "datos": []
   *  }
   */
  // app.api.get('/ibc:gestion', validate(pcdValidation.verificarGestion), app.controller.pcd.obtenerDatosIBC);
  app.api.get('/ibc', app.controller.pcd.obtenerDatosIBC);

  // app.api.get('/ibc', app.controller.pcd.obtenerDatosIBC);

  app.api.get('/ovt-parche', app.controller.pcd.obtenerDatosOvt);
  // Consulta abierta a ciudadania
  app.get('/ciudadania-pcd/', app.controller.pcd.ciudadaniaConsulta);

  /**
   * @api {PUT} /api/v1/centralizador/edicion-pcd Modificar datos de PCD
   * @apiName Modificar datos de PCD
   * @apiGroup PCD
   * @apiVersion  1.0.0
   * @apiDescription Api para actualizar datos de PCD
   * @apiParam {Int} id_pcd Identificador del registro PCD
   * @apiParam {String} documento_identidad Documento de identidad de la persona
   * @apiParam {String} complemento Complemento documento identidad de la persona
   * @apiParam {String} fecha_nacimiento Fecha de nacimiento de la persona
   * @apiParam {Boolean} nombres Nombres y apellidos de la persona
   * @apiParam {Boolean} otros Parametro a actualizar [opcional]
   * @apiParamExample {json} Request-Documento-identidad
   * {
   *     "id_pcd": 100,
   *     "documento_identidad": "1234567",
   *     "otros": true
   * }
   * @apiParamExample {json} Request-Complemento
   * {
   *     "id_pcd": 100,
   *     "complemento": "1C",
   *     "otros": true
   * }
   * @apiParamExample {json} Request-Fecha-nacimiento
   * {
   *     "id_pcd": 100,
   *     "fecha_nacimiento": "2000-10-10",
   *     "otros": true
   * }
   * @apiParamExample {json} Request-Nombres
   * {
   *     "id_pcd": 100,
   *     "nombres": true,
   *     "otros": true
   * }
   * @apiSuccess (201) {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess (201) {String} mensaje Indica el mensaje de éxito de la creación
   * @apiSuccess (201) {Object[]} datos datos resultantes
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 201 OK
   * {
   *    "finalizado": true,
   *    "mensaje": "Datos actualizados correctamente.",
   *    "datos": {}
   * }
   *
  */
  // Edición especial para realizar ajuste de la inforación
  app.api.put('/centralizador/edicion-pcd', app.controller.pcd.edicionPcd);

  // Listado de beneficios por pcd
  app.api.get('/centralizador/pcd-beneficio', validate(pcdValidation.pcdBeneficio), app.controller.pcd.listarPcdBeneficio);

  // Edición especial para realizar ajuste de la inforación
  app.api.put('/centralizador/inhabilitar-pcd', app.controller.pcd.inhabilitarPcd);
};
