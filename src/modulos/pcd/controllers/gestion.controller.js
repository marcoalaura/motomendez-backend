module.exports = (app) => {
  const _app = app;

  const listarGestion = async (req, res) => {
    try {
      const gestion = await app.dao.gestion.listarGestion();
      if (gestion) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de dato exitoso.',
          datos: gestion,
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron registros para la solicitud.',
          datos: {},
        });
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const listarAnioMes = async (req, res) => {
    try {
      let gestion = [];
      if (req.query.gestion) {
        gestion = await app.dao.gestion.listarMes(req.query.gestion);
      } else {
        gestion = await app.dao.gestion.listarAnio();
      }
      if (gestion.length > 0) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de dato exitoso.',
          datos: gestion,
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron registros para la solicitud.',
          datos: {},
        });
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const listarAnioMesRegularizado = async (req, res) => {
    try {
      let gestion = [];
      if (req.query.gestion) {
        gestion = await app.dao.gestion.listarMesRegularizado(req.query.gestion);
      } else {
        res.status(412).json({
          finalizado: false,
          mensaje: 'No ha seleecionado una gestión',
          datos: {},
        });
      }
      if (gestion.length > 0) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de dato exitoso.',
          datos: gestion,
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron registros para la solicitud.',
          datos: {},
        });
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const listarAnioMesAcumulado = async (req, res) => {
    try {
      let gestion = [];
      if (req.query.gestion) {
        gestion = await app.dao.gestion.listarMesAcumulado(req.query.gestion);
      } else {
        res.status(412).json({
          finalizado: false,
          mensaje: 'No ha selecionado una gestión',
          datos: {},
        });
      }
      if (gestion.length > 0) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de dato exitoso.',
          datos: gestion,
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron registros para la solicitud.',
          datos: {},
        });
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const obtenerDetalleGestion = async (req, res) => {
    try {
      const idGestion = req.params.id_gestion;
      const idRol = req.body.audit_usuario.id_rol;
      let gestion;
      if (idRol === 2 || idRol === 4) { // rol ministerio
        if (req.query.id_mes) {
          const query = { fid_mes: req.query.id_mes };
          gestion = await app.dao.reporte.listaReporteMensual(idGestion, query, req.query);
        } else {
          throw new Error('El parámetro id_mes es requerido.');
        }
      } else if (idRol === 3) { // rol municipio
        const usuario = await app.dao.autenticacion.buscarUsuario({ id_usuario: req.body.audit_usuario.id_usuario });
        if (usuario && usuario.cod_municipio) {
          // const query = { fid_municipio: usuario.cod_municipio };
          // gestion = await app.dao.reporte.listaReporteMensual(idGestion, query, req.query);
          const mesVigente = await app.dao.gestion.obtenerReporteVigente(idGestion);
          if (mesVigente && mesVigente.length > 0) {
            const query = {
              fid_municipio: usuario.cod_municipio,
              fid_mes: mesVigente[0].id_mes,
            };
            gestion = await app.dao.reporte.listaReporteMensual(idGestion, query, req.query);
          } else {
            throw new Error(`No existe reporte generado para la gestión ${idGestion}.`);
          }
        } else {
          throw new Error('El usuario no esta asociado a un municipio.');
        }
      } else {
        throw new Error('El usuario no tiene acceso.');
      }
      if (gestion.count > 0) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de dato exitoso.',
          datos: {
            count: gestion.count,
            rows: gestion.rows,
          },
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron registros para la solicitud.',
          datos: {},
        });
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const obtenerDetalleRegularizadoGestion = async (req, res) => {
    try {
      const idGestion = req.params.id_gestion;
      const idRol = req.body.audit_usuario.id_rol;
      let gestion;
      if (idRol === 2 || idRol === 4) { // rol ministerio
        if (req.query.mes) {
          const query = { mes: req.query.mes };
          gestion = await app.dao.reporte.listaReporteMensualRegularizado(idGestion, query, req.query);
        } else {
          throw new Error('El parámetro mes es requerido.');
        }
      } else if (idRol === 3) { // rol municipio
        const usuario = await app.dao.autenticacion.buscarUsuario({ id_usuario: req.body.audit_usuario.id_usuario });
        if (usuario && usuario.cod_municipio) {
          const query = { cod_municipio: usuario.cod_municipio };
          gestion = await app.dao.reporte.listaReporteMensualRegularizado(idGestion, query, req.query);
        } else {
          throw new Error('El usuario no esta asociado a un municipio.');
        }
      } else {
        throw new Error('El usuario no tiene acceso.');
      }
      if (gestion.count > 0) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de dato exitoso.',
          datos: {
            count: gestion.count,
            rows: gestion.rows,
          },
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron registros para la solicitud.',
          datos: {},
        });
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  const obtenerDetalleAcumulado = async (req, res) => {
    try {
      const idGestion = req.params.id_gestion;
      const idRol = req.body.audit_usuario.id_rol;
      let gestion;
      if (idRol === 2 || idRol === 4) { // rol ministerio
        if (req.query.mes) {
          const query = {
            mes: req.query.mes,
          };
          gestion = await app.dao.reporte.listaReporteMensualAcumulado(idGestion, query, req.query);
        } else {
          throw new Error('El parámetro id_mes es requerido.');
        }
      } else if (idRol === 3) { // rol municipio
        const usuario = await app.dao.autenticacion.buscarUsuario({
          id_usuario: req.body.audit_usuario.id_usuario
        });
        if (usuario && usuario.cod_municipio) {
          const mesVigente = await app.dao.gestion.obtenerAcumuladoVigente(idGestion);
          if (mesVigente && mesVigente.length > 0) {
            const query = {
              cod_municipio: usuario.cod_municipio,
              mes: mesVigente[0].mes,
            };
            gestion = await app.dao.reporte.listaReporteMensualAcumulado(idGestion, query, req.query);
          } else {
            gestion = [];
          }
        } else {
          throw new Error('El usuario no esta asociado a un municipio.');
        }
      } else {
        throw new Error('El usuario no tiene acceso.');
      }
      if (gestion.count > 0) {
        res.status(200).json({
          finalizado: true,
          mensaje: 'Obtencion de dato exitoso.',
          datos: {
            count: gestion.count,
            rows: gestion.rows,
          },
        });
      } else {
        res.status(204).json({
          finalizado: true,
          mensaje: 'No se encontraron registros para la solicitud.',
          datos: {},
        });
      }
    } catch (error) {
      res.status(412).json({
        finalizado: false,
        mensaje: error.message,
        datos: {},
      });
    }
  };

  _app.controller.gestion = {
    listarGestion,
    listarAnioMes,
    obtenerDetalleGestion,
    obtenerDetalleRegularizadoGestion,
    listarAnioMesRegularizado,
    obtenerDetalleAcumulado,
    listarAnioMesAcumulado,
  };
};
