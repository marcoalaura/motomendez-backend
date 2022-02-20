// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('plantilla', [{
      nombre: 'USUARIO_REGISTRO',
      remitente: 'PLATAFORMA PLURINACIONAL DE INFORMACIÓN DE PERSONAS CON DISCAPACIDAD',
      origen: 'centralizadorpcd@agetic.gob.bo',
      asunto: 'Activación de cuenta - PLATAFORMA PLURINACIONAL DE INFORMACIÓN DE PERSONAS CON DISCAPACIDAD',
      contenido: `<html>
      
      <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <meta charset="utf-8"> </head>
      
      <body style="background-color: #F1EEEE;">
        <div style='background-color: #fff; width: 450px; margin: 5px auto; text-align: justify; line-height: 1.5; font-size: 14px;'>
          <div style='border-bottom: 2px solid #3254CF; text-align: center; color: #A4A4A4; padding: 10px 10px; font-size: 25px; font-weight: bold;'>
            <img style="width: 100%; max-width: 420px;" src={{urlLogoMinisterio}} 
              title="PLATAFORMA PLURINACIONAL DE INFORMACIÓN DE PERSONAS CON DISCAPACIDAD “EUSTAQUIO MOTO MÉNDEZ”"
              alt="PLATAFORMA PLURINACIONAL DE INFORMACIÓN DE PERSONAS CON DISCAPACIDAD “EUSTAQUIO MOTO MÉNDEZ”">
          </div>
          <div style="padding: 30px 10px 0; text-align: center;">
            <span style="color: #6E6E6E; font-weight: 700;"> Activación de cuenta </span>
          </div>
          <div style="margin: 10px; padding: 5px 15px 10px;">
            <p>Hola {{nombre}}, bienvenido al Sistema.</p>
            <p>Su cuenta de usuario necesita confirmación para ser activada. Ingrese al siguiente enlace para establecer su contraseña:
            </p>
            <br>
            <div style="text-align:center; font-size:20px; ">
              <a style="color: #3254CF; font-weight: bold; " href="{{urlSistemaActivacion}}">Ingresar</a>
            </div>
            <br>
            <div style="text-align:center;">
              <p>Recuerde que éstos datos son confidenciales</p>
            </div>
            <div>
              <p style="margin: 0;">Saludos cordiales.</p>
              <p style="margin: 0;">PLATAFORMA PLURINACIONAL DE INFORMACIÓN DE PERSONAS CON DISCAPACIDAD “EUSTAQUIO MOTO MÉNDEZ”</p>
            </div>
          </div>
        </div>
      </body>
      
      </html>`,
      tipo: 'EMAIL',
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date(),
    },
    {
      nombre: 'SOPORTE',
      remitente: 'PLATAFORMA PLURINACIONAL DE INFORMACIÓN DE PERSONAS CON DISCAPACIDAD',
      origen: 'centralizadorpcd@agetic.gob.bo',
      asunto: 'PEMM - Soporte',
      contenido: `<html>
      
      <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <meta charset="utf-8"> </head>
      
      <body style="background-color: #F1EEEE;">
        <div style='background-color: #fff; width: 800px; margin: 5px auto; text-align: justify; line-height: 1.5; font-size: 14px;'>
          <div style='border-bottom: 2px solid #3254CF; text-align: center; color: #A4A4A4; padding: 10px 10px; font-size: 15px; font-weight: bold;'>
              PLATAFORMA PLURINACIONAL DE INFORMACIÓN DE PERSONAS CON DISCAPACIDAD <br> “EUSTAQUIO MOTO MÉNDEZ”
          </div>
          <div style="padding: 30px 10px 0; text-align: center;">
            <span style="color: #6E6E6E; font-weight: 700;"> Registro  de Incidente </span>
          </div>
          <div style="margin: 10px; padding: 5px 15px 10px;">
            <p>SOLICITANTE: {{nombre}}
            <br>CORREO: {{correo}}
            <br>MUNICIPIO: {{municipio}}</p>
            <p>INCIDENTE: {{incidente}}</p>
            <p>DESCRIPCION: {{descripcion}}</p>
          </div>
        </div>
      </body>
      
      </html>`,
      tipo: 'EMAIL',
      estado: 'ACTIVO',
      _usuario_creacion: 1,
      _fecha_creacion: new Date(),
      _fecha_modificacion: new Date(),
    } ], {});
  },

  down() {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  },
};