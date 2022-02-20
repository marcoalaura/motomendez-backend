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
             DECLARE _gestion_carga integer;
             DECLARE ppcd RECORD;
             DECLARE ppcd2 RECORD;
             DECLARE ppcd3 RECORD;
             
             BEGIN
              -- Definimos el mes de JULIO donde se empieza a controlar la edad
              pmes := 6;	-- Obtiene información con el mes de JULIO = 6
              _gestion_carga :=  _gestion - 1;
           
              -- Comprobar listado SIPRUM para la gestion
              IF NOT EXISTS (SELECT id from tmp_corte_anual WHERE tipo = 'SIPRUN' and gestion = _gestion LIMIT 1) THEN
                    raise exception 'No se subieron datos del ministerio de salud para la gestion.';
              END IF;
  
        -- Efectua el cambio de domicilio
        update tmp_corte_anual t
        set codigo_municipal = CAST(d.cod_municipio_nuevo as integer), nombre_municipio = p.municipio, direccion = d.direccion
        from domicilio d, dpa p
        where t.nro_documento = d.documento_identidad AND t.fecha_nacimiento = TO_CHAR(d.fecha_nacimiento, 'dd/mm/yyyy') 
        AND d.gestion = _gestion_carga and p.cod_municipio = d.cod_municipio_nuevo
        and t.tipo = 'SIPRUN' AND NOT(t.nro_documento = '' OR t.nro_documento = 'NULL' OR t.nro_documento IS NULL)
        AND NOT(t.fecha_nacimiento = '' OR t.fecha_nacimiento = 'NULL' OR t.fecha_nacimiento IS NULL) AND t.gestion = _gestion
        and CAST(t.codigo_municipal as integer) != CAST(d.cod_municipio_nuevo as integer);
      
              -- Comprobar listado de insercion laboral para la gestión
        IF NOT EXISTS (SELECT id from tmp_corte_anual WHERE tipo = 'OVT' and gestion = _gestion LIMIT 1) THEN
      -- Cargamos datos de la OVT
      IF NOT EXISTS (SELECT id_pcd_beneficio_log FROM pcd_beneficio_log WHERE fid_gestion = _gestion_carga and mes = pmes LIMIT 1) THEN 
                      raise exception 'No se ha recuperado información de la OVT para la gestion.';
      END IF;
      -- Insertamos en la tabla de cargaa csv, los registros de corte
      FOR ppcd IN (SELECT * FROM pcd_beneficio_log WHERE fid_gestion = _gestion_carga and mes = pmes)
      LOOP
      INSERT INTO tmp_corte_anual (nro_documento, complemento, exp_departamento , exp_pais, primer_apellido, segundo_apellido, 
                      apellido_casada, nombres, fecha_nacimiento, estado_civil, formato_inf, pais, nombre_municipio, direccion, telefono, 
                      estado, cod_beneficiario, _usuario_creacion, _fecha_creacion, _fecha_modificacion, tipo, gestion)
                      VALUES (ppcd.documento_identidad, ppcd.complemento_documento, '', 'BO', ppcd.primer_apellido, ppcd.segundo_apellido, 
                      --'', ppcd.nombres, ppcd.fecha_nacimiento, '', '', 'BO', '', '', '',
                      '', ppcd.nombres, TO_CHAR(ppcd.fecha_nacimiento::DATE, 'dd/mm/yyyy'), '', '', 'BO', '', '', '',  
                      --'CREADO', 1, _idusuario, now(), now(), 'OVT', _gestion);
                      'PENDIENTE', 1, _idusuario, now(), now(), 'OVT', _gestion);
      END LOOP;
              END IF;
  
              -- Comprobar listado del IBC para la gestión
        IF NOT EXISTS (SELECT id from tmp_corte_anual WHERE tipo = 'IBC' and gestion = _gestion LIMIT 1) THEN
      -- Insertamos los registrados a la fecha
      FOR ppcd IN (
        SELECT p.* FROM persona p 
        INNER JOIN pcd d ON p.id_persona = d.fid_persona 
        INNER JOIN certificado c ON c.fid_pcd = d.id_pcd and c.tipo_certificado = 'IBC' and now() between fecha_emision and fecha_vigencia
      )
      LOOP
      INSERT INTO tmp_corte_anual (nro_documento, complemento, exp_departamento , exp_pais, primer_apellido, segundo_apellido, 
                      apellido_casada, nombres, fecha_nacimiento, estado_civil, formato_inf, pais, nombre_municipio, direccion, telefono, 
                      estado, cod_beneficiario, _usuario_creacion, _fecha_creacion, _fecha_modificacion, tipo, gestion)
                      VALUES (ppcd.documento_identidad, ppcd.complemento_documento, expedido, 'BO', ppcd.primer_apellido, ppcd.segundo_apellido, 
                      ppcd.casada_apellido, ppcd.nombres, TO_CHAR(ppcd.fecha_nacimiento::DATE, 'dd/mm/yyyy'), ppcd.estado_civil, ppcd.formato_inf, 'BO', '', ppcd.direccion, ppcd.telefono,  
                      'PENDIENTE', 1, _idusuario, now(), now(), 'IBC', _gestion);
      END LOOP;
              END IF;
           
                 -- Habilita a todos los usuarios registrados en la gestion
              UPDATE tmp_corte_anual SET estado = 'HABILITADO' WHERE tipo = 'SIPRUN' AND gestion = _gestion;
      
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
  
        -- Iniciamos a todos con estado pendiente
               UPDATE tmp_corte_anual SET estado_contrastacion = 'PENDIENTE' WHERE gestion = _gestion and estado_contrastacion is null;
  
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
