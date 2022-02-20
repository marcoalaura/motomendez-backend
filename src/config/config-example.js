import params from './config.json';
import logger from '../lib/logger';

module.exports = () => {
  let env = process.env.NODE_ENV;

  if (!env) {
    env = 'development';
  }

  if (!params.hasOwnProperty(env)) {
    env = 'development';
  }

  const config = {
    urlSistema: 'http://localhost:8888',
    urlConfirmarCuenta: 'http://localhost:8888/#!/confirmar_cuenta/',
    urlLogoMinisterio: 'http://localhost:8888/assets/logo-mteps.png',
    correoSoporte: 'mavendano@agetic.gob.bo',
    database: {
      name: params[env].database,
      username: params[env].username,
      password: params[env].password,
      timezone: '-04:00',
      lang: 'es',
      params: {
        dialect: params[env].dialect,
        port: params[env].port,
        host: params[env].host,
        sync: { force: process.env.FORCE || false,
        },
        logging: (sql) => {
          if (env === 'development') {
            logger.log('info', `[${new Date()}] ${sql}`);
          }
        },
        define: {
          underscored: true,
        },
      },
    },
    api: {
      main: '/api/v1/',
      crud: 'rest/',
    },
    segip: {
      url: 'https://test.agetic.gob.bo/kong/fake2',
      path: '/segip/v2/',
      credenciales: {
        apikey: '383a0f19857f4dde885271725bdc1f20',
      },
      tokenKong: 'Bearer <-- solicitar el token a interoperabilidad -->',
    },
    siprunpcd: {
      url: 'http://192.168.21.61:5000',
      path: '/api/v2/pcd2/',
      pcd: '/api/v2/',
      token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IntcImZlY2hhXCI6XCIyMDE4LTExLTE2VDIxOjUwOjI0LjQyM1pcIixcImRpblwiOjB9Ig.msd-robFcWD7rVuIsrwf4ANQvzzVrDsywbRMGI6HWVI',
    },
    ibc: {
      url: 'http://localhost:9000',
      path: '/api/v1/',
      token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IntcImZlY2hhXCI6XCIyMDE4LTEyLTA0VDIxOjU2OjU0LjQ2OFpcIixcImRpblwiOjB9Ig.fRjx0gr6eUgBZJMxHewb1IzCTW9oiNfSe7FzcYxe-1s',
    },
    ovtParche: {
      url: 'http://localhost:5000',
      path: '/api/v1/empleado/reporte/',
      token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF91c3VhcmlvIjoxLCJ1c3VhcmlvIjoiYWRtaW4iLCJpZF9wZXJzb25hIjpudWxsLCJpZF9yb2wiOjEsIm5pdCI6bnVsbCwic2VjcmV0IjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5Sm1aV05vWVNJNklqSXdNVGN0TVRFdE1qTlVNak02TXprNk5Ua3RNRFE2TURBaUxDSmpiR0YyWlNJNklubzJOWEI2WVc5eUluMC5zQzhvXzc5Q2FzZ0xwNGpYRDVuM1NKT2MwRFBWbWtKeXhFMTNLVF9LbXhzIiwiY2xhdmUiOiI2aHM4eGd2aSJ9.wOzeVqIRDXvV_C4ZzkGJfz15ZnRakBcNSANc-Sng-7c',
    },
    sigep: {
      url: 'https://interoperabilidad.agetic.gob.bo',
      path: '/fake/mefp/v1/',
      token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjcHVzMTNvbEpOMkgyUkNaRU9IQjFyMkowdzFjV0hhaiIsInVzZXIiOiJwcnVlYmFzLWJvbm9zLXNlcnZpY2lvLW1lZnAtR0VORVJBRE8tTUFOVUFMIiwiZXhwIjoxNjEwMTk3MjYwfQ.-ExKVBT77z8SipU_Lb1b1kw4l-bZwgl5Uxe6wTyuKk0',
    },
    correo: {
      origen: 'centralizadorpcd@agetic.gob.bo',
      host: 'localhost',
      port: 25,
      tls: {
        rejectUnauthorized: false,
      },
    },
    archivos: {
      ruta_tutores: _path
    },
     // configuracion con jwt poner una palabra secreta segura
    jwtSecret: 'AGETIC-2017',
    jwtSession: { session: false },
    puerto: 4000,
    // configuracion ajustes SIGEP
    origen: 'AGEPCD',
  };

  return config;
};
