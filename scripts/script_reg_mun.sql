BEGIN;
--  DE SAN JULIÁN A SAN RAMÓN

Update pcd set cod_municipio = '071105' where cod_municipio = '071103';

Update corte_anual set cod_municipio = '071105' where cod_municipio = '071103';

Update corte_mensual set cod_municipio = '071105' where cod_municipio = '071103';

Update corte_mensual_observados set cod_municipio = '071105' where cod_municipio = '071103';

Update log_servicio_sigep set 
id_ubigeo = 499,
id_entidad_pago = 315, 
localidad = 'San Ramón', 
estado = 'POR_MODIFICAR_MUN' 
where (id_ubigeo = 500 and id_entidad_pago = '304' and cod_beneficiario is not null);


--  DE SAN ANTONIO DE ROMERÍO A SAN JULIÁN

Update pcd set cod_municipio = '071103' where cod_municipio = '071104';

Update corte_anual set cod_municipio = '071103' where cod_municipio = '071104';

Update corte_mensual set cod_municipio = '071103' where cod_municipio = '071104';

Update corte_mensual_observados set cod_municipio = '071103' where cod_municipio = '071104';

Update log_servicio_sigep set 
id_ubigeo = 500, 
localidad = 'San Julián',
id_entidad_pago = 304,
estado = 'POR_MODIFICAR_MUN' 
where (id_ubigeo = 501 and id_entidad_pago = '314' and cod_beneficiario is not null); 

-- DE SAN RAMÓN A SAN ANTONIO DE ROMERÍO
Update pcd set cod_municipio = '071104' 
FROM log_servicio_sigep  
where (log_servicio_sigep.fid_pcd = pcd.id_pcd AND log_servicio_sigep.estado <> 'POR_MODIFICAR_MUN' AND cod_municipio = '071105');

Update corte_anual set cod_municipio = '071104' 
FROM log_servicio_sigep  
where (log_servicio_sigep.fid_pcd = corte_anual.fid_pcd AND log_servicio_sigep.estado <> 'POR_MODIFICAR_MUN' AND corte_anual.cod_municipio = '071105');

Update corte_mensual set cod_municipio = '071104' 
FROM log_servicio_sigep  
where (log_servicio_sigep.fid_pcd = corte_mensual.fid_pcd AND log_servicio_sigep.estado <> 'POR_MODIFICAR_MUN' AND corte_mensual.cod_municipio = '071105');

Update corte_mensual_observados set cod_municipio = '071104'
FROM log_servicio_sigep  
where (log_servicio_sigep.fid_pcd = corte_mensual_observados.fid_pcd AND log_servicio_sigep.estado <> 'POR_MODIFICAR_MUN' AND corte_mensual_observados.cod_municipio = '071105');

Update log_servicio_sigep set 
id_ubigeo = 501, 
id_entidad_pago = 314,
localidad = 'San Antonio de Lomerío',
estado = 'POR_MODIFICAR_MUN' 
where (id_ubigeo = 499 and estado <> 'POR_MODIFICAR_MUN' and id_entidad_pago = '315' and cod_beneficiario is not null);

-- Retornar al estado anterior
UPDATE log_servicio_sigep set
estado = 'ACTUALIZADO_SIGEP',
_fecha_modificacion = '2018-03-01'
Where (estado = 'POR_MODIFICAR_MUN');

-- Borrar reportes mensuales
DELETE FROM reporte_mensual
where fid_municipio IN ('071104', '071103', '071105');


COMMIT;