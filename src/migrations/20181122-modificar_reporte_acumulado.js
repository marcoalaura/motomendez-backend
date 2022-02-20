'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `ALTER TABLE public.reporte_acumulado ALTER COLUMN ruta_documento TYPE varchar(1000) USING ruta_documento::varchar;
       ALTER TABLE public.reporte_acumulado ALTER COLUMN observacion TYPE varchar(1000) USING observacion::varchar;`
    );
    migration.sequelize.query(sql)
      .finally(done);
  },

  down: (migration, DataTypes, done) => {
    migration.sequelize.query('')
      .finally(done);
  }
};
