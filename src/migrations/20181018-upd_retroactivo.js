'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `
      CREATE OR REPLACE FUNCTION fn_retroactivo(
        _idusuario integer,
        _gestion integer)
      RETURNS text AS
    $BODY$
            
              DECLARE pmes RECORD;
              DECLARE ppcd RECORD;
              
              BEGIN
                 
                -- Obtener los meses generados a la fecha
                FOR pmes IN (select id_mes, mes from mes where fid_gestion = _gestion)
                LOOP
                  RAISE NOTICE 'MES------------------------> %', pmes.id_mes;
                  -- obtenemos los observados  mensuales por mes
                  FOR ppcd IN (select pd.id_pcd, p.fecha_nacimiento, pd.cod_municipio, cmo.id_corte_mensual_observados
                    from corte_mensual_observados as cmo
                    inner join pcd as pd on (cmo.fid_pcd = pd.id_pcd)
                    inner join persona as p on (pd.fid_persona = p.id_persona)
                    where cmo.fid_gestion = _gestion and cmo.fid_mes = pmes.id_mes and cmo.estado = 'GENERADO')
                  LOOP
                    -- Verificamos que el registro no este corte_mensual
                    IF EXISTS (SELECT id_corte_mensual FROM corte_mensual as cm WHERE cm.fid_pcd = ppcd.id_pcd AND cm.fid_gestion = _gestion and cm.fid_mes = pmes.id_mes) then
                    -- Eliminando las pcds que tengan certificado en el IBC
                    ELSIF EXISTS (SELECT c.fid_pcd FROM certificado as c WHERE c.fid_pcd = ppcd.id_pcd AND c.tipo_certificado = 'IBC' AND c.fecha_vigencia >= make_date(_gestion, pmes.mes, 20)) THEN
                    -- Eliminando las pcds que hayan cumplido 60 años hasta el final del mes
                    ELSIF EXTRACT(YEAR FROM age(date_trunc('month', make_date(_gestion, pmes.mes, 1)) +'1month' ::interval -'1sec' ::interval, ppcd.fecha_nacimiento)) >= 60 then
                    -- Eliminando las pcds que haya expirado su certificado SIPRUNPCD y el porcentaje sea mayor igual a 50
                    -- ELSIF NOT EXISTS (SELECT fid_pcd FROM certificado WHERE fid_pcd = ppcd.id_pcd AND fecha_vigencia >= make_date(_gestion, pmes.mes, 20) AND tipo_certificado = 'SIPRUNPCD' AND porcentaje_discapacidad >= 50) THEN
		                ELSIF (SELECT fn_porcentaje (ppcd.id_pcd, _gestion, pmes.mes) < 50) THEN
		                -- ELSIF NOT EXISTS (select fid_pcd from (SELECT fid_pcd, porcentaje_discapacidad FROM certificado WHERE fid_pcd = ppcd.id_pcd AND fecha_vigencia >= make_date(_gestion, pmes.mes, 20) 
                                      -- AND tipo_certificado = 'SIPRUNPCD' order by id_certificado desc limit 1) as a1 where a1.porcentaje_discapacidad >= 50) THEN
                    -- Eliminando las pcds que gozan algun beneficio ACTIVO
                    -- ELSIF EXISTS (SELECT pb.fid_pcd from pcd_beneficio AS pb INNER JOIN beneficio AS b ON (pb.fid_beneficio = b.id_beneficio) 
                    -- WHERE b.restriccion = true and pb.fecha_inicio <= make_date(_gestion, pmes.mes, 20) and pb.estado = 'ACTIVO' and pb.fid_pcd = ppcd.id_pcd) then
                    -- Elimando las pcds que gozaron en el mes e algún beneficio
                    -- ELSIF EXISTS (SELECT pb.fid_pcd from pcd_beneficio AS pb INNER JOIN beneficio AS b ON (pb.fid_beneficio = b.id_beneficio) 
                    -- WHERE b.restriccion = true and pb.fecha_inicio <= make_date(_gestion, pmes.mes, 20) and pb.fecha_fin > make_date(_gestion, pmes.mes, 20) and pb.estado = 'INACTIVO' and pb.fid_pcd = ppcd.id_pcd) then
                    -- Elimando las pcds que gozaron en el mes de algún beneficio según nueva tabla migrada
                    ELSIF EXISTS (SELECT pbm.fid_pcd from pcd_beneficio_mes AS pbm INNER JOIN beneficio AS b ON (pbm.fid_beneficio = b.id_beneficio) 
                      WHERE b.restriccion = true and pbm.fid_gestion = _gestion and pbm.mes = pmes.mes and pbm.estado = 'ACTIVO' and pbm.fid_pcd = ppcd.id_pcd) then
                    -- SI pasa todas las validaciones entra en la tabla
                    ELSE
                      INSERT INTO corte_mensual (estado, _usuario_creacion, _fecha_creacion, _fecha_modificacion, fid_gestion, fid_mes, fid_pcd, cod_municipio)
                      VALUES ('GENERADO', _idUsuario, now(), now(), _gestion, pmes.id_mes, ppcd.id_pcd, ppcd.cod_municipio);
                      UPDATE corte_mensual_observados SET estado = 'ENVIADO', "_fecha_modificacion" = now(), "_usuario_modificacion" = _idUsuario
                      WHERE id_corte_mensual_observados = ppcd.id_corte_mensual_observados;
                    END IF;
                  END LOOP;
                END LOOP;
                return 'Ok';
              EXCEPTION WHEN OTHERS THEN
                  return SQLERRM;
              END;
              $BODY$
      LANGUAGE plpgsql VOLATILE
      COST 100;
    ALTER FUNCTION fn_retroactivo(integer, integer)
      OWNER TO ppipdis;
      
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
