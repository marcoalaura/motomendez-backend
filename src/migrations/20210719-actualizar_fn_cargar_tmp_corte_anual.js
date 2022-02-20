  'use strict';

  module.exports = {
    up: (migration, DataTypes, done) => {
      const sql = (
        `
      CREATE OR REPLACE FUNCTION public.fn_cargar_tmp_corte_anual(
          _idusuario integer,
          _gestion integer)
        RETURNS text AS
      $BODY$
                     DECLARE pdia integer;
                           DECLARE pmes integer;
                           DECLARE resultado VARCHAR(100);
                           DECLARE _gestion_carga integer;
                           
                           BEGIN
                             -- Comprobar si ya se realizo la carga inicial
                             IF EXISTS (SELECT id FROM tmp_corte_anual WHERE tipo = 'SIPRUN' AND gestion = _gestion LIMIT 1) THEN
                  raise exception 'Ya se ha realizado la carga en la tabla temporal del corte anual.';
                             END IF;
                  
                 -- Controlamos que se realice el paso solo en el mes de Junio para adelanate
                 SELECT date_part('day', now()) as month INTO pdia;
                 -- Se toma el mes de Julio para realizar el corte anual
                 pmes := 7;
                 _gestion_carga :=  _gestion - 1;
                          
                             IF date_part('month', now()) < 7 THEN
                  raise exception 'El proceso de carga de información debe realizarse en el mes de JULIO para adelante.';
                             END IF;
                             
                 -- CARGAR LISTADO SIPRUN EN LA NUEVA GESTIÓN
                 IF NOT EXISTS (SELECT id from tmp_corte_anual WHERE tipo = 'SIPRUN' and gestion = _gestion LIMIT 1) THEN
                                INSERT INTO tmp_corte_anual (nro_documento, complemento, exp_departamento, fecha_nacimiento, nombres, primer_apellido, segundo_apellido, apellido_casada, 
                                formato_inf, estado_civil, direccion, telefono, nombre_municipio, codigo_municipal, fecha_vigencia, tipo_discapacidad,
                                grados_disc, porcentaje, tipo, estado, observacion_contrastacion, estado_contrastacion, gestion, _usuario_creacion, _fecha_creacion)
                    SELECT t.documento_identidad, t.complemento_documento, t.expedido::varchar, TO_CHAR(t.fecha_nacimiento, 'DD/MM/YYYY'), t.nombres, t.primer_apellido, t.segundo_apellido, t.casada_apellido, 
                    t.formato_inf, t.estado_civil, t.direccion, t.telefono, d.municipio, t.codigo_municipio, TO_CHAR(t.fecha_vigencia, 'DD/MM/YYYY'), t.tipo_discapacidad, 
                    t.grado_discapacidad, t.porcentaje_discapacidad, 'SIPRUN', 'HABILITADO', SUBSTRING(t.observacion_contrastacion, 1, 100), t.estado_contrastacion, _gestion , _idusuario, now()
                    FROM tmp_pcd t 
                    LEFT JOIN dpa d on d.cod_municipio = '0' || t.codigo_municipio
                    WHERE t.tipo = 'SIPRUNPCD' AND t.estado = 'ACTIVO';
                             END IF;
            
                 -- CARGAR LISTADO IBC EN LA NUEVA GESTIÓN
                 IF NOT EXISTS (SELECT id from tmp_corte_anual WHERE tipo = 'IBC' and gestion = _gestion LIMIT 1) THEN
                    INSERT INTO tmp_corte_anual (nro_documento, complemento, exp_departamento, fecha_nacimiento, nombres, primer_apellido, segundo_apellido, apellido_casada, 
                    formato_inf, estado_civil, direccion, telefono, codigo_municipal, fecha_vigencia, tipo_discapacidad,
                    grados_disc, porcentaje, tipo, observacion_contrastacion, estado_contrastacion, gestion, _usuario_creacion, _fecha_creacion)
                    SELECT DISTINCT t.documento_identidad, t.complemento_documento, t.expedido::varchar, TO_CHAR(t.fecha_nacimiento, 'DD/MM/YYYY'), t.nombres, t.primer_apellido, t.segundo_apellido, t.casada_apellido, 
                    t.formato_inf, t.estado_civil, t.direccion, t.telefono, t.codigo_municipio, TO_CHAR(c.fecha_vigencia, 'DD/MM/YYYY'), 'VISUAL', 
                    'MODERADO', 33, 'IBC', SUBSTRING(t.observacion_contrastacion, 1, 100), t.estado_contrastacion, _gestion , _idusuario, now()
                    FROM tmp_pcd t
                    INNER JOIN persona p ON t.documento_identidad = p.documento_identidad AND t.fecha_nacimiento = p.fecha_nacimiento 
                    INNER JOIN pcd d ON d.fid_persona = p.id_persona 
                    INNER JOIN certificado c ON c.fid_pcd = d.id_pcd AND c.tipo_certificado = 'IBC' AND now() BETWEEN c.fecha_emision AND c.fecha_vigencia
                    WHERE t.tipo = 'IBC' AND t.estado_contrastacion = 'HABILITADO';
                 END IF;
                 
                 -- CARGAR LISTADO OVT EN LA NUEVA GESTIÓN
                 IF NOT EXISTS (SELECT id from tmp_corte_anual WHERE tipo = 'OVT' and gestion = _gestion LIMIT 1) THEN
                    -- Cargamos datos de la OVT
                    IF NOT EXISTS (SELECT id_pcd_beneficio_log FROM pcd_beneficio_log WHERE fid_gestion = _gestion_carga and mes = pmes - 1 LIMIT 1) THEN 
                        raise exception 'No se ha recuperado información de la OVT para la gestion.';
                    END IF;
                  
                    -- Insertamos en la tabla de carga csv, los registros de corte
                    INSERT INTO tmp_corte_anual (nro_documento, complemento, exp_departamento , exp_pais, primer_apellido, segundo_apellido, 
                                apellido_casada, nombres, fecha_nacimiento, estado_civil, formato_inf, pais, nombre_municipio, direccion, telefono, 
                                estado, cod_beneficiario, _usuario_creacion, _fecha_creacion, _fecha_modificacion, tipo, gestion, estado_contrastacion)
                    SELECT documento_identidad, complemento_documento, '', 'BO', primer_apellido, segundo_apellido, 
                                '', nombres, TO_CHAR(fecha_nacimiento::DATE, 'dd/mm/yyyy'), '', '', 'BO', '', '', '',  
                                'PENDIENTE', 1, _idusuario, now(), now(), 'OVT', _gestion, 'HABILITADO'
                    FROM pcd_beneficio_log WHERE fid_gestion = _gestion_carga and mes = pmes - 1;
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
