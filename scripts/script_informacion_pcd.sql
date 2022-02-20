--Debido al requerimiento, según nota interna: AGETIC-UGE/NI/1328/2020, se solicitud de información del registro del Sistema Eustaquio Moto Méndez de la gestión 2020.

copy (
select * from(
select p.documento_identidad, p.nombres, p.primer_apellido, p.segundo_apellido, TO_CHAR(p.fecha_nacimiento, 'dd/mm/yyyy') fecha_nacimiento, d.departamento, d.provincia, d.municipio, date_part('year', age(p.fecha_nacimiento))::int edad, c.grado_discapacidad
from pcd as pd 
inner join persona as p on pd.fid_persona = p.id_persona 
inner join corte_anual as ca on pd.id_pcd = ca.fid_pcd 
inner join log_servicio_sigep ls on ls.fid_pcd = pd.id_pcd 
inner join dpa d on d.cod_municipio = ca.cod_municipio 
inner join (select max(id_certificado) id_certificado, fid_pcd from certificado where tipo_certificado = 'SIPRUNPCD' and estado = 'ACTIVO' group by fid_pcd) cmax on cmax.fid_pcd = pd.id_pcd
inner join certificado c on c.id_certificado = cmax.id_certificado
where ca.fid_gestion = 2020 and (pd.fecha_habilitacion is null or make_date(2020, 12, 20) >= pd.fecha_habilitacion) and pd.estado = 'ACTIVO'
and ls.estado = 'ACTUALIZADO_SIGEP'
order by d.departamento, d.provincia, d.municipio, p.nombres, p.primer_apellido, p.segundo_apellido
) as r
where (r.grado_discapacidad = 'GRAVE' or r.grado_discapacidad = 'MUY GRAVE')
) to '/tmp/listado_pcd_gestion_2020.csv' with csv header delimiter '|';