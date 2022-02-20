  'use strict';

  module.exports = {
    up: (migration, DataTypes, done) => {
      const sql = (
        `
      CREATE OR REPLACE FUNCTION public.fn_reporte(
          IN _idusuario integer,
          IN _gestion integer,
          IN _cod_municipio character varying)
        RETURNS TABLE(c_i character varying, complemento_documento character varying, fecha_nacimiento character varying, nombres character varying, primer_apellido character varying, segundo_apellido character varying, casada_apellido character varying, formato_inf character varying, estado_civil character varying, nombre_completo character varying, telefono character varying, meses jsonb) AS
      $BODY$
                DECLARE 
                  pmes RECORD;
                    ppcd RECORD;
                  pjson varchar;
                BEGIN	     
                      FOR ppcd IN (
                      select p.documento_identidad, p.complemento_documento, p.fecha_nacimiento, p.nombres, p.primer_apellido, p.segundo_apellido, p.casada_apellido, p.formato_inf, p.estado_civil, p.nombre_completo, p.telefono, pd.id_pcd
                    from pcd as pd
                    inner join persona as p on (pd.fid_persona = p.id_persona)
                    inner join corte_mensual as cm on (pd.id_pcd = cm.fid_pcd)
                    where pd.cod_municipio = _cod_municipio and cm.estado = 'REGISTRADO_SIGEP' and cm.fid_gestion = _gestion
                    group by p.documento_identidad, p.complemento_documento, p.fecha_nacimiento, p.nombres, p.primer_apellido, p.segundo_apellido, p.casada_apellido, p.formato_inf, p.estado_civil, p.nombre_completo, p.telefono, pd.id_pcd
                    order by p.primer_apellido, p.segundo_apellido, p.nombres
                    ) LOOP
                      c_i := ppcd.documento_identidad;
                    complemento_documento := ppcd.complemento_documento;
                    fecha_nacimiento := ppcd.fecha_nacimiento;
                    nombres := ppcd.nombres;
                    primer_apellido := ppcd.primer_apellido;
                    segundo_apellido := ppcd.segundo_apellido;
                    casada_apellido := ppcd.casada_apellido;
                    formato_inf := ppcd.formato_inf;
                    estado_civil := ppcd.estado_civil;
                    nombre_completo := ppcd.nombre_completo;
                    telefono := ppcd.telefono;
                    pjson := '{';
                      FOR pmes IN (select m.id_mes, m.mes from corte_mensual as cm inner join mes as m on (cm.fid_mes = m.id_mes) 
                           where cm.cod_municipio = _cod_municipio and cm.fid_pcd = ppcd.id_pcd and cm.fid_gestion = _gestion and cm.estado = 'REGISTRADO_SIGEP') LOOP
                      if pjson <> '{' then
                        pjson := pjson || ',';
                      end if;
                      pjson := pjson || '"mes_'||pmes.mes||'": true';
                      -- Comentamos el control que hacia antes con la funcion porcentaje
            --           if (select fn_porcentaje (ppcd.id_pcd, _gestion, pmes.mes) >= 50) then
            --             pjson := pjson || '"mes_'||pmes.mes||'": true';
            --           else
            --             pjson := pjson || '"mes_'||pmes.mes||'": false';
            --           end if;
                      END LOOP;	  	
                    meses := pjson || '}';
                        return next;
                      END LOOP;
                    return;
                END;
                $BODY$
        LANGUAGE plpgsql VOLATILE
        COST 100
        ROWS 1000;
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
