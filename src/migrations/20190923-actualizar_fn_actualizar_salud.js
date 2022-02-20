  'use strict';

  module.exports = {
    up: (migration, DataTypes, done) => {
      const sql = (
        `
      CREATE OR REPLACE FUNCTION public.fn_actualizar_salud(
          _idusuario integer,
          _fidmes integer,
          _fidgestion integer)
        RETURNS text AS
      $BODY$
              DECLARE ppcd RECORD;
              BEGIN
      
              copy tmp_salud(nro, exp_departamento, nro_documento, complemento, primer_apellido, segundo_apellido,
                apellido_casada, nombre_completo, fecha_nacimiento, estado_civil, formato, fid_mes, fid_gestion)
              FROM '/tmp/datos_reg_siprun.csv' DELIMITER ',' CSV HEADER;
      
              --iterando sobre la nueva tabla
              FOR ppcd IN (select nro, exp_departamento, nro_documento, complemento, primer_apellido, segundo_apellido, apellido_casada, nombre_completo, fecha_nacimiento,
                estado_civil, formato
                FROM tmp_salud
                WHERE fid_mes = _fidmes and fid_gestion = _fidgestion)
              LOOP
                IF EXISTS (Select 1 from tmp_siprunpcd where nro_documento = ppcd.nro_documento and gestion = _fidgestion)  THEN
                  update tmp_siprunpcd set
                    complemento = NULLIF(ppcd.complemento, ''),
                    primer_apellido= NULLIF(ppcd.primer_apellido, ''),
                    segundo_apellido= NULLIF(ppcd.segundo_apellido, ''),
                    apellido_casada = NULLIF(ppcd.apellido_casada, ''),
                    nombres = ppcd.nombre_completo,
                    fecha_nacimiento = ppcd.fecha_nacimiento,
                    estado_civil = ppcd.estado_civil,
                    formato_inf = ppcd.formato,
                    exp_departamento = ppcd.exp_departamento
                  where nro_documento = ppcd.nro_documento and gestion = _fidgestion;
              END IF;
              IF EXISTS (Select 1 from persona where documento_identidad = ppcd.nro_documento) THEN
                update persona set
                  complemento_documento = NULLIF(ppcd.complemento, ''),
                  primer_apellido= NULLIF(ppcd.primer_apellido, ''),
                  segundo_apellido= NULLIF(ppcd.segundo_apellido, ''),
                  casada_apellido= NULLIF(ppcd.apellido_casada, ''),
                  nombres = ppcd.nombre_completo,
                  fecha_nacimiento = ppcd.fecha_nacimiento,
                  nombre_completo = CASE
                    WHEN ppcd.primer_apellido is NOT NULL and ppcd.segundo_apellido is NOT NULL and ppcd.apellido_casada is NOT NULL THEN
                      ppcd.primer_apellido || ' ' || ppcd.segundo_apellido || ' ' || ppcd.apellido_casada || ' ' || ppcd.nombre_completo
                    WHEN ppcd.primer_apellido is NOT NULL and ppcd.segundo_apellido is NOT NULL and ppcd.apellido_casada is NULL THEN
                      ppcd.primer_apellido || ' ' || ppcd.segundo_apellido || ' ' || ppcd.nombre_completo
                    WHEN ppcd.primer_apellido is null  and ppcd.apellido_casada is NULL THEN
                      ppcd.segundo_apellido || ' ' || ppcd.nombre_completo
                    WHEN ppcd.primer_apellido is null  and ppcd.apellido_casada is NOT NULL THEN
                      ppcd.segundo_apellido || ' ' || ppcd.apellido_casada || ' ' || ppcd.nombre_completo
                    WHEN ppcd.segundo_apellido is null  and ppcd.apellido_casada is NULL THEN
                      ppcd.primer_apellido || ' ' || ppcd.nombre_completo
                    WHEN ppcd.segundo_apellido is null  and ppcd.apellido_casada is NOT NULL THEN
                      ppcd.primer_apellido || ' ' || ppcd.apellido_casada || ' ' || ppcd.nombre_completo
                    END,
                  nombre_completo_siprunpcd = CASE
                    WHEN ppcd.primer_apellido is NOT NULL and ppcd.segundo_apellido is NOT NULL and ppcd.apellido_casada is NOT NULL THEN
                      ppcd.nombre_completo || ' ' || ppcd.primer_apellido || ' ' || ppcd.segundo_apellido || ' ' || ppcd.apellido_casada
                    WHEN ppcd.primer_apellido is NOT NULL and ppcd.segundo_apellido is NOT NULL and ppcd.apellido_casada is NULL THEN
                      ppcd.nombre_completo || ' ' || ppcd.primer_apellido || ' ' || ppcd.segundo_apellido
                    WHEN ppcd.primer_apellido is null  and ppcd.apellido_casada is NULL THEN
                      ppcd.nombre_completo || ' ' || coalesce(ppcd.segundo_apellido, '')
                    WHEN ppcd.primer_apellido is null  and ppcd.apellido_casada is NOT NULL THEN
                      ppcd.nombre_completo || ' ' || coalesce(ppcd.segundo_apellido, ' ') || ' DE ' || ppcd.apellido_casada
                    WHEN ppcd.segundo_apellido is null  and ppcd.apellido_casada is NULL THEN
                      ppcd.nombre_completo || ' ' || coalesce(ppcd.primer_apellido, '')
                    WHEN ppcd.segundo_apellido is null  and ppcd.apellido_casada is NOT NULL THEN
                      ppcd.nombre_completo || ' ' || coalesce(ppcd.primer_apellido, ' ') || ' DE ' || ppcd.apellido_casada
                    END,
                  estado_civil = ppcd.estado_civil,
                  formato_inf = ppcd.formato,
                  expedido = ppcd.exp_departamento,
                  _fecha_modificacion = now(),
                  _usuario_modificacion = _idusuario
                where documento_identidad = ppcd.nro_documento;
              END IF;
              -- IF EXISTS (Select 1 from log_servicio_sigep where documento_identidad = ppcd.nro_documento and observacion is NOT NULL and estado = 'OBSERVADO_REG') THEN
              IF EXISTS (Select 1 from log_servicio_sigep where documento_identidad = ppcd.nro_documento) THEN
                update log_servicio_sigep set
                  complemento = NULLIF(ppcd.complemento, ''),
                  primer_apellido= NULLIF(ppcd.primer_apellido, ''),
                  segundo_apellido= NULLIF(ppcd.segundo_apellido, ''),
                  apellido_casada= NULLIF(ppcd.apellido_casada, ''),
                  nombres = ppcd.nombre_completo,
                  fecha_nacimiento = ppcd.fecha_nacimiento,
                  estado_civil = ppcd.estado_civil,
                  formato_inf = ppcd.formato,
                  exp_departamento = ppcd.exp_departamento,
                  estado = 'CREADO',
                  observacion = null,
                  _fecha_modificacion = now(),
                  _usuario_modificacion = _idusuario
                where documento_identidad = ppcd.nro_documento;
              END IF;
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
