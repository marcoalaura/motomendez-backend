'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {

    const sql = (
      `   CREATE OR REPLACE FUNCTION public.fn_armar_sigep(_idusuario integer, _gestion integer)
      RETURNS text AS
      $BODY$
      DECLARE pmes integer;
      DECLARE pidmes integer;
      DECLARE ppcd RECORD;
      
      BEGIN
          -- verificando si existe la gestion
          IF NOT EXISTS (select id_gestion from gestion WHERE id_gestion = _gestion)  THEN
             raise exception 'No existe la gestion.';
          END IF;
          
          -- recorriendo el corte_anual
          FOR ppcd IN (select p.documento_identidad, p.complemento_documento, p.expedido, p.primer_apellido, p.segundo_apellido, 
            p.casada_apellido, p.nombres, p.correo_electronico, p.fecha_nacimiento, p.estado_civil, p.formato_inf, dpa.departamento, 
            dpa.municipio, p.direccion, p.telefono, dpa.id_ubigeo, dpa.id_entidad, pd.id_pcd, t.cod_beneficiario
            from corte_anual as ca
            inner join persona as p on (ca.fid_persona = p.id_persona)
            inner join pcd as pd on (ca.fid_pcd = pd.id_pcd)
            inner join dpa as dpa on (ca.cod_municipio = dpa.cod_municipio)
            inner join tmp_siprunpcd as t on (p.documento_identidad = t.nro_documento)
            where fid_gestion = _gestion)
          LOOP
             -- verificando si ya se envio alguna vez al SIGEP
             IF NOT EXISTS (SELECT documento_identidad FROM log_servicio_sigep WHERE documento_identidad = ppcd.documento_identidad) THEN
                INSERT INTO log_servicio_sigep (documento_identidad, complemento, exp_departamento , exp_pais, primer_apellido, segundo_apellido, 
                apellido_casada, nombres, email, fecha_nacimiento,estado_civil, formato_inf, pais, ciudad, localidad, direccion, telefono, 
                id_ubigeo, id_entidad_pago, estado, fid_pcd, cod_beneficiario, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                VALUES (ppcd.documento_identidad, ppcd.complemento_documento, ppcd.expedido, 'BO', ppcd.primer_apellido, ppcd.segundo_apellido, 
                ppcd.casada_apellido, ppcd.nombres, ppcd.correo_electronico, ppcd.fecha_nacimiento, ppcd.estado_civil, ppcd.formato_inf, 'BO', 
                ppcd.departamento, ppcd.municipio, ppcd.direccion, ppcd.telefono, ppcd.id_ubigeo, ppcd.id_entidad, 'CREADO', ppcd.id_pcd, ppcd.cod_beneficiario, _idusuario, now(), now());
             END IF;
        END LOOP;
        return 'Ok';
      EXCEPTION WHEN OTHERS THEN
          return SQLERRM;
      END;
      $BODY$
        LANGUAGE plpgsql VOLATILE
        COST 100;`
   );
    migration.sequelize.query(sql)
      .finally(done);
  },

  down: (migration, DataTypes, done) => {
    migration.sequelize.query('')
      .finally(done);
  },
};
