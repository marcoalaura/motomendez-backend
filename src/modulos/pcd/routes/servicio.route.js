import validate from 'express-validation';
import servicioValidation from './servicio.validation';

module.exports = (app) => {
  /**
   *
    * @api {get} /api/v1/:ci?fecha_nacimiento=&complemento_documento= Obtiene certificados de persona con discapacidad
    * @apiName Obtiene certificados de persona con discapacidad
    * @apiGroup SERVICIO
    * @apiVersion  1.0.0
    * @apiDescription Obtiene certificados de persona con discapacidad
    *
    * @apiSuccess {String} codigo Indica si se encontro o no un registro
    * @apiSuccess {Boolean} finalizado Indica que la petición se realizó con éxito
    * @apiSuccess {String} mensaje Indica el mensaje de éxito de la petición
    * @apiSuccess {Object} datos datos solicitados
    * @apiSuccess {Integer} datos.documento_identidad Documento de identidad de la persona
    * @apiSuccess {String} datos.complemento_documento Complemento del documento de identidad de la persona
    * @apiSuccess {String} datos.nombre Nombre de la persona
    * @apiSuccess {String} datos.fecha_nacimiento Fecha de nacimiento de la persona
    * @apiSuccess {String} datos.sexo Genero de la persona (M=masculino, F=femenino)
    * @apiSuccess {String} datos.correo_electronico Correo electrónico de la persona
    * @apiSuccess {String} datos.direccion Dirección de la persona
    * @apiSuccess {String} datos.telefono Telefono de la persona
    * @apiSuccess {String} datos.cod_municipio Código del municipio de la persona
    * @apiSuccess {String} datos.municipio Municipio de la persona
    * @apiSuccess {String} datos.provincia Provincia de la persona
    * @apiSuccess {String} datos.departamento Departamento de la persona
    * @apiSuccess {String} datos.estado Estado del dato persona
    * @apiSuccess {String} datos.observacion Observacion del registro
    * @apiSuccess {Object} datos.certificado Array de certificados
    * @apiSuccess {String} datos.certificado.tipo_certificado Tipo de certificado (SIPRUNPCD, IBC)
    * @apiSuccess {String} datos.certificado.numero_registro Número de registro del certificado
    * @apiSuccess {String} datos.certificado.tipo_discapacidad Tipo de discapacidad de la persona
    * @apiSuccess {String} datos.certificado.grado_discapacidad Grado de discapacidad de la persona
    * @apiSuccess {String} datos.certificado.porcentaje_discapacidad Porcentaje de discapacidad de la persona
    * @apiSuccess {String} datos.certificado.fecha_vigencia Fecha de vigencia del certificado
    * @apiSuccess {String} datos.certificado.fecha_emision Fecha de emisión del certificado
    * @apiSuccessExample  {json} Success-Example:
    * HTTP/1.1 200 OK
        {
        "codigo": 1,
        "finalizado": true,
        "mensaje": "Obtencion de datos exitoso.",
        "datos": {
            "documento_identidad": "1000006",
            "complemento_documento": "00",
            "nombre": "",
            "fecha_nacimiento": "01/01/1980",
            "sexo": "M",
            "correo_electronico": null,
            "direccion": null,
            "telefono": null,
            "cod_municipio": 10102,
            "municipio": "Yotala",
            "provincia": "Oropeza",
            "departamento": "Chuquisaca",
            "observacion": null,
            "certificado": [
                {
                    "tipo_certificado": "x",
                    "numero_registro": "4",
                    "tipo_discapacidad": "GRAVE",
                    "grado_discapacidad": "20",
                    "porcentaje_discapacidad": 30,
                    "fecha_vigencia": "17/11/2017",
                    "fecha_emision": "17/11/2017"
                }
            ]
        }
    }
  */
  app.api.get('/pcd/:ci', app.controller.servicio.obtenerPcdCertificados);
  /**
   *
    * @api {post} /api/v1/pcd Registrar beneficio
    * @apiName Registra beneficio de persona con discapacidad
    * @apiGroup SERVICIO
    * @apiVersion  1.0.0
    * @apiDescription Registra beneficio de persona con discapacidad
    *
    * @apiParam {Integer} datos.documento_identidad Documento de identidad de la persona
    * @apiParam {String} datos.complemento_documento Complemento del documento de identidad de la persona
    * @apiParam {String} datos.nombres Nombre de la persona
    * @apiParam {String} datos.primer_apellido Primer apellido de la persona
    * @apiParam {String} datos.segundo_apellido Segundo apellido de la persona
    * @apiParam {String} datos.fecha_nacimiento Fecha de nacimiento de la persona
    * @apiParam {String} datos.fecha_inicio Fecha de inicio del beneficio
    * @apiParam {String} datos.fecha_fin Fecha de fin del beneficio (opcional)
    * @apiParam {String} datos.nit Nit de la empresa (opcional)
    * @apiParam {String} datos.matricula Matricula de la empresa (opcional)
    * @apiParam {String} datos.descripcion Descripción del beneficio (opcional)
    * @apiParam {String} datos.observacion Observación del beneficio (opcional)
    * @apiParam {String} datos.tipo Parámetro para diferenciar si el beneficiario es pcd:persona con discapacidad o tutor:tutor de la personacon discapacidad
    * @apiParam {String} datos.pcd Array de personas de discapacidad [tipo:tutor (requerido), tipo:pcd (no requerido)]
    * @apiParam {Integer} datos.pcd.documento_identidad Documento de identidad de la persona
    * @apiParam {String} datos.pcd.complemento_documento Complemento del documento de identidad de la persona
    * @apiParam {String} datos.pcd.nombres Nombre de la persona
    * @apiParam {String} datos.pcd.primer_apellido Primer apellido de la persona
    * @apiParam {String} datos.pcd.segundo_apellido Segundo apellido de la persona
    * @apiParam {String} datos.pcd.fecha_nacimiento Fecha de nacimiento de la persona
    * @apiParam {String} datos.pcd.observacion Observación del beneficio (opcional)
    * @apiParamExample {json} Request-Example (tipo:pcd)
    * HTTP/1.1 200 OK
        {
            "documento_identidad": "1000006",
            "complemento_documento": "1C",
            "nombres": "jose",
            "primer_apellido": "mamani",
            "segundo_apellido": "mamanni",
            "fecha_nacimiento": "01/01/1980",
            "fecha_inicio": "23/01/1980",
            "fecha_fin": "23/01/1981",
            "nit": "1",
            "matricula": "1",
            "tipo": "pcd",
            "descripcion": "ss",
            "observacion": "obs"
        }
    * @apiParamExample {json} Request-Example (tipo:tutor)
    * HTTP/1.1 200 OK
        {
            "documento_identidad": "10000066",
            "complemento_documento": "",
            "nombres": "jose",
            "primer_apellido": "mamani",
            "segundo_apellido": "mamanni",
            "fecha_nacimiento": "23/01/1981",
            "fecha_inicio": "23/01/1980",
            "fecha_fin": "",
            "nit": "14",
            "matricula": "1",
            "tipo": "tutor",
            "descripcion": "ssdfdf",
            "observacion": "obs",
            "pcd": [
                {
                    "documento_identidad": "1000006",
                    "complemento_documento": "",
                    "nombres": "jose",
                    "primer_apellido": "mamani",
                    "segundo_apellido": "mamanni",
                    "fecha_nacimiento": "01/01/1980",
                    "observacion": "TUTOR"
                },
                {
                    "documento_identidad": "1000006",
                    "complemento_documento": "",
                    "nombres": "Martin",
                    "primer_apellido": "mamani",
                    "segundo_apellido": "mamanni",
                    "fecha_nacimiento": "01/01/1980",
                    "observacion": "TUTOR"
                }
            ]
        }
    * @apiSuccessExample  {json} Success-Example:
    * HTTP/1.1 200 OK
        {
            "codigo": 1,
            "finalizado": true,
            "mensaje": "Registro exitoso.",
            "datos": {}
        }
  */
  app.api.post('/pcd', validate(servicioValidation.crearBeneficio), app.controller.servicio.crearPcdBeneficio);
};
