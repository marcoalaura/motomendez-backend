  'use strict';

  module.exports = {
    up: (migration, DataTypes, done) => {
      const sql = (
        `
      CREATE OR REPLACE FUNCTION public.fn_registro_pcd_corte_mensual(_idusuario integer)
        RETURNS text AS
      $BODY$
                    DECLARE pmes integer;
                    DECLARE pgestion integer;
                    DECLARE ppersonaId integer;
                    DECLARE ppcdId integer;
                    DECLARE pcertificadoId integer;
                    DECLARE pcorteAnualId integer;
                    DECLARE plogServicioSegipId integer;
                    DECLARE pmes_ini integer;
                    DECLARE pgestion_control integer;
                    DECLARE pidmes integer;
                    DECLARE ppcd RECORD;
                    DECLARE RESULTADO VARCHAR(100);
                
                    BEGIN
                  SELECT date_part('month', now()) as month INTO pmes;
                  SELECT date_part('year', now()) as month INTO pgestion;
                
                  -- Comprobar listado TMP_PCD para realizar el registros
                  IF NOT EXISTS (SELECT id from tmp_pcd WHERE estado_contrastacion = 'HABILITADO' LIMIT 1) THEN
                      raise exception 'No se cuenta con data en la tabla temporal del pcd para registrar.';
                  END IF;
                
                  -- Insertamos en las tablas respectivas los registros de nuevos PCDs
                        FOR ppcd IN (SELECT * FROM tmp_pcd WHERE gestion_carga = pgestion and mes_carga = pmes and estado_contrastacion = 'HABILITADO' and estado_corte_anual = 'HABILITADO' /*and documento_identidad = '3142529'*/)
                        -- and documento_identidad not in (select documento_identidad from log_servicio_sigep) limit 1)
                        LOOP	    
                      -- Validamos que sera del tipo SIPRUNPCD y que no haya valores nulos en el formato del nombre, estado civil y codigo municipio
                      IF (ppcd.tipo = 'SIPRUNPCD' AND ppcd.codigo_municipio is not NULL) or ppcd.tipo = 'IBC' THEN
                        IF ppcd.tipo = 'SIPRUNPCD' AND ppcd.porcentaje_discapacidad >= 50 AND (ppcd.formato_inf is NULL or ppcd.formato_inf = '' or ppcd.estado_civil is  NULL or ppcd.estado_civil = '' or ppcd.direccion is  NULL or ppcd.direccion = '' or ppcd.expedido is NULL) THEN
                          -- Si se identifica valores nulos se debe observar el registro para completar
                    UPDATE tmp_pcd SET estado_contrastacion = 'OBSERVADO', observacion_contrastacion = 'Actualizar el formato del nombre, expedido, estado civil o dirección', 
                    _usuario_modificacion = _idusuario, _fecha_modificacion = now() WHERE id = ppcd.id;
                        ELSE
                    -- modificamos el codigo de municipio
                    IF ppcd.codigo_municipio is NOT NULL THEN 
                        ppcd.codigo_municipio := '0' || ppcd.codigo_municipio;
                    END IF;
                
                    -- Registramos nuevos en la tabla persona
                    IF NOT EXISTS (SELECT id_persona from persona WHERE documento_identidad = ppcd.documento_identidad and fecha_nacimiento = ppcd.fecha_nacimiento) THEN
                        -- Identificamos un registro que tenga el mismo CI o fecha de nacimiento y debe ser observado
                        IF EXISTS (SELECT id_persona from persona WHERE documento_identidad = ppcd.documento_identidad ) OR EXISTS (SELECT id_persona from persona WHERE documento_identidad <> ppcd.documento_identidad and fecha_nacimiento = ppcd.fecha_nacimiento and nombres = ppcd.nombres and primer_apellido = ppcd.primer_apellido and segundo_apellido = ppcd.segundo_apellido) THEN
                      UPDATE tmp_pcd SET estado_contrastacion = 'OBSERVADO', observacion_contrastacion = 'REGISTRO DUPLICADO' WHERE id = ppcd.id;
                        ELSE
                      INSERT INTO persona (documento_identidad, complemento_documento, expedido, nombres, primer_apellido, segundo_apellido, casada_apellido, nombre_completo, 
                      fecha_nacimiento, formato_inf, nombre_completo_siprunpcd, sexo, estado_civil, 
                      direccion, telefono, fid_tipo_documento, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                      VALUES (ppcd.documento_identidad, ppcd.complemento_documento, ppcd.expedido, ppcd.nombres, ppcd.primer_apellido, ppcd.segundo_apellido, ppcd.casada_apellido, 
                      coalesce(ppcd.primer_apellido, '') || ' ' || coalesce(ppcd.segundo_apellido, '') || ' ' || ppcd.nombres,
                      ppcd.fecha_nacimiento, ppcd.formato_inf, ppcd.nombres || ' ' || ppcd.primer_apellido || ' ' || ppcd.segundo_apellido, ppcd.sexo, ppcd.estado_civil,
                      ppcd.direccion, ppcd.telefono, ppcd.tipo_documento, _idusuario, now(), now()); 
                        END IF;
                    END IF;
                
                    SELECT id_persona INTO ppersonaId from persona WHERE documento_identidad = ppcd.documento_identidad and fecha_nacimiento = ppcd.fecha_nacimiento ORDER BY id_persona DESC LIMIT 1 ;
                
                    -- RAISE NOTICE 'El codigo de persona es: %', ppersonaId;
                    IF ppersonaId IS NOT NULL THEN
                      -- Actualizamos municipio en caso de cambiar
                      IF EXISTS (SELECT id_pcd FROM pcd WHERE fid_persona = ppersonaId AND cod_municipio <> ppcd.codigo_municipio AND id_pcd NOT IN (SELECT fid_pcd FROM log_servicio_sigep)) THEN
                        UPDATE pcd SET cod_municipio = ppcd.codigo_municipio WHERE fid_persona = ppersonaId;
                      END if;
                        -- Registramos nuevos en la tabla pcd
                        IF NOT EXISTS (SELECT id_pcd FROM pcd WHERE fid_persona = ppersonaId) THEN
                      IF (ppcd.tipo = 'SIPRUNPCD' AND ppcd.fecha_registro is NOT NULL) THEN
                          INSERT INTO pcd (cod_municipio, fecha_habilitacion, fid_persona, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                          VALUES (ppcd.codigo_municipio, ppcd.fecha_registro + interval '2 month', ppersonaId, _idusuario, now(), now());
                            ELSEIF (ppcd.tipo = 'SIPRUNPCD') THEN
                          INSERT INTO pcd (cod_municipio, fid_persona, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                          VALUES (ppcd.codigo_municipio, ppersonaId, _idusuario, now(), now());
                      ELSE
                          INSERT INTO pcd (cod_municipio, fid_persona, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                          VALUES ('020101', ppersonaId, _idusuario, now(), now());
                      END IF;
                        END IF;
                
                        SELECT id_pcd INTO ppcdId from pcd WHERE fid_persona = ppersonaId;
                
                        -- RAISE NOTICE 'El codigo de pcd es: %', ppcdId;
                
                        IF NOT EXISTS(SELECT id_log_servicio_sigep FROM log_servicio_sigep WHERE fid_pcd = ppcdId) THEN
                            IF (ppcd.tipo = 'SIPRUNPCD') THEN
                          -- Actualiza datos de la persma
                          UPDATE persona SET complemento_documento = ppcd.complemento_documento, expedido = ppcd.expedido, nombres = ppcd.nombres, primer_apellido = ppcd.primer_apellido, 
                          segundo_apellido = ppcd.segundo_apellido, casada_apellido = ppcd.casada_apellido, formato_inf = ppcd.formato_inf, 
                          nombre_completo_siprunpcd = ppcd.nombres || ' ' || ppcd.primer_apellido || ' ' || ppcd.segundo_apellido, sexo = ppcd.sexo, estado_civil = ppcd.estado_civil, 
                          direccion = ppcd.direccion, telefono = ppcd.telefono, fid_tipo_documento = ppcd.tipo_documento, _usuario_modificacion = _idusuario, _fecha_modificacion = now() 
                          WHERE documento_identidad = ppcd.documento_identidad and fecha_nacimiento = ppcd.fecha_nacimiento;
                      END IF;
                        END IF;
                            
                                    -- Registramos nuevos en la tabla certificado
                        IF NOT EXISTS (SELECT id_certificado FROM certificado WHERE fecha_emision = ppcd.fecha_emision and fid_pcd = ppcdId and tipo_certificado = ppcd.tipo) THEN
                            INSERT INTO certificado (numero_registro, fecha_emision, fecha_vigencia, tipo_discapacidad, grado_discapacidad, porcentaje_discapacidad, tipo_certificado, 
                                        fid_pcd, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                                        VALUES (ppcd.numero_registro, ppcd.fecha_emision, ppcd.fecha_vigencia, ppcd.tipo_discapacidad, ppcd.grado_discapacidad, ppcd.porcentaje_discapacidad, ppcd.tipo, 
                                        ppcdId, _idusuario, now(), now());
                        
                                        IF ppcd.porcentaje_discapacidad >= 50 AND NOT EXISTS (SELECT id_certificado FROM certificado WHERE fid_pcd = ppcdId AND fecha_emision <> ppcd.fecha_emision AND porcentaje_discapacidad >= 50) THEN
                                            -- Habilitamos usuario donde el grado de discapacida aumento a un tipo GRAVE o MUY GRAVE
                          UPDATE pcd SET fecha_habilitacion = ppcd.fecha_registro + interval '2 month', _usuario_modificacion = _idusuario, _fecha_modificacion = now() 
                          WHERE id_pcd = ppcdId and fecha_habilitacion is null; 
                      END IF;
                        END IF;
                
                        SELECT id_certificado INTO pcertificadoId FROM certificado WHERE fecha_emision = ppcd.fecha_emision and fid_pcd = ppcdId and tipo_certificado = ppcd.tipo ORDER BY id_certificado DESC LIMIT 1 ;
                
                        -- RAISE NOTICE 'El codigo de certificado es: %', pcertificadoId;
                
                        -- Comprobamos si el certificado fue inhabilitado
                        IF ppcd.estado = 'INACTIVO' THEN 
                            UPDATE certificado SET fecha_vigencia = now() - interval '1 month', _usuario_modificacion = _idusuario, _fecha_modificacion = now() 
                                        WHERE id_certificado = pcertificadoId;
                        END IF;
                         
                                    -- Verificamos si cumplió los 2 meses para su incorporacion, además de ver si es un registro con un porcentaje > 50
                                    IF ppcd.porcentaje_discapacidad >= 50 and ppcd.tipo = 'SIPRUNPCD' THEN
                      -- Registramos nuevos en la tabla corte_anual
                      IF NOT EXISTS (SELECT id_corte_anual from corte_anual WHERE fid_gestion = pgestion and fid_pcd = ppcdId) THEN
                          INSERT INTO corte_anual (fid_gestion, fid_pcd, fid_persona, cod_municipio, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                          VALUES (pgestion, ppcdId, ppersonaId, ppcd.codigo_municipio, _idusuario, now(), now());
                      END IF;
                
                      SELECT id_corte_anual INTO pcorteAnualId FROM corte_anual WHERE fid_gestion = pgestion and fid_pcd = ppcdId;
                
                                        -- RAISE NOTICE 'El codigo en el corte anual es: %', pcorteAnualId;
                
                                        -- Registramos nuevos en la tabla log_servicio_sigep
                            IF NOT EXISTS (SELECT id_log_servicio_sigep from log_servicio_sigep WHERE fid_pcd = ppcdId) THEN
                
                                            IF ppcd.fecha_registro IS NOT NULL THEN
                        -- Actualizar en el caso de que se deba ajustar desde enero
                        -- RAISE NOTICE 'Fecha habilitación: %', ppcd.fecha_registro;
                        -- Insertamos los registros del corte mensual o observado desde donde corresponda
                        SELECT date_part('month', ppcd.fecha_registro + interval '2 month') as month INTO pmes_ini;
                        SELECT date_part('year', ppcd.fecha_registro + interval '2 month') as year INTO pgestion_control;
                
                        -- RAISE NOTICE 'Desde mes: %', pmes_ini;
                        IF pgestion = pgestion_control THEN	-- La lógica solo funciona en la misma gestión
                            FOR mesactual IN pmes_ini .. pmes - 1 LOOP
                                SELECT id_mes FROM mes where mes = mesactual and fid_gestion = pgestion INTO pidmes;
                
                          -- Realiza los filtros para los registros en el corte mensual
                          -- Eliminando las pcds que tengan certificado en el IBC
                          IF EXISTS(SELECT c.fid_pcd FROM certificado as c WHERE c.fid_pcd = ppcdId AND c.fecha_vigencia >= make_date(pgestion, 12, 31) AND c.tipo_certificado = 'IBC') THEN
                              INSERT INTO corte_mensual_observados(estado, observacion, fid_gestion, fid_mes, fid_pcd, cod_municipio, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                              VALUES('GENERADO', 'Esta registrado en el IBC.', pgestion, pidmes, ppcdId, ppcd.codigo_municipio, _idUsuario, now(), now());
                
                          ELSIF (SELECT fn_porcentaje (ppcdId, pgestion, pmes) < 50) THEN
                              INSERT INTO corte_mensual_observados(estado, observacion, fid_gestion, fid_mes, fid_pcd, cod_municipio, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                              VALUES('GENERADO', 'Su certificado SIPRUNPCD ya expiro.', pgestion, pidmes, ppcdId, ppcd.codigo_municipio, _idUsuario, now(), now());
                
                          --Eliminando las pcds que hayan cumplido 60 años hasta el final del mes
                          ELSIF EXTRACT(YEAR FROM age(date_trunc('month', make_date(pgestion, mesactual, 1)) + '1month'::interval - '1sec'::interval, ppcd.fecha_nacimiento)) >= 60 THEN
                              INSERT INTO corte_mensual_observados(estado, observacion, fid_gestion, fid_mes, fid_pcd, cod_municipio, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                              VALUES('GENERADO', 'Cumplio 60 años', pgestion, pidmes, ppcdId, ppcd.codigo_municipio, _idUsuario, now(), now());
                              
                          --Eliminando las pcds que gozan algun beneficio en el mes
                          ELSIF EXISTS (SELECT pbm.fid_pcd from pcd_beneficio_mes AS pbm INNER JOIN beneficio AS b ON(pbm.fid_beneficio = b.id_beneficio) 
                              WHERE b.restriccion = true and pbm.fid_gestion = pgestion and pbm.mes = mesactual and pbm.estado = 'ACTIVO' and pbm.fid_pcd = ppcdId) then 
                              INSERT INTO corte_mensual_observados(estado, observacion, fid_gestion, fid_mes, fid_pcd, cod_municipio, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                              VALUES('GENERADO', 'Goza de un beneficio (OVT)', pgestion, pidmes, ppcdId, ppcd.codigo_municipio, _idUsuario, now(), now());
                          --SI pasa todas las validaciones entra en la tabla
                          ELSE
                              INSERT INTO corte_mensual(estado, fid_gestion, fid_mes, fid_pcd, cod_municipio, _usuario_creacion, _fecha_creacion, _fecha_modificacion)
                              VALUES('GENERADO', pgestion, pidmes, ppcdId, ppcd.codigo_municipio, _idUsuario, now(), now());
                                      END IF;
                          -- RAISE NOTICE 'Generar para el mes: %', mesactual;
                            END LOOP;
                              END IF;
                          END IF;
                
                      ELSEIF EXISTS(SELECT id_log_servicio_sigep FROM log_servicio_sigep WHERE fid_pcd = ppcdId AND estado = 'OBSERVADO_REG' and observacion not like '%FALLECIDO%') THEN
                          -- Actualizar log servicio sigep a creado cuando identifica modificaciones
                          UPDATE log_servicio_sigep SET complemento = ppcd.complemento_documento, exp_departamento = ppcd.expedido, primer_apellido = ppcd.primer_apellido, 
                          segundo_apellido = ppcd.segundo_apellido, apellido_casada = ppcd.casada_apellido, nombres = ppcd.nombres, fecha_nacimiento = ppcd.fecha_nacimiento, 
                          estado_civil = ppcd.estado_civil, formato_inf = ppcd.formato_inf, direccion = ppcd.direccion, telefono =  ppcd.telefono, 
                          estado = 'CREADO', _usuario_modificacion = _idUsuario, _fecha_modificacion = now()
                          WHERE fid_pcd = ppcdId;
                        
                          -- Actualiza datos de la persona
                          UPDATE persona SET complemento_documento = ppcd.complemento_documento, expedido = ppcd.expedido, nombres = ppcd.nombres, primer_apellido = ppcd.primer_apellido, 
                          segundo_apellido = ppcd.segundo_apellido, casada_apellido = ppcd.casada_apellido, formato_inf = ppcd.formato_inf, 
                          nombre_completo_siprunpcd = ppcd.nombres || ' ' || ppcd.primer_apellido || ' ' || ppcd.segundo_apellido, sexo = ppcd.sexo, estado_civil = ppcd.estado_civil, 
                          direccion = ppcd.direccion, telefono = ppcd.telefono, fid_tipo_documento = ppcd.tipo_documento, _usuario_modificacion = _idusuario, _fecha_modificacion = now() 
                          WHERE documento_identidad = ppcd.documento_identidad and fecha_nacimiento = ppcd.fecha_nacimiento;
                            END IF;
                        END IF;
                    END IF;
                        END IF;
                      ELSE 
                    -- Si se identifica valor nulo en Municipio se observa el registro
                    UPDATE tmp_pcd SET estado_contrastacion = 'OBSERVADO', observacion_contrastacion = 'Actualizar el Municipio', 
                    _usuario_modificacion = _idusuario, _fecha_modificacion = now() WHERE id = ppcd.id;
                      END IF;
                  END LOOP;
                            -- Se encarga de garantizar que se cree todos los registros en el log_servicio_sigep
                  SELECT fn_armar_sigep(_idusuario, pgestion) into resultado;
                        -- RAISE NOTICE 'Resultado final: %', resultado;
                  return resultado;
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
