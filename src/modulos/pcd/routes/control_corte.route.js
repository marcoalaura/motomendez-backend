module.exports = (app) => {
  /**
   *
   * @api {get} /api/v1/centralizador/control_corte/lista_control_corte Obtiene en un listado los procesos de corte realizados
   * @apiName Lista control corte
   * @apiGroup Control Corte
   * @apiVersion  1.0.0
   * @apiDescription Obtiene la lista de los procesos del control corte realizados
   *
   * @apiParam (Query) {Numerico} tipo Tipo de corte, puede ser esta ANUAL o MENSUAL
   * @apiParam (Query) {Numerico} gestion (Opcional) gestión de elaboración del corte
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Integer} datos.id_control_corte Id del control corte
   * @apiSuccess {Integer} datos.gestion gestion de la operavion
   * @apiSuccess {Integer} datos.mes mes de la operacion cuando es del tipo MENUSUAL
   * @apiSuccess {String} datos.estado estado del proceso
   * @apiSuccess {String} datos.tipo_corte Identificaicon del tipo de corte
   * @apiSuccess {Json} datos.pasos Json de configuracion que detalla el estado de los pasos del proceso
   * @apiSuccess {Integer} datos._usuario_creacion Id del usuario que creo el registro
   * @apiSuccess {Integer} datos._usuario_modificacion Id del usuario que modifico el registro
   * @apiSuccess {Date} datos._fecha_creacion Fecha de creacion del registro
   * @apiSuccess {Date} datos._fecha_modificacion Fecha de modificacion del registro
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
      {
        "finalizado": true,
        "mensaje": "Listado exitoso.",
        "datos": {
          "id_control_corte": 1,
          "gestion": "2019",
          "mes": 11,
          "estado": "FINALIZADO",
          "tipo_corte": "MENSUAL",
          "pasos": "[{\"orden\":1,\"paso\":\"cargar_tmp_pcd\",\"descripcion\":\"Cargar información desde el servicio SIPRUN\",\"estado\":\"FINALIZADO\",\"validador\":\"paso1\",\"tipo\":\"GET\",\"api\":\"siprunpcd\"},{\"orden\":2,\"paso\":\"cargar_ibc\",\"descripcion\":\"Carga la información IBC del registro temporal corte anual al temporal pcd\",\"estado\":\"FINALIZADO\",\"validador\":\"paso2\",\"tipo\":\"GET\",\"api\":\"ibc\"},{\"orden\":3,\"paso\":\"contrastar_tmp_pcd\",\"descripcion\":\"Contrastar información del registro temporal pcd\",\"estado\":\"FINALIZADO\",\"validador\":\"paso3\",\"tipo\":\"POST\",\"api\":\"centralizador/contrastar_tmp_pcd\"},{\"orden\":4,\"paso\":\"registro_pcd\",\"descripcion\":\"Realizar el registro a las tablas persona, pcd y certificado\",\"estado\":\"FINALIZADO\",\"validador\":\"paso4\",\"tipo\":\"POST\",\"api\":\"centralizador/registrar_tmp_pcd\"},{\"orden\":5,\"paso\":\"sigep_registro_sin_cod_benef\",\"descripcion\":\"Registrar de beneficiarios sin cod_beneficiario\",\"estado\":\"FINALIZADO\",\"validador\":\"paso5\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/beneficiario?gestion=2019\"},{\"orden\":6,\"paso\":\"sigep_registro_con_cod_benef\",\"descripcion\":\"Registrar de beneficiarios con cod_beneficiario\",\"estado\":\"FINALIZADO\",\"validador\":\"paso6\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/observados\"},{\"orden\":7,\"paso\":\"sigep_datos_adicionales\",\"descripcion\":\"Registar de datos adicionales (Asociar municipio)\",\"estado\":\"FINALIZADO\",\"validador\":\"paso7\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/datos_adicionales\"},{\"orden\":8,\"paso\":\"bono_retroactivo\",\"descripcion\":\"Retroactivo para habilitar casos observados\",\"estado\":\"FINALIZADO\",\"validador\":\"paso8\",\"tipo\":\"GET\",\"api\":\"centralizador/bono_retroactivo?gestion=2019\"},{\"orden\":9,\"paso\":\"bono_regularizados\",\"descripcion\":\"Generacion de los bonos regularizados\",\"estado\":\"FINALIZADO\",\"validador\":\"paso9\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/bono_regularizados?gestion=2019\"},{\"orden\":10,\"paso\":\"corte_mensual\",\"descripcion\":\"Realizar el proceso de corte mensual\",\"estado\":\"FINALIZADO\",\"validador\":\"paso10\",\"tipo\":\"GET\",\"api\":\"centralizador/corte_mensual?mes=11\"},{\"orden\":11,\"paso\":\"bono_corte_mensual\",\"descripcion\":\"Realizar la generación de bonos del corte mensual\",\"estado\":\"FINALIZADO\",\"validador\":\"paso11\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/bono?gestion=2019&mes=11\"},{\"orden\":12,\"paso\":\"reporte_mensual\",\"descripcion\":\"Genera el reporte mensual\",\"estado\":\"FINALIZADO\",\"validador\":\"paso12\",\"tipo\":\"GET\",\"api\":\"centralizador/reporte_mensual?gestion=2019&mes=11\"},{\"orden\":13,\"paso\":\"reporte_acumulado\",\"descripcion\":\"Genera el reporte acumulado\",\"estado\":\"FINALIZADO\",\"validador\":\"paso13\",\"tipo\":\"GET\",\"api\":\"centralizador/reporte_acumulado?gestion=2019&mes=11\"}]",
          "_usuario_creacion": 2,
          "_usuario_modificacion": 2,
          "_fecha_creacion": "2019-11-25T19:42:52.958Z",
          "_fecha_modificacion": "2019-11-27T11:53:14.867Z",
        }
      }
   * @apiError {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiError {String} mensaje que detalla el error de la respuesta
   * @apiError {Object} datos datos solicitados
   * @apiErrorExample  {json} Error-Example:
   * HTTP/1.1 412 OK
      {
        "finalizado": false,
        "mensaje": "Error inesperado.",
        "datos": {}
      }
   *
   */
  // ----- Menu (lista de cortes mensuales realizados) -------
  app.api.get('/centralizador/control_corte/lista_control_corte', app.controller.controlCorte.listaControlCorte);
  /**
   *
   * @api {get} /api/v1/centralizador/control_corte/detalle_control_corte Obtiene el detalle del proceso de corte realizado
   * @apiName Detalle control corte
   * @apiGroup Control Corte
   * @apiVersion  1.0.0
   * @apiDescription Obtiene el detalle del proceso del control corte selecionado
   *
   * @apiParam (Query) {Numerico} tipo Tipo de corte, puede ser esta ANUAL o MENSUAL
   * @apiParam (Query) {Numerico} gestion (Opcional) gestión de elaboración del corte
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * @apiSuccess {Integer} datos.id_control_corte Id del control corte
   * @apiSuccess {Integer} datos.gestion gestion de la operavion
   * @apiSuccess {Integer} datos.mes mes de la operacion cuando es del tipo MENUSUAL
   * @apiSuccess {String} datos.estado estado del proceso
   * @apiSuccess {String} datos.tipo_corte Identificaicon del tipo de corte
   * @apiSuccess {Json} datos.pasos Json de configuracion que detalla el estado de los pasos del proceso
   * @apiSuccess {Integer} datos._usuario_creacion Id del usuario que creo el registro
   * @apiSuccess {Integer} datos._usuario_modificacion Id del usuario que modifico el registro
   * @apiSuccess {Date} datos._fecha_creacion Fecha de creacion del registro
   * @apiSuccess {Date} datos._fecha_modificacion Fecha de modificacion del registro
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
      {
        "finalizado": true,
        "mensaje": "Listado exitoso.",
        "datos": {
          "id_control_corte": 1,
          "gestion": "2019",
          "mes": 11,
          "estado": "FINALIZADO",
          "tipo_corte": "MENSUAL",
          "pasos": "[{\"orden\":1,\"paso\":\"cargar_tmp_pcd\",\"descripcion\":\"Cargar información desde el servicio SIPRUN\",\"estado\":\"FINALIZADO\",\"validador\":\"paso1\",\"tipo\":\"GET\",\"api\":\"siprunpcd\"},{\"orden\":2,\"paso\":\"cargar_ibc\",\"descripcion\":\"Carga la información IBC del registro temporal corte anual al temporal pcd\",\"estado\":\"FINALIZADO\",\"validador\":\"paso2\",\"tipo\":\"GET\",\"api\":\"ibc\"},{\"orden\":3,\"paso\":\"contrastar_tmp_pcd\",\"descripcion\":\"Contrastar información del registro temporal pcd\",\"estado\":\"FINALIZADO\",\"validador\":\"paso3\",\"tipo\":\"POST\",\"api\":\"centralizador/contrastar_tmp_pcd\"},{\"orden\":4,\"paso\":\"registro_pcd\",\"descripcion\":\"Realizar el registro a las tablas persona, pcd y certificado\",\"estado\":\"FINALIZADO\",\"validador\":\"paso4\",\"tipo\":\"POST\",\"api\":\"centralizador/registrar_tmp_pcd\"},{\"orden\":5,\"paso\":\"sigep_registro_sin_cod_benef\",\"descripcion\":\"Registrar de beneficiarios sin cod_beneficiario\",\"estado\":\"FINALIZADO\",\"validador\":\"paso5\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/beneficiario?gestion=2019\"},{\"orden\":6,\"paso\":\"sigep_registro_con_cod_benef\",\"descripcion\":\"Registrar de beneficiarios con cod_beneficiario\",\"estado\":\"FINALIZADO\",\"validador\":\"paso6\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/observados\"},{\"orden\":7,\"paso\":\"sigep_datos_adicionales\",\"descripcion\":\"Registar de datos adicionales (Asociar municipio)\",\"estado\":\"FINALIZADO\",\"validador\":\"paso7\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/datos_adicionales\"},{\"orden\":8,\"paso\":\"bono_retroactivo\",\"descripcion\":\"Retroactivo para habilitar casos observados\",\"estado\":\"FINALIZADO\",\"validador\":\"paso8\",\"tipo\":\"GET\",\"api\":\"centralizador/bono_retroactivo?gestion=2019\"},{\"orden\":9,\"paso\":\"bono_regularizados\",\"descripcion\":\"Generacion de los bonos regularizados\",\"estado\":\"FINALIZADO\",\"validador\":\"paso9\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/bono_regularizados?gestion=2019\"},{\"orden\":10,\"paso\":\"corte_mensual\",\"descripcion\":\"Realizar el proceso de corte mensual\",\"estado\":\"FINALIZADO\",\"validador\":\"paso10\",\"tipo\":\"GET\",\"api\":\"centralizador/corte_mensual?mes=11\"},{\"orden\":11,\"paso\":\"bono_corte_mensual\",\"descripcion\":\"Realizar la generación de bonos del corte mensual\",\"estado\":\"FINALIZADO\",\"validador\":\"paso11\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/bono?gestion=2019&mes=11\"},{\"orden\":12,\"paso\":\"reporte_mensual\",\"descripcion\":\"Genera el reporte mensual\",\"estado\":\"FINALIZADO\",\"validador\":\"paso12\",\"tipo\":\"GET\",\"api\":\"centralizador/reporte_mensual?gestion=2019&mes=11\"},{\"orden\":13,\"paso\":\"reporte_acumulado\",\"descripcion\":\"Genera el reporte acumulado\",\"estado\":\"FINALIZADO\",\"validador\":\"paso13\",\"tipo\":\"GET\",\"api\":\"centralizador/reporte_acumulado?gestion=2019&mes=11\"}]",
          "_usuario_creacion": 2,
          "_usuario_modificacion": 2,
          "_fecha_creacion": "2019-11-25T19:42:52.958Z",
          "_fecha_modificacion": "2019-11-27T11:53:14.867Z",
        }
      }
   * @apiError {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiError {String} mensaje que detalla el error de la respuesta
   * @apiError {Object} datos datos solicitados
   * @apiErrorExample  {json} Error-Example:
   * HTTP/1.1 412 OK
      {
        "finalizado": false,
        "mensaje": "Error inesperado.",
        "datos": {}
      }
   *
   */
  app.api.get('/centralizador/control_corte/detalle_control_corte', app.controller.controlCorte.detalleControlCorte);
   /**
   *
   * @api {post} /api/v1/centralizador/control_corte/habilitar_control_corte Realiza la habilitación de un nuevo corte, sea este mensual o anual
   * @apiName Habilitar control corte
   * @apiGroup Control Corte
   * @apiVersion  1.0.0
   * @apiDescription Realiza la habilitación de un nuevo corte, sea este mensual o anual
   *
   * @apiParam (Param) {Numerico} tipo Tipo de corte, puede ser esta ANUAL o MENSUAL
   * @apiParam (Param) {Numerico} gestion (Opcional) gestión de elaboración del corte
   *
   * @apiSuccess {Date} _fecha_creacion Fecha de creacion del registro
   * @apiSuccess {Date} _fecha_modificacion Fecha de modificacion del registro
   * @apiSuccess {Integer} _usuario_creacion Id del usuario que creo el registro
   * @apiSuccess {Integer} _usuario_modificacion Id del usuario que modifico el registro
   * @apiSuccess {String} estado estado del proceso
   * @apiSuccess {Integer} gestion gestion de la operavion
   * @apiSuccess {Integer} id_control_corte Id del control corte
   * @apiSuccess {Integer} mes mes de la operacion cuando es del tipo MENUSUAL
   * @apiSuccess {Json} pasos Json de configuracion que detalla el estado de los pasos del proceso
   * @apiSuccess {String} tipo_corte Identificaicon del tipo de corte
   * @apiSuccessExample  {json} Success-Example:
   * HTTP/1.1 200 OK
      {
        "_fecha_creacion": "2019-12-24T14:44:08.065Z",
        "_fecha_modificacion": "2019-12-24T14:44:08.065Z",
        "_usuario_creacion": 2,
        "_usuario_modificacion": null,
        "estado": "PENDIENTE",
        "gestion": "2019",
        "id_control_corte": 2,
        "mes": 12,
        "pasos": "[{\"orden\":1,\"paso\":\"cargar_tmp_pcd\",\"descripcion\":\"Cargar información desde el servicio SIPRUN\",\"estado\":\"HABILITADO\",\"validador\":\"paso1\",\"tipo\":\"GET\",\"api\":\"siprunpcd\"},{\"orden\":2,\"paso\":\"cargar_ibc\",\"descripcion\":\"Carga la información IBC del registro temporal corte anual al temporal pcd\",\"estado\":\"PENDIENTE\",\"validador\":\"paso2\",\"tipo\":\"GET\",\"api\":\"ibc\"},{\"orden\":3,\"paso\":\"contrastar_tmp_pcd\",\"descripcion\":\"Contrastar información del registro temporal pcd\",\"estado\":\"PENDIENTE\",\"validador\":\"paso3\",\"tipo\":\"POST\",\"api\":\"centralizador/contrastar_tmp_pcd\"},{\"orden\":4,\"paso\":\"registro_pcd\",\"descripcion\":\"Realizar el registro a las tablas persona, pcd y certificado\",\"estado\":\"PENDIENTE\",\"validador\":\"paso4\",\"tipo\":\"POST\",\"api\":\"centralizador/registrar_tmp_pcd\"},{\"orden\":5,\"paso\":\"sigep_registro_sin_cod_benef\",\"descripcion\":\"Registrar de beneficiarios sin cod_beneficiario\",\"estado\":\"PENDIENTE\",\"validador\":\"paso5\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/beneficiario?gestion=2019\"},{\"orden\":6,\"paso\":\"sigep_registro_con_cod_benef\",\"descripcion\":\"Registrar de beneficiarios con cod_beneficiario\",\"estado\":\"PENDIENTE\",\"validador\":\"paso6\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/observados\"},{\"orden\":7,\"paso\":\"sigep_datos_adicionales\",\"descripcion\":\"Registar de datos adicionales (Asociar municipio)\",\"estado\":\"PENDIENTE\",\"validador\":\"paso7\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/datos_adicionales\"},{\"orden\":8,\"paso\":\"bono_retroactivo\",\"descripcion\":\"Retroactivo para habilitar casos observados\",\"estado\":\"PENDIENTE\",\"validador\":\"paso8\",\"tipo\":\"GET\",\"api\":\"centralizador/bono_retroactivo?gestion=2019\"},{\"orden\":9,\"paso\":\"bono_regularizados\",\"descripcion\":\"Generacion de los bonos regularizados\",\"estado\":\"PENDIENTE\",\"validador\":\"paso9\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/bono_regularizados?gestion=2019\"},{\"orden\":10,\"paso\":\"corte_mensual\",\"descripcion\":\"Realizar el proceso de corte mensual\",\"estado\":\"PENDIENTE\",\"validador\":\"paso10\",\"tipo\":\"GET\",\"api\":\"centralizador/corte_mensual?mes=12\"},{\"orden\":11,\"paso\":\"bono_corte_mensual\",\"descripcion\":\"Realizar la generación de bonos del corte mensual\",\"estado\":\"PENDIENTE\",\"validador\":\"paso11\",\"tipo\":\"GET\",\"api\":\"centralizador/sigep/bono?gestion=2019&mes=12\"},{\"orden\":12,\"paso\":\"reporte_mensual\",\"descripcion\":\"Genera el reporte mensual\",\"estado\":\"PENDIENTE\",\"validador\":\"paso12\",\"tipo\":\"GET\",\"api\":\"centralizador/reporte_mensual?gestion=2019&mes=12\"},{\"orden\":13,\"paso\":\"reporte_acumulado\",\"descripcion\":\"Genera el reporte acumulado\",\"estado\":\"PENDIENTE\",\"validador\":\"paso13\",\"tipo\":\"GET\",\"api\":\"centralizador/reporte_acumulado?gestion=2019&mes=12\"}]",
        "tipo_corte": "MENSUAL",
      }
   */
  app.api.post('/centralizador/control_corte/habilitar_control_corte', app.controller.controlCorte.habilitarControlCorte);
  /**
   *
   * @api {post} /api/v1/centralizador/control_corte/actualizar_control_corte/:id Realiza la actualización del registro control corte mensual o anual
   * @apiName Actualizar control corte
   * @apiGroup Control Corte
   * @apiVersion  1.0.0
   * @apiDescription Realiza la actualización del registro de control corte mensual o anual
   *
   * @apiParam (Query) {Integer} ID del registro (Obligatorio) del control corte
   * @apiParam (Param) {Integer} orden que corresponde a la actualización
   * @apiParam (Param) {TIpo} Tipo de control corte MENSUAL o ANUAL
   *
   * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
   * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
   * @apiSuccess {Object} datos datos solicitados
   * HTTP/1.1 200 OK
      {
        "finalizado": true,
        "mensaje": "Listado exitoso.",
        "datos": {}
      }
  */
  app.api.put('/centralizador/control_corte/actualizar_control_corte/:id', app.controller.controlCorte.actualizarControlCorte);
};
