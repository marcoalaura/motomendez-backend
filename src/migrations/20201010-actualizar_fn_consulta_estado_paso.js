  'use strict';

  module.exports = {
    up: (migration, DataTypes, done) => {
      const sql = (
        `
      CREATE OR REPLACE FUNCTION public.fn_consulta_estado_paso(
          _paso character varying,
          _tipo character varying,
          _gestion integer,
          _mes integer)
        RETURNS text AS
      $BODY$
                       DECLARE control integer;
                            
                             BEGIN
                       IF _tipo = 'ANUAL' THEN
                         IF _paso = 'sigep_datos_adicionales' THEN
                        SELECT count(*) INTO control FROM log_servicio_sigep WHERE estado = 'REGISTRADO_SIGEP';
                 
                        IF (control > 0) then
                          return 'false';
                        ELSE
                          return 'true';
                        END IF;
                      
                       ELSE
                        return 'true';    -- Cualquier otro paso no verifica y devuelve por defecto true
                         END IF;
                       ELSEIF _tipo = 'MENSUAL' THEN
                         IF _paso = 'contrastar_tmp_pcd' THEN
                        SELECT count(*) INTO control FROM tmp_pcd WHERE gestion_carga = _gestion AND mes_carga = _mes AND estado_contrastacion = 'PENDIENTE';
                 
                        IF (control > 0) then
                          return 'false';
                        ELSE
                          return 'true';
                        END IF;
                         ELSEIF _paso = 'sigep_registro_sin_cod_benef' THEN
                        SELECT count(*) INTO control FROM log_servicio_sigep WHERE estado = 'CREADO' and cod_beneficiario is null;
                 
                        IF (control > 0) then
                          return 'false';
                        ELSE
                          return 'true';
                        END IF;
                         ELSEIF _paso = 'sigep_registro_con_cod_benef' THEN
                        SELECT count(*) INTO control FROM log_servicio_sigep WHERE estado = 'CREADO' and cod_beneficiario is not null;
                 
                        IF (control > 0) then
                          return 'false';
                        ELSE
                          return 'true';
                        END IF;
                         ELSEIF _paso = 'sigep_datos_adicionales' THEN
                        SELECT count(*) INTO control FROM log_servicio_sigep WHERE estado = 'REGISTRADO_SIGEP';
                 
                        IF (control > 0) then
                          return 'false';
                        ELSE
                          return 'true';
                        END IF;
                         ELSEIF _paso = 'bono_regularizados' THEN
                        SELECT count(*) INTO control FROM corte_mensual as cm
                        INNER JOIN log_servicio_sigep as ls ON (cm.fid_pcd = ls.fid_pcd)
                        WHERE cm.estado = 'GENERADO' AND ls.estado = 'ACTUALIZADO_SIGEP' AND cm.fid_gestion = _gestion;
                 
                        IF (control > 0) then
                          return 'false';
                        ELSE
                          return 'true';
                        END IF;
                         ELSEIF _paso = 'bono_corte_mensual' THEN
                        SELECT count(*) INTO control FROM corte_mensual as cm
                        INNER JOIN mes as m ON (m.id_mes = cm.fid_mes)
                        INNER JOIN log_servicio_sigep as ls ON (cm.fid_pcd = ls.fid_pcd)
                        WHERE cm.estado = 'GENERADO' AND ls.estado = 'ACTUALIZADO_SIGEP' AND cm.fid_gestion = _gestion AND m.mes = _mes;
                 
                        IF (control > 0) then
                          return 'false';
                        ELSE
                          return 'true';
                        END IF;
                         ELSE
                        return 'true';    -- Cualquier otro paso no verifica y devuelve por defecto true
                        END IF;
                       END IF;
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
