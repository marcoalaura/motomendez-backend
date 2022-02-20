import logger from './../../lib/logger'
module.exports = (app) => {
  const _app = app;
  _app.dao.common = {};

  const sequelize = app.src.db.sequelize;

  /**
   * crearTransaccion - pasar la transaccion a todos los querys dentro de la function f
   * @param {function} f funcion donde se realizan todas las transacciones
   */
  const crearTransaccion = async (f) => {
    logger.info('[common][crearTransaccion]', 'creando transacción');
    try {
      const datosTransaccion = await sequelize.transaction(f);
      logger.info('[common][crearTransaccion]', 'transacción finalizada');
      return {
        finalizado: true,
        mensaje: 'Creación/Actualizacion de registros exitoso.',
        datos: datosTransaccion,
      };
    } catch (error) {
      logger.error('[common][crearTransaccion] %s', 'error en transacción ->', error.message);
      return {
        finalizado: false,
        mensaje: error.message,
        datos: {},
      };
    }
  };
  _app.dao.common.crearTransaccion = crearTransaccion;
};
