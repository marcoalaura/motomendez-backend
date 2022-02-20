  'use strict';

  module.exports = {
    up: (migration, DataTypes, done) => {
      const sql = (
        `
      CREATE OR REPLACE FUNCTION public.fn_filtrar_corte_anual(
          _idusuario integer,
          _gestion integer)
        RETURNS text AS
      $BODY$
                     DECLARE pmes integer;
                     DECLARE resultado VARCHAR(100);
                     DECLARE _gestion_carga integer;
                     
                     BEGIN
                       -- Comprobar si ya se realizo la carga inicial
                       IF NOT EXISTS (SELECT id FROM tmp_corte_anual WHERE tipo = 'SIPRUN' AND gestion = _gestion LIMIT 1) THEN
            raise exception 'No se ha realizado la carga de información en la tabla temporal del corte anual.';
                       END IF;
            
           -- Se toma el mes de Julio para realizar el corte anual
           pmes := 7;
           _gestion_carga :=  _gestion - 1;
                    
                       IF date_part('month', now()) < 7 THEN
            raise exception 'El proceso de carga de información debe realizarse en el mes de JULIO para adelante.';
                       END IF;
                       
           -- PROCESO DE FILTRADO DE LA INFORMACIÓN
                       -- Deshabilita persona con grado de discapacidad < 50		
           UPDATE tmp_corte_anual SET estado = 'PENDIENTE', observacion = 'GRADO DE DISCAPACIDAD < 50'
            WHERE CAST(porcentaje AS integer) < 50 AND tipo = 'SIPRUN' AND gestion = _gestion;
       
            -- Deshabilita persona que cumplieron mas de 60 años
            UPDATE tmp_corte_anual SET estado = 'PENDIENTE', observacion = 'MAYOR DE 60 AÑOS'
            WHERE EXTRACT(YEAR FROM age(date_trunc('month', make_date(_gestion_carga, 12, 31)) + '1month'::interval - '1sec'::interval, TO_DATE(fecha_nacimiento, 'dd/mm/yyyy'))) >= 60 
            AND tipo = 'SIPRUN' AND gestion = _gestion;
       
            UPDATE tmp_corte_anual SET estado = 'PENDIENTE', observacion = 'PERTENECE A LAS LISTA DEL IBC' 
                   WHERE id IN (
              SELECT tca.id FROM tmp_corte_anual tca 
              INNER JOIN tmp_corte_anual tca2 ON tca.nro_documento = tca2.nro_documento AND tca.fecha_nacimiento = tca2.fecha_nacimiento 
              AND NOT(tca2.nro_documento = '' OR tca2.nro_documento = 'NULL' OR tca2.nro_documento IS NULL)
            AND NOT(tca2.fecha_nacimiento = '' OR tca2.fecha_nacimiento = 'NULL' OR tca2.fecha_nacimiento IS NULL) 
              AND tca2.tipo = 'IBC' AND tca2.gestion = _gestion
              WHERE tca.tipo = 'SIPRUN' AND NOT(tca.nro_documento = '' OR tca.nro_documento = 'NULL' OR tca.nro_documento IS NULL)
            AND NOT(tca.fecha_nacimiento = '' OR tca.fecha_nacimiento = 'NULL' OR tca.fecha_nacimiento IS NULL) AND tca.gestion = _gestion
                   );
       
                   UPDATE tmp_corte_anual SET estado = 'PENDIENTE', observacion = 'SE ENCUENTRA EN PLANILLAS DE SUELDOS OVT' 
             WHERE id IN (
              SELECT tca.id FROM tmp_corte_anual tca 
              INNER JOIN tmp_corte_anual tca2 ON tca.nro_documento = tca2.nro_documento AND tca.fecha_nacimiento = tca2.fecha_nacimiento 
              AND NOT(tca2.nro_documento = '' OR tca2.nro_documento = 'NULL' OR tca2.nro_documento IS NULL)
            AND NOT(tca2.fecha_nacimiento = '' OR tca2.fecha_nacimiento = 'NULL' OR tca2.fecha_nacimiento IS NULL) 
              AND tca2.tipo = 'OVT' AND tca2.gestion = _gestion
              WHERE tca.tipo = 'SIPRUN' AND NOT(tca.nro_documento = '' OR tca.nro_documento = 'NULL' OR tca.nro_documento IS NULL)
            AND NOT(tca.fecha_nacimiento = '' OR tca.fecha_nacimiento = 'NULL' OR tca.fecha_nacimiento IS NULL) AND tca.gestion = _gestion
                       );
      
                       -- Iniciamos a todos con estado pendiente si no fue contrastado
           UPDATE tmp_corte_anual SET estado_contrastacion = 'PENDIENTE' WHERE gestion = _gestion and estado_contrastacion is null;
           -- Actualiza aquellos casos que estan repetidos, ponderando la fecha de vigencia del registro
          update tmp_corte_anual set estado = 'PENDIENTE', observacion = 'DUPLICADO' where id in (
            select min(id)from
            (select ca.id, ca.nro_documento, ca.complemento from tmp_corte_anual ca 
            inner join 
            (
            select min(fecha_vigencia) fecha_vigencia, nro_documento, complemento from tmp_corte_anual where gestion = _gestion and tipo = 'SIPRUN' group by nro_documento, complemento having count(*) > 1
            ) cav on ca.fecha_vigencia = cav.fecha_vigencia and ca.nro_documento = cav.nro_documento and ca.gestion = _gestion and ca.tipo = 'SIPRUN' order by nro_documento) rep 
            group by nro_documento, complemento
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
    }
  };
