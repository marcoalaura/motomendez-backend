'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `
      CREATE OR REPLACE FUNCTION public.fn_corte_mensual(
          _idusuario integer,
          _gestion integer,
          _mes integer)
        RETURNS text AS
      $BODY$
        DECLARE pmes integer;
        DECLARE pidmes integer;
        DECLARE ppcd RECORD;

        BEGIN
          --SELECT date_part('month', now()) as month INTO pmes;
          --verificando si existe ya el corte mensual
          IF EXISTS(select id_mes from mes WHERE mes = _mes and fid_gestion = _gestion) THEN
            raise exception 'Ya existe el corte mensual para el mes.';
          END IF;
          --creando el mes para el corte mensual
          INSERT INTO mes(mes, fecha_envio, fid_gestion, _usuario_creacion, _fecha_creacion, _fecha_modificacion) VALUES(_mes, now(), _gestion, _idUsuario, now(), now());

          SELECT id_mes FROM mes where mes = _mes and fid_gestion = _gestion INTO pidmes;
          --creando el corte mensual
          FOR ppcd IN(select pd.id_pcd, p.fecha_nacimiento, pd.cod_municipio
            from pcd as pd 
            inner join corte_anual as ca on(pd.id_pcd = ca.fid_pcd) 
            inner join persona as p on(pd.fid_persona = p.id_persona) 
            where ca.fid_gestion = _gestion)
          LOOP
            --Eliminando las pcds que tengan certificado en el IBC
            --IF EXISTS(SELECT c.fid_pcd FROM certificado as c WHERE c.fid_pcd = ppcd.id_pcd AND c.fecha_vigencia >= make_date(_gestion, _mes, 20) AND c.tipo_certificado = 'IBC') THEN
            IF EXISTS(SELECT c.fid_pcd FROM certificado as c WHERE c.fid_pcd = ppcd.id_pcd AND c.tipo_certificado = 'IBC') THEN
              INSERT INTO corte_mensual_observados(estado, observacion, _usuario_creacion, _fecha_creacion, _fecha_modificacion, fid_gestion, fid_mes, fid_pcd, cod_municipio)
              VALUES('GENERADO', 'Esta registrado en el IBC.', _idUsuario, now(), now(), _gestion, pidmes, ppcd.id_pcd, ppcd.cod_municipio);
            --Eliminando las pcds que haya expirado su certificado SIPRUNPCD
            --ELSIF NOT EXISTS(SELECT fid_pcd FROM certificado WHERE fid_pcd = ppcd.id_pcd AND fecha_vigencia >= make_date(_gestion, _mes, 20) AND tipo_certificado = 'SIPRUNPCD') THEN
            ELSIF NOT EXISTS(SELECT fid_pcd FROM certificado WHERE fid_pcd = ppcd.id_pcd AND fecha_vigencia >= make_date(_gestion, _mes, 20) AND porcentaje_discapacidad >= 50 AND tipo_certificado = 'SIPRUNPCD') THEN
              INSERT INTO corte_mensual_observados(estado, observacion, _usuario_creacion, _fecha_creacion, _fecha_modificacion, fid_gestion, fid_mes, fid_pcd, cod_municipio)
              VALUES('GENERADO', 'Su certificado SIPRUNPCD ya expiro.', _idUsuario, now(), now(), _gestion, pidmes, ppcd.id_pcd, ppcd.cod_municipio);
            --Eliminando las pcds que hayan cumplido 60 años hasta el final del mes
            ELSIF EXTRACT(YEAR FROM age(date_trunc('month', make_date(_gestion, _mes, 1)) + '1month'::interval - '1sec'::interval, ppcd.fecha_nacimiento)) >= 60 THEN
              INSERT INTO corte_mensual_observados(estado, observacion, _usuario_creacion, _fecha_creacion, _fecha_modificacion, fid_gestion, fid_mes, fid_pcd, cod_municipio)
              VALUES('GENERADO', 'Cumplio 60 años', _idUsuario, now(), now(), _gestion, pidmes, ppcd.id_pcd, ppcd.cod_municipio);
            --Eliminando las pcds que gozan algun beneficio
            --ELSIF EXISTS(SELECT pb.fid_pcd from pcd_beneficio AS pb INNER JOIN beneficio AS b ON(pb.fid_beneficio = b.id_beneficio) WHERE b.restriccion = true and pb.fid_pcd = ppcd.id_pcd) THEN
            ELSIF EXISTS(SELECT pb.fid_pcd from pcd_beneficio AS pb INNER JOIN beneficio AS b ON(pb.fid_beneficio = b.id_beneficio) WHERE b.restriccion = true and pb.estado = 'ACTIVO' and pb.fid_pcd = ppcd.id_pcd) THEN
              INSERT INTO corte_mensual_observados(estado, observacion, _usuario_creacion, _fecha_creacion, _fecha_modificacion, fid_gestion, fid_mes, fid_pcd, cod_municipio)
              VALUES('GENERADO', 'Goza de un beneficio (OVT)', _idUsuario, now(), now(), _gestion, pidmes, ppcd.id_pcd, ppcd.cod_municipio);
            --SI pasa todas las validaciones entra en la tabla
            ELSE
              INSERT INTO corte_mensual(estado, _usuario_creacion, _fecha_creacion, _fecha_modificacion, fid_gestion, fid_mes, fid_pcd, cod_municipio)
              VALUES('GENERADO', _idUsuario, now(), now(), _gestion, pidmes, ppcd.id_pcd, ppcd.cod_municipio);
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
  },
};
