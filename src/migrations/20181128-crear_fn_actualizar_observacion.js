'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `
      CREATE OR REPLACE FUNCTION public.fn_actualizar_observacion(
        _idusuario integer,
        _gestion integer)
      RETURNS text AS
    $BODY$           
                  DECLARE pmes RECORD;
                  DECLARE ppcd RECORD;
                  BEGIN
                    -- Obtener los meses generados a la fecha
                    FOR pmes IN (select id_mes, mes from mes where fid_gestion = _gestion)
                    LOOP
                      RAISE NOTICE 'MES------------------------> %', pmes.id_mes;
                      -- obtenemos los observados  mensuales por mes
                      FOR ppcd IN (select cmo.id_corte_mensual_observados, pd.id_pcd, p.fecha_nacimiento, pd.cod_municipio, cmo.id_corte_mensual_observados, cmo.observacion
                        from corte_mensual_observados as cmo
                        inner join pcd as pd on (cmo.fid_pcd = pd.id_pcd)
                        inner join persona as p on (pd.fid_persona = p.id_persona)
                        where cmo.fid_gestion = _gestion and cmo.fid_mes = pmes.id_mes and cmo.estado = 'GENERADO' 
                        and cmo.observacion <> 'Esta registrado en el IBC.')
                      LOOP
                        -- Actualizar observación de los pcds que hayan cumplido 60 años hasta el final del mes
                        IF EXTRACT(YEAR FROM age(date_trunc('month', make_date(_gestion, pmes.mes, 1)) +'1month' ::interval -'1sec' ::interval, ppcd.fecha_nacimiento)) >= 60 then
              UPDATE corte_mensual_observados SET observacion = 'Cumplio 60 años' WHERE id_corte_mensual_observados = ppcd.id_corte_mensual_observados and observacion <> 'Cumplio 60 años';
            -- Para actualizar cuando existe inserción laboral
                        ELSIF EXISTS (SELECT pbm.fid_pcd from pcd_beneficio_mes AS pbm INNER JOIN beneficio AS b ON (pbm.fid_beneficio = b.id_beneficio) 
                          WHERE b.restriccion = true and pbm.fid_gestion = _gestion and pbm.mes = pmes.mes and pbm.estado = 'ACTIVO' and pbm.fid_pcd = ppcd.id_pcd) then
              UPDATE corte_mensual_observados SET observacion = 'Goza de un beneficio (OVT)' WHERE id_corte_mensual_observados = ppcd.id_corte_mensual_observados and observacion <> 'Goza de un beneficio (OVT)';
                        ELSE
                        -- No es necesario ajustar nada
                        END IF;
                      END LOOP;
                    END LOOP;
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
