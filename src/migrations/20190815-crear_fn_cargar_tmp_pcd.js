'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `
    CREATE OR REPLACE FUNCTION public.fn_cargar_tmp_pcd(_idusuario integer)
      RETURNS text AS
    $BODY$
                       DECLARE ppcd RECORD;
                       
                       BEGIN
                        -- Comprobar si ya se realizo la carga inicial
                        IF EXISTS (SELECT id FROM tmp_pcd LIMIT 1) THEN
                              raise exception 'Ya se ha realizado la carga inicial en la tabla tmp_pcd.';
                        END IF;
            
            -- Realiza la carga en la tabla temporal
            INSERT INTO tmp_pcd (
            documento_identidad, complemento_documento, expedido, tipo_documento, fecha_nacimiento, nombres, primer_apellido, segundo_apellido, casada_apellido, 
            formato_inf, estado_civil, direccion, telefono, codigo_municipio, numero_registro, fecha_emision, fecha_vigencia, tipo_discapacidad, 
            grado_discapacidad, porcentaje_discapacidad, tipo, observacion_contrastacion, estado_contrastacion, estado_corte_anual, 
            fecha_registro, mes_carga, gestion_carga, _usuario_creacion, _fecha_creacion) 
            SELECT nro_documento, complemento, exp_departamento::integer, '100', TO_DATE(fecha_nacimiento, 'DD/MM/YYYY'), nombres, primer_apellido, segundo_apellido, apellido_casada, 
            formato_inf, estado_civil, direccion, telefono, codigo_municipal, '', 
            CASE WHEN tipo = 'SIPRUN' THEN TO_DATE(fecha_vigencia, 'DD/MM/YYYY') - interval '4 year' ELSE TO_DATE('01/01/2019', 'DD/MM/YYYY') end,
            CASE WHEN tipo = 'SIPRUN' THEN TO_DATE(fecha_vigencia, 'DD/MM/YYYY') ELSE TO_DATE('31/12/2019', 'DD/MM/YYYY') end, 
            CASE WHEN tipo = 'SIPRUN' THEN tipo_discapacidad ELSE 'CEGUERA' end,
            CASE WHEN tipo = 'SIPRUN' THEN grados_disc ELSE '' end, 
            CASE WHEN tipo = 'SIPRUN' THEN porcentaje::integer ELSE 33 end, 
            CASE WHEN tipo = 'SIPRUN' THEN 'SIPRUNPCD' ELSE tipo END, 
            observacion_contrastacion, estado_contrastacion, 
            CASE WHEN TO_DATE(fecha_vigencia, 'DD/MM/YYYY') - interval '4 year' <= TO_DATE('01/07/2018', 'DD/MM/YYYY') and tipo = 'SIPRUN' THEN 'INHABILITADO' ELSE 'HABILITADO' END,
            make_date(extract(year from now())::int, extract(month from now())::int, 20), extract(month from now()), extract(year from now()), _idusuario, now()
            FROM tmp_corte_anual 
            WHERE tipo in ('SIPRUN', 'IBC') and nro_documento is not null and nro_documento <> '0' and nro_documento  <> 'NULL' and nro_documento <> '';
                
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
