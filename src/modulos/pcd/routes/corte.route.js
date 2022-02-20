module.exports = (app) => {
  // ------------------------- FLUJO -----------------------------------------
  // 1. Realizar Corte Anual
  //        -gestion
  //        -idUsuario
  /**
   * @api {get} /api/v1/centralizador/corte Corte Anual
   * @apiName Proceso de corte anual
   * @apiGroup Corte Anual
   * @apiVersion  1.0.0
   * @apiDescription Realiza el proceso de corte anual
   * @apiParam (Query) {gestion} gestion o año que se procesará
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Corte realizado con éxito.",
   *    "datos": []
   *  }
   */
  app.api.get('/centralizador/corte', app.controller.corte.corteAnual);

  // 2. Registrar Beneficiarios en el SIGEP
  //        -gestion
  //        -idUsuario
  /**
   * @api {get} /api/v1/centralizador/sigep/beneficiario Alta de beneficiarios
   * @apiName Beneficiarios
   * @apiGroup Corte Anual
   * @apiVersion  1.0.0
   * @apiDescription Realiza el proceso de alta de beneficiarios
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Beneficiarios Registrados con exito.",
   *    "datos": []
   *  }
   */
  app.api.get('/centralizador/sigep/beneficiario', app.controller.corte.registrarBeneficiariosSigep);

  // 2.1. Actualizar Beneficiarios
  /**
   * @api {get} /api/v1/centralizador/sigep/observados Beneficiarios observados
   * @apiName Beneficiarios observados
   * @apiGroup Corte Anual
   * @apiVersion  1.0.0
   * @apiDescription Realiza el proceso de actualización de datos del beneficiarios
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Beneficiarios actualizados con exito.",
   *    "datos": []
   *  }
   */
  app.api.get('/centralizador/sigep/observados', app.controller.corte.actualizarBeneficiariosSigep);

  // 3. Registrar datos Adicionales
  //        -estado
  /**
   * @api {get} /api/v1/centralizador/sigep/datos_adicionales Datos adicionales
   * @apiName Datos adicionales de beneficiario
   * @apiGroup Corte Anual
   * @apiVersion  1.0.0
   * @apiDescription Realiza el proceso de registro de datos adicionales de beneficiario
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Beneficiarios Registrados con exito.",
   *    "datos": []
   *  }
   */
  app.api.get('/centralizador/sigep/datos_adicionales', app.controller.corte.registrarDatosAdicionalesSigep);

  // 4. Realizar Corte Mensual
  //        -mes
  /**
   * @api {get} /api/v1/centralizador/corte_mensual Corte Mensual
   * @apiName Proceso de corte mensual
   * @apiGroup Corte Mensual
   * @apiVersion  1.0.0
   * @apiDescription Realiza el proceso de corte mensual
   * @apiParam (Query) {mes} mes del corte que se esta procesando
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Corte realizado con éxito.",
   *    "datos": []
   *  }
   */
  app.api.get('/centralizador/corte_mensual', app.controller.corte.corteMensual);

  // 5. registrar Bono Gestion Mes
  //        -gestion
  //        -mes
  // 4. Realizar Corte Mensual
  //        -mes
  /**
   * @api {get} /api/v1/sigep/bono Bono
   * @apiName Proceso de generación de bonos
   * @apiGroup Corte Mensual
   * @apiVersion  1.0.0
   * @apiDescription Realiza el proceso de corte mensual
   * @apiParam (Query) {gestion} gestion del corte que se esta procesando
   * @apiParam (Query) {mes} mes del corte que se esta procesando
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Bonos Registrados con exito.",
   *    "datos": []
   *  }
   */
  app.api.get('/centralizador/sigep/bono', app.controller.corte.registrarBonosBeneficiarios);

  // 6. generar reṕorte Mensual por Municipio
  //        -gestion
  //        -mes
  /**
   * @api {get} /api/v1/centralizador/reporte_mensual
   * @apiName Reporte mensual
   * @apiGroup Corte Mensual
   * @apiVersion  1.0.0
   * @apiDescription Genera el reporte del corte mensual
   * @apiParam (Query) {gestion} gestion del corte que se esta procesando
   * @apiParam (Query) {mes} mes del corte que se esta procesando
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Corte realizado con éxito.",
   *    "datos": []
   *  }
   */
  app.api.get('/centralizador/reporte_mensual', app.controller.corte.generarReportesGestionMes);

  app.api.post('/centralizador/reporte_mensual', app.controller.corte.regenerarReportesMunicipio);
  // ------------------------------ FIN DE FLUJO ------------------------------

  app.api.get('/centralizador/observados', app.controller.corte.obtenerObservadosGestionMes);

  app.api.get('/centralizador/corte/reporte/log', app.controller.corte.reporteLog);

  // TODO: temporal
  app.api.get('/centralizador/tutor/regularizar_archivos', app.controller.corte.regularizarArchivos);

  app.api.get('/centralizador/sigep/actualiza_pagos', app.controller.corte.actualizarPagosBonos);

  // ------------------ REGULARIZACIONES MENSUALES -------------------------------
  // 0. Generar retroactivos (observados)
  //    -gestion
  app.api.get('/centralizador/bono_retroactivo', app.controller.corte.generarRetroactivos);
  // 1. Generar los pagos en el SIGEP
  //    -fecha-inicio a fecha-fin
  //    -gestion
  app.api.get('/centralizador/sigep/bono_regularizados', app.controller.corte.registrarBonosBeneficiariosRegularizados);
  // 2. generar reportes pdf Mensual por Municipio de regularizados
  //    -fecha-inicio a fecha-fin
  //    -gestion
  app.api.get('/centralizador/reporte_retroactivo', app.controller.corte.generarReportesGestionMesRegularizados);
  // 2.1 generar reportes pdf acumulados por Municipio incluido los regularizados
  //    -gestion
  //    -mes
  /**
   * @api {get} /api/v1/centralizador/reporte_acumulado
   * @apiName Reporte acumulado
   * @apiGroup Corte Mensual
   * @apiVersion  1.0.0
   * @apiDescription Genera el reporte del corte acumulado
   * @apiParam (Query) {gestion} gestion del corte que se esta procesando
   * @apiParam (Query) {mes} mes del corte que se esta procesando
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
   *  {
   *    "finalizado": true,
   *    "mensaje": "Corte realizado con éxito.",
   *    "datos": []
   *  }
   */
  app.api.get('/centralizador/reporte_acumulado', app.controller.corte.generarReportesGestionMesAcumulado);
};
