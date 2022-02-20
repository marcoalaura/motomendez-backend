'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `
      CREATE OR REPLACE FUNCTION fn_importar(
        _idUsuario integer,
        _gestion integer,
        _tipo varchar,
        _estado varchar)
      RETURNS text AS
    $BODY$
      begin
        
        -- Validar estado contrastación  // revisar
             IF (SELECT count(*) FROM tmp_corte_anual WHERE gestion = _gestion AND estado != _estado) > 0 THEN
              raise exception 'No se puede reemplazar los registros, ya existen registros filtrados.';
             END IF;
            
        -- Eliminamos registros anteriores       
        DELETE FROM tmp_corte_anual WHERE tipo = _tipo AND gestion = _gestion;   
          
        -- Creamos tabla temporal
        DROP TABLE IF EXISTS tmp_importar;
        CREATE TABLE tmp_importar (
          nro int4 NULL,
          exp_departamento varchar(30) NULL,
          nro_documento varchar(30) NULL,
          complemento varchar(30) NULL,
          exp_pais varchar(30) NULL,
          primer_apellido varchar(30) NULL,
          segundo_apellido varchar(30) NULL,
          apellido_casada varchar(30) NULL,
          nombres varchar(30) NULL,
          estado_civil varchar(30) NULL,
          formato_inf varchar(30) NULL,
          fecha_nacimiento varchar(30) NULL,
          tipo_discapacidad varchar(30) NULL,
          grado_discapacidad varchar(30) NULL,
          porcentaje varchar(30) NULL,
          fecha_vigencia varchar(30) NULL,
          pais varchar(30) NULL,
          cod_municipio varchar(30) NULL,
          nombre_municipio varchar(100) NULL,
          direccion varchar(255) NULL,
          telefono varchar(30) NULL,
          celular varchar(30) null
        );
      
        COPY tmp_importar(nro, exp_departamento, nro_documento, complemento, exp_pais, primer_apellido, segundo_apellido, apellido_casada, 
          nombres, estado_civil, formato_inf, fecha_nacimiento, tipo_discapacidad, grado_discapacidad, porcentaje, 
          fecha_vigencia, pais, cod_municipio, nombre_municipio, direccion, telefono, celular)
             FROM '/tmp/importar.csv' DELIMITER '~' CSV HEADER;
           
        INSERT INTO tmp_corte_anual(nro, exp_departamento, nro_documento, complemento, exp_pais, primer_apellido, segundo_apellido, apellido_casada, 
          nombres, estado_civil, formato_inf, fecha_nacimiento, tipo_discapacidad, grados_disc, porcentaje, 
          fecha_vigencia, pais, codigo_municipal, nombre_municipio, direccion, telefono, celular,
          gestion, tipo, estado, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
         SELECT nro, exp_departamento, nro_documento, complemento, exp_pais, primer_apellido, segundo_apellido, apellido_casada, 
          nombres, estado_civil, formato_inf, fecha_nacimiento, tipo_discapacidad, grado_discapacidad, porcentaje, 
          fecha_vigencia, pais, cod_municipio, nombre_municipio, direccion, telefono, celular,
          _gestion, _tipo, _estado, _idUsuario, now(), now()
         FROM tmp_importar;
       
         DROP TABLE tmp_importar;
       
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
