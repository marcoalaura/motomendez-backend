  'use strict';

  module.exports = {
    up: (migration, DataTypes, done) => {
      const sql = (
        `
        CREATE OR REPLACE FUNCTION public.fn_corte_anual_especial(_idusuario integer, _gestion integer)
        RETURNS text
        LANGUAGE plpgsql
        AS $function$
        DECLARE pgestion integer;
        r RECORD;
        pestado VARCHAR(100);
        BEGIN
        
            update corte_anual c set cod_municipio = '0' || a.codigo_municipal, 
            _fecha_modificacion = now(), _usuario_modificacion = _idusuario
            from pcd p
            inner join persona s on (s.id_persona = p.fid_persona)
            left join tmp_corte_anual a on (a.nro_documento = s.documento_identidad and to_date(a.fecha_nacimiento, 'DD/MM/YYYY') = s.fecha_nacimiento and a.tipo = 'SIPRUN')
            where c.fid_gestion = _gestion and cast(c.cod_municipio as integer) <> cast(a.codigo_municipal as integer)
            and p.id_pcd = c.fid_pcd and p.estado = 'ACTIVO';
            
            FOR r IN (
              select pd.id_pcd, dpa.id_ubigeo, dpa.id_entidad, dpa.municipio localidad, p.expedido, p.casada_apellido, p.estado_civil, p.formato_inf, p.direccion, p.telefono,
              l.id_log_servicio_sigep, l.id_ubigeo as lid_ubigeo, l.id_entidad_pago as lid_entidad_pago, 
              l.exp_departamento, l.apellido_casada, l.estado_civil as lestado_civil, l.formato_inf as lformato_inf, l.direccion as ldireccion, l.telefono as ltelefono, l.estado
              from corte_anual as ca
              inner join pcd as pd on (ca.fid_pcd = pd.id_pcd)
              inner join persona as p on (pd.fid_persona = p.id_persona)
              inner join log_servicio_sigep as l on (l.fid_pcd = pd.id_pcd)
              inner join dpa as dpa on (ca.cod_municipio = dpa.cod_municipio)
              where ca.fid_gestion = _gestion
              ) LOOP
              
              if (r.id_ubigeo <> r.lid_ubigeo 
               or r.id_entidad <> r.lid_entidad_pago
               or r.expedido <> r.exp_departamento
               or r.casada_apellido <> r.apellido_casada
               or r.estado_civil <> r.lestado_civil
               or r.formato_inf <> r.lformato_inf) then
               
               if (r.estado = 'ACTUALIZADO_SIGEP' or r.estado = 'REGISTRADO_SIGEP') then pestado := 'REGISTRADO_SIGEP'; else pestado := 'CREADO'; end if;
                  
                  update log_servicio_sigep set 
                    id_ubigeo = r.id_ubigeo, 
                    id_entidad_pago = r.id_entidad,
                    localidad = r.localidad,
                    exp_departamento = r.expedido, 
                    apellido_casada = r.casada_apellido, 
                    estado_civil = r.estado_civil,
                    formato_inf = r.formato_inf,
                    _fecha_modificacion = now(),
                    _usuario_modificacion = _idusuario,
                    estado = pestado			      
            where id_log_servicio_sigep = r.id_log_servicio_sigep;
                  
              end if;
             
              END LOOP;
        
              -- Actualizamos el municipio en PCD
              update pcd p set cod_municipio = c.cod_municipio, _usuario_creacion = _idusuario, _fecha_creacion = now(), _fecha_modificacion = now()
              from corte_anual c
              where p.id_pcd = c.fid_pcd and c.fid_gestion = _gestion and p.cod_municipio <> c.cod_municipio;
                      
              return 'Ok';
             EXCEPTION WHEN OTHERS THEN
                return SQLERRM;
           END;
        $function$
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
