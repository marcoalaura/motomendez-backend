'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {

    const sql = (
      `CREATE OR REPLACE FUNCTION fn_corte_anual(_idUsuario integer, _gestion integer)
      RETURNS text AS
     $BODY$
     DECLARE pgestion integer;
     
     BEGIN
         -- SELECT date_part('year', now()) as year INTO pgestion;
         --RAISE NOTICE 'gestion: %', pgestion;
         
         IF EXISTS (select id_gestion from gestion WHERE id_gestion = _gestion)  THEN
            raise exception 'Ya existe el corte anual para la gestión.';
         END IF;
     
         INSERT INTO gestion (id_gestion, _usuario_creacion, _fecha_creacion, _fecha_modificacion) VALUES(_gestion, _idUsuario, now(), now());
     
         INSERT INTO corte_anual (cod_municipio, _usuario_creacion, _fecha_creacion, _fecha_modificacion, fid_gestion, fid_pcd, fid_persona)
         -- SELECT cod_municipio, _idUsuario, now(), now(), 2017, id_pcd FROM pcd;
         select distinct pd.cod_municipio, _idUsuario, now(), now(), _gestion, pd.id_pcd, p.id_persona
         from pcd as pd
         inner join certificado as ct on (pd.id_pcd = ct.fid_pcd)
         inner join persona as p on (pd.fid_persona = p.id_persona)
         and ct.grado_discapacidad in ('GRAVE', 'MUY GRAVE');
         
       
        return 'Ok';
     EXCEPTION WHEN OTHERS THEN
        return SQLERRM;
     END;
     $BODY$
      LANGUAGE plpgsql VOLATILE
      COST 100;`
   );
    migration.sequelize.query(sql)
      .finally(done);
  },

  down: (migration, DataTypes, done) => {
    migration.sequelize.query('')
      .finally(done);
  },
};
