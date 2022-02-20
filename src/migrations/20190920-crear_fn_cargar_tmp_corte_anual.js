  'use strict';

  module.exports = {
    up: (migration, DataTypes, done) => {
      const sql = (
        `
      CREATE OR REPLACE FUNCTION public.fn_cargar_tmp_corte_anual(_idusuario integer, _gestion integer)
        RETURNS text AS
      $BODY$
         DECLARE ppcd RECORD;
         
         BEGIN
           -- Comprobar si ya se realizo la carga inicial
           IF EXISTS (SELECT id FROM tmp_corte_anual WHERE tipo = 'SIPRUNPCD' AND gestion = _gestion LIMIT 1) THEN
          raise exception 'Ya se ha realizado la carga inicial en la tabla tmp_pcd.';
           END IF;
      
              -- Realiza la carga en la tabla temporal
              INSERT INTO tmp_corte_anual (nro_documento, complemento, exp_departamento, fecha_nacimiento, nombres, primer_apellido, segundo_apellido, apellido_casada, 
              formato_inf, estado_civil, direccion, telefono, codigo_municipal, fecha_vigencia, tipo_discapacidad,
              grados_disc, porcentaje, tipo, observacion_contrastacion, estado_contrastacion, gestion, _usuario_creacion, _fecha_creacion)
              SELECT documento_identidad, complemento_documento, expedido::varchar, TO_CHAR(fecha_nacimiento, 'DD/MM/YYYY'), nombres, primer_apellido, segundo_apellido, casada_apellido, 
              formato_inf, estado_civil, direccion, telefono, codigo_municipio, TO_CHAR(fecha_vigencia, 'DD/MM/YYYY'), tipo_discapacidad, 
              grado_discapacidad, porcentaje_discapacidad, 'SIPRUNPCD', observacion_contrastacion, estado_contrastacion, _gestion , _idusuario, now()
              FROM tmp_pcd WHERE tipo = 'SIPRUNPCD';
      
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
