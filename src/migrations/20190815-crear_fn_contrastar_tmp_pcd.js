'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `
    CREATE OR REPLACE FUNCTION public.fn_contrastar_tmp_pcd(
        _idusuario integer)
      RETURNS text AS
    $BODY$
               DECLARE pmes integer;
               DECLARE ppcd RECORD;
               
               BEGIN	   
             -- Comprobar lista de habilitados
                   IF NOT EXISTS (SELECT id from tmp_pcd LIMIT 1) THEN
                      raise exception 'No se ha podido realizar el proceso de contrastacion, debido a que no existe información.';
                   END IF;
        
                   -- Observar a los casos donde no tienen registrado el CI
                   UPDATE tmp_pcd SET estado_contrastacion = 'OBSERVADO', observacion_contrastacion = 'SIN CI' WHERE (documento_identidad = '' OR documento_identidad IS NULL OR documento_identidad = 'NULL') and estado_contrastacion = 'PENDIENTE';
        
                   -- Habilitar a los usuarios que se encuentran en la Plataforma (Personas)
                   UPDATE tmp_pcd SET estado_contrastacion = 'HABILITADO' 
                   WHERE id IN (
        SELECT tp.id FROM persona p 
        INNER JOIN tmp_pcd tp ON p.documento_identidad = tp.documento_identidad AND p.fecha_nacimiento = tp.fecha_nacimiento 
        AND NOT(tp.documento_identidad = '' OR tp.documento_identidad IS NULL OR tp.documento_identidad = 'NULL') and tp.estado_contrastacion = 'PENDIENTE'
                   );
        
              return 'Ok';
               EXCEPTION WHEN OTHERS THEN
                   return SQLERRM;
               END;
               $BODY$
      LANGUAGE plpgsql VOLATILE
      COST 100;
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
