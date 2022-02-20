// 'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('plantilla', [{
      nombre: 'RESTAURAR_CONTRASENA',
      remitente: 'PLATAFORMA PLURINACIONAL DE INFORMACIÓN DE PERSONAS CON DISCAPACIDAD',
      origen: 'centralizadorpcd@agetic.gob.bo',
      asunto: 'Restaurar Contraseña - PLATAFORMA PLURINACIONAL DE INFORMACIÓN DE PERSONAS CON DISCAPACIDAD',
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
            <p>Hola {{nombre}}.</p>
            <p>Ha solicitado restablecer su contraseña. Por favor copie el siguiente código:</p>
            <div style="padding: 30px 10px 0; text-align: center;">
              <span style="color: #0090d9; font-weight: 700;">{{codigo}} </span>
            </div>
            <p>Si usted no ha solicitado un cambio de contraseña, por favor ignore este mensaje y disculpe las molestias.</p>
            <br>
            <div style="text-align:center;">
              <p>Recuerde que estos datos son confidenciales.</p>
            </div>
            <div>
              <p style="margin: 0;">Saludos cordiales,</p>
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
    ], {});
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
