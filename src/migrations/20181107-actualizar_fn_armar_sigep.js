'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {

    const sql = (
      `
﻿alter table tmp_siprunpcd add gestion int null;
update tmp_siprunpcd set gestion = 2018;

CREATE OR REPLACE FUNCTION fn_corte_anual(_idusuario integer, _gestion integer)
 RETURNS text
 LANGUAGE plpgsql
AS $BODY$
	DECLARE pgestion integer;
			r RECORD;
    BEGIN
     
	 	-- SELECT date_part('year', now()) as year INTO pgestion;
	 	--RAISE NOTICE 'gestion: %', pgestion;
	 
	 	IF EXISTS (select id_gestion from gestion WHERE id_gestion = _gestion)  THEN
	    	raise exception 'Ya existe el corte anual para la gestión.';
	    END IF;
	 
	    INSERT INTO gestion (id_gestion, _usuario_creacion, _fecha_creacion, _fecha_modificacion) VALUES(_gestion, _idUsuario, now(), now());
	 
	    INSERT INTO corte_anual (cod_municipio, _usuario_creacion, _fecha_creacion, _fecha_modificacion, fid_gestion, fid_pcd, fid_persona)
	    -- SELECT cod_municipio, _idUsuario, now(), now(), 2017, id_pcd FROM pcd;
	 	--select distinct pd.cod_municipio, _idUsuario, now(), now(), _gestion, pd.id_pcd, p.id_persona
	 	--from pcd as pd
	 	--inner join certificado as ct on (pd.id_pcd = ct.fid_pcd)
	 	--inner join persona as p on (pd.fid_persona = p.id_persona)
	 	--and ct.grado_discapacidad in ('GRAVE', 'MUY GRAVE');
	 	select distinct pd.cod_municipio, _idUsuario, now(), now(), _gestion, pd.id_pcd, p.id_persona
		from pcd as pd
		inner join persona as p on (pd.fid_persona = p.id_persona)
		inner join tmp_siprunpcd as t on (p.documento_identidad = t.nro_documento and p.fecha_nacimiento = t.fecha_nacimiento::date)
		where t.gestion = _gestion and t.observacion_contrastacion = 'DATOS CORRECTOS';
	     
	    
		FOR r IN (
		    select pd.id_pcd, dpa.id_ubigeo, dpa.id_entidad, p.expedido, p.casada_apellido, p.estado_civil, p.formato_inf, p.direccion, p.telefono,
			l.id_log_servicio_sigep, l.id_ubigeo as lid_ubigeo, l.id_entidad_pago as lid_entidad_pago, 
			l.exp_departamento, l.apellido_casada, l.estado_civil as lestado_civil, l.formato_inf as lformato_inf, l.direccion as ldireccion, l.telefono as ltelefono
			from corte_anual as ca
			inner join pcd as pd on (ca.fid_pcd = pd.id_pcd)
			inner join persona as p on (pd.fid_persona = p.id_persona)
			inner join log_servicio_sigep as l on (l.fid_pcd = pd.id_pcd)
			inner join dpa as dpa on (ca.cod_municipio = dpa.cod_municipio)
			where ca.fid_gestion = _gestion
		  ) LOOP
      
		  if (r.id_ubigeo <> r.lid_ubigeo 
		   or r.expedido <> r.exp_departamento
		   or r.casada_apellido <> r.apellido_casada
		   or r.estado_civil <> r.lestado_civil
		   or r.formato_inf <> r.lformato_inf) then
		      
		      update log_servicio_sigep set 
			      id_ubigeo = r.lid_ubigeo, 
			      exp_departamento = r.expedido, 
			      apellido_casada = r.casada_apellido, 
			      estado_civil = r.estado_civil,
			      formato_inf = r.formato_inf,
			      _fecha_modificacion = now(),
			      _usuario_modificacion = _idusuario,
			      estado = 'CREADO'			      
			  where id_log_servicio_sigep = r.id_log_servicio_sigep;
		      
		  end if;
     
    	END LOOP;
          		
	    return 'Ok';
	 	EXCEPTION WHEN OTHERS THEN
	    	return SQLERRM;
 	END;
$BODY$
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
