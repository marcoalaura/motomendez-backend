  'use strict';

  module.exports = {
    up: (migration, DataTypes, done) => {
      const sql = (
        `
CREATE OR REPLACE FUNCTION public.fn_corte_anual(_idusuario integer, _gestion integer)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE pgestion integer;
r RECORD;
pestado VARCHAR(100);
BEGIN
    
     -- SELECT date_part('year', now()) as year INTO pgestion;
     --RAISE NOTICE 'gestion: %', pgestion;
   
      IF EXISTS (select id_gestion from gestion WHERE id_gestion = _gestion)  THEN
        raise exception 'Ya existe el corte anual para la gestión.';
      END IF;
   
      INSERT INTO gestion (id_gestion, _usuario_creacion, _fecha_creacion, _fecha_modificacion) VALUES(_gestion, _idUsuario, now(), now());
   
      INSERT INTO corte_anual (cod_municipio, _usuario_creacion, _fecha_creacion, _fecha_modificacion, fid_gestion, fid_pcd, fid_persona)
     -- SELECT cod_municipio, _idUsuario, now(), now(), 2017, id_pcd FROM pcd;
     -- select distinct pd.cod_municipio, _idUsuario, now(), now(), _gestion, pd.id_pcd, p.id_persona
     -- from pcd as pd
     -- inner join certificado as ct on (pd.id_pcd = ct.fid_pcd)
     -- inner join persona as p on (pd.fid_persona = p.id_persona)
     -- and ct.grado_discapacidad in ('GRAVE', 'MUY GRAVE');
     -- select distinct pd.cod_municipio, _idUsuario, now(), now(), _gestion, pd.id_pcd, p.id_persona
     -- from pcd as pd
     -- inner join persona as p on (pd.fid_persona = p.id_persona)
     -- inner join tmp_siprunpcd as t on (p.documento_identidad = t.nro_documento and p.fecha_nacimiento = t.fecha_nacimiento::date)
     -- where t.gestion = _gestion and t.observacion_contrastacion = 'DATOS CORRECTOS';
	select distinct (case when ta.codigo_municipal <> a.cod_municipio then '0' || ta.codigo_municipal else a.cod_municipio end) as cod_municipio, _idUsuario, now(), now(), _gestion, p.id_pcd, s.id_persona
	from corte_anual a 
	inner join pcd p on (p.id_pcd = a.fid_pcd and p.estado = 'ACTIVO')
	inner join persona s on (s.id_persona = p.fid_persona)
	left join tmp_corte_anual ta on (ta.nro_documento = s.documento_identidad and to_date(ta.fecha_nacimiento, 'DD/MM/YYYY') = s.fecha_nacimiento and ta.tipo = 'SIPRUN' and ta.gestion = _gestion)
	where a.fid_gestion = _gestion - 1;
      
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
      
      -- Se incorpora los certificados del IBC, para la nueva gestión
      insert into certificado (numero_registro, fecha_emision, fecha_vigencia, tipo_discapacidad, grado_discapacidad, porcentaje_discapacidad, tipo_certificado, estado, _usuario_creacion, _usuario_modificacion, _fecha_creacion, _fecha_modificacion, fid_pcd)
      select 0, make_date(_gestion, 01, 01), make_date(_gestion, 12, 31), t.tipo_discapacidad, t.grado_discapacidad, t.porcentaje_discapacidad, 'IBC', 'ACTIVO', _idusuario, _idusuario, now(), now(), d.id_pcd fid_pcd
      from tmp_pcd t 
      inner join persona p on (p.documento_identidad = t.documento_identidad and p.fecha_nacimiento = t.fecha_nacimiento)
      inner join pcd d on (d.fid_persona = p.id_persona and d.estado = 'ACTIVO')
      where t.tipo = 'IBC' and t.estado_contrastacion = 'HABILITADO';
              
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
