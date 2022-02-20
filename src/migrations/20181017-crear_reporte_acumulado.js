'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {

    const sql = (
      `
      CREATE TABLE reporte_acumulado (
        id_reporte_acumulado serial NOT NULL,
        hash text NULL,
        ruta_documento varchar(255) NULL,
        observacion varchar(255) NULL,
        estado varchar(30) NOT NULL DEFAULT 'PENDIENTE'::character varying,
        mes int4 NOT NULL,
        fid_gestion int4 NOT NULL,
        cod_municipio varchar(6) NOT NULL,
        "_fecha_creacion" timestamptz NULL,
        "_fecha_modificacion" timestamptz NULL,
        UNIQUE (mes, fid_gestion, cod_municipio),
        PRIMARY KEY (id_reporte_acumulado),
        FOREIGN KEY (cod_municipio) REFERENCES dpa(cod_municipio),
        FOREIGN KEY (fid_gestion) REFERENCES gestion(id_gestion)
      );      
      `
   );
    migration.sequelize.query(sql)
      .finally(done);
  },

  down: (migration, DataTypes, done) => {
    migration.sequelize.query('')
      .finally(done);
  },
};
