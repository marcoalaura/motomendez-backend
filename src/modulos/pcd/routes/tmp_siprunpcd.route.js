import validate from 'express-validation';
import tutorValidation from './tutor.validation';

module.exports = (app) => {
  app.api.get('/centralizador/siprun/corte', app.controller.tmp_siprunpcd.buscarTmpSiprunPcd);
};
