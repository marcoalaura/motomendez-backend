'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `
    CREATE OR REPLACE FUNCTION public.fn_contrastar_corte_anual(
        _idusuario integer,
        _gestion integer)
      RETURNS text AS
    $BODY$
           DECLARE pmes integer;
           DECLARE ppcd RECORD;
           DECLARE ppcd2 RECORD;
           
           BEGIN	   
         -- Comprobar lista de habilitados
               IF NOT EXISTS (SELECT id from tmp_corte_anual WHERE tipo = 'SIPRUN' and gestion = _gestion and estado = 'HABILITADO' LIMIT 1) THEN
                  raise exception 'No se ha realizado el filtrado inicial.';
               END IF;
    
               -- Habilita a todos los usuarios regsitdos de la OVT
               UPDATE tmp_corte_anual SET estado_contrastacion = 'OBSERVADO', observacion_contrastacion = 'SIN CI' WHERE gestion = _gestion AND (nro_documento = '' OR nro_documento IS NULL OR nro_documento = 'NULL')
               and estado_contrastacion = 'PENDIENTE';
               -- CONSIDERAR FECHA DE NACIMIENTO NULL, ADICIONAR TB 'NULL'
               
               -- Habilita a todos los usuarios regsitdos de la OVT
               UPDATE tmp_corte_anual SET estado_contrastacion = 'HABILITADO' WHERE tipo = 'OVT' AND gestion = _gestion AND NOT(nro_documento = '' OR nro_documento IS NULL OR nro_documento = 'NULL')
               and estado_contrastacion = 'PENDIENTE';
    
               -- Habilitar a los usuarios que se encuentran en el SIPRUN
               UPDATE tmp_corte_anual SET estado_contrastacion = 'HABILITADO' 
               WHERE id IN (
		SELECT tca.id FROM persona p 
		INNER JOIN tmp_corte_anual tca ON p.documento_identidad = tca.nro_documento AND TO_CHAR(p.fecha_nacimiento, 'DD/MM/YYYY') = tca.fecha_nacimiento 
		AND NOT(tca.nro_documento = '' OR tca.nro_documento IS NULL OR nro_documento = 'NULL') AND tca.tipo = 'SIPRUN' AND tca.gestion = _gestion
		and estado_contrastacion = 'PENDIENTE'
               );
    
	       -- Habilitar a los usuarios que se encuentran en el IBC
	       UPDATE tmp_corte_anual SET estado_contrastacion = 'HABILITADO'
	       WHERE id IN (
		SELECT tca.id FROM persona p 
		INNER JOIN pcd d ON p.id_persona = d.fid_persona 
		INNER JOIN certificado c ON c.fid_pcd = d.id_pcd and c.tipo_certificado = 'IBC' and now() between fecha_emision and fecha_vigencia
		INNER JOIN tmp_corte_anual tca ON p.documento_identidad = tca.nro_documento AND TO_CHAR(p.fecha_nacimiento, 'DD/MM/YYYY') = tca.fecha_nacimiento 
		AND NOT(tca.nro_documento = '' OR tca.nro_documento IS NULL OR nro_documento = 'NULL') AND tca.tipo = 'IBC' AND tca.gestion = _gestion
		and estado_contrastacion = 'PENDIENTE'
               );
    
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
