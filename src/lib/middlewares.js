/* eslint prefer-rest-params: 0 */
/* eslint func-names: 0 */
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import jwt from 'jwt-simple';
import helmet from 'helmet';
import sequelizeCrud from './sequelize-crud';
import i18n from './i18n';

module.exports = (app) => {
  // Constante que almacena la congifuracion.
  const configuracion = app.src.config.config;
  // Establece el puerto
  app.set('port', configuracion.puerto);

  // Establece la llave secreta
  app.set('secretAGETIC', configuracion.jwtSecret);
  app.use(helmet());

  // //Showtests
  app.use((req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' &&
      req.query.test === '1';
    next();
  });

  // Realiza el uso y configuracion de cors.
  app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    headers: 'Cache-Control, Pragma, Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    // 'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    // 'Expires': '-1',
    // 'Pragma': 'no-cache',
  }));

  // Realiza el uso de 'bodyParser' para la recepcion de Json como body.
  app.use(bodyParser.json());

  // Realiza el uso de la autenticacion de passport.
  app.use(app.src.auth.initialize());

  // //eliminar ids en caso de que lo envien por si quieren hacer sqlinjection
  // app.use((req, res, next) => {
  //     delete req.body.id;
  //     next();
  // });
  // para generar un espacio publico, archivos estaticos
  app.use(express.static('public'));

  // app.use(express.static(__dirname + '/public'));
  // // verifica si hay errores en el formato json
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
      res.status(400).json({
        mensaje: 'Problemas en el formato JSON',
      });
    } else {
      res.status(500).send('Error interno!');
      console.error(err.stack);
    }
  });


  // Autenticación -- JWTOKEN
  app.use(configuracion.api.main, (req, res, next) => {
    const RolRuta = app.src.db.models.rol_ruta;
    const Ruta = app.src.db.models.ruta;

    if (req.method !== 'OPTIONS') {
      if (req.headers.authorization) {
        // check header or url parameters or post parameters for token
        const token = req.headers.authorization.split(' ')[1];
        // decode token
        if (token) {
          // verifies secret and checks exp
          const tokenDecoded = jwt.decode(token, app.get('secretAGETIC'));
          if (tokenDecoded) {
            // Habilitar para que el token caduque
            // if ((new Date(tokenDecoded.vencimiento)).getTime() < (new Date()).getTime()) {
            //   return res.status(403).send({
            //     error_code: 'TOKEN_EXPIRED',
            //     finalizado: false,
            //     mensaje: 'El token de autenticación ha expirado. Debe iniciar sesión nuevamente.',
            //   });
            // }

            RolRuta.findAll({
                attributes: ['method_get', 'method_post', 'method_put', 'method_delete'],
                where: {
                  fid_rol: tokenDecoded.id_rol,
                  estado: 'ACTIVO',
                },
                include: [{
                  model: Ruta,
                  as: 'ruta',
                  attributes: ['ruta'],
                  where: {
                    estado: 'ACTIVO',
                  },
                }],
              }).then((roles_rutas_res) => {
                let rutaPermitida = false;
                for (let i = 0; i < roles_rutas_res.length; i += 1) {
                  const ruta = roles_rutas_res[i];
                  if (req.originalUrl === ruta.ruta.ruta ||
                    req.originalUrl.substring(0, req.originalUrl.length - 1) === ruta.ruta.ruta ||
                    req.originalUrl.indexOf(ruta.ruta.ruta) >= 0) {
                    if ((req.method === 'GET' && ruta.method_get) ||
                      (req.method === 'POST' && ruta.method_post) ||
                      (req.method === 'PUT' && ruta.method_put) ||
                      (req.method === 'DELETE' && ruta.method_delete)) {
                      rutaPermitida = true;
                      break;
                    }
                  }
                }
                if (rutaPermitida) {
                  // Insertando los datos para auditoria en el req.body
                  req.body.audit_usuario = {
                    id_usuario: tokenDecoded.id_usuario,
                    id_persona: tokenDecoded.id_persona,
                    id_rol: tokenDecoded.id_rol,
                    usuario: tokenDecoded.usuario,
                  };
                  next();
                } else {
                  return res.status(403).send({
                    finalizado: false,
                    mensaje: 'Usted no tiene acceso a dichos recursos.',
                    datos: {},
                  });
                }
              })
              .catch((error) => {
                res.status(403).send({
                  finalizado: false,
                  mensaje: 'Falló la autenticación del token.',
                  datos: {},
                });
              });
          } else {
            return res.status(403).send({
              finalizado: false,
              mensaje: 'Falló la autenticación del token.',
              datos: {},
            });
          }
        } else {
          return res.status(403).send({
            finalizado: false,
            mensaje: 'Falló la autenticación.',
            datos: {},
          });
        }
      } else {
        return res.status(403).send({
          finalizado: false,
          mensaje: 'Falló la autenticación.',
          datos: {},
        });
      }
    } else {
      next();
    }
  });
  // Autenticación -- JWTOKEN - FIN
  // Iniciando API automático de CRUD
  const router = express.Router();
  sequelizeCrud.init(router, app.src.db.models, configuracion.api.crud);

  // Definiendo Rutas principales
  app.use(configuracion.api.main, router);
  app.api = router;


  //Definiendo controller
  app.controller = {};
  //Definiendo dao
  app.dao = {};

  // Iniciando la librería de internacionalización
  let pathLang = __dirname.replace('lib', 'lang');
  // Definiendo el idioma español
  i18n.init(pathLang, 'es');


  //express-validation
  app.use((err, req, res, next) => {
    res.status(400).json(err);
  });
};
