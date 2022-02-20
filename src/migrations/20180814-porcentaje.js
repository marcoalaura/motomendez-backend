'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `
	CREATE OR REPLACE FUNCTION public.fn_porcentaje(_idPcd integer, _gestion integer, _mes integer)
	  RETURNS integer AS
	$BODY$
	    DECLARE cm RECORD;
	    DECLARE pFechaFin date;
	    DECLARE pFechaInicio date;
	    BEGIN
	      FOR cm IN(select * from certificado where fid_pcd = _idPcd and tipo_certificado = 'SIPRUNPCD' and estado = 'ACTIVO')
	      LOOP
		pFechaFin:=null;	
		SELECT fecha_emision FROM certificado where fid_pcd = cm.fid_pcd and id_certificado > cm.id_certificado and 
			tipo_certificado = 'SIPRUNPCD' and estado = 'ACTIVO' order by id_certificado asc limit 1 INTO pFechaFin;
		if pFechaFin is not null and pFechaFin < cm.fecha_vigencia then
		  pFechaFin:=pFechaFin::date - integer '1';            
		else                    
		  pFechaFin:=cm.fecha_vigencia;          
		end if;

		pFechaInicio:=null;
		SELECT fecha_vigencia FROM certificado where fid_pcd = cm.fid_pcd and id_certificado < cm.id_certificado and 
			tipo_certificado = 'SIPRUNPCD' and estado = 'ACTIVO' order by id_certificado desc limit 1 INTO pFechaInicio;
		if pFechaInicio is not null and pFechaInicio + integer '1' < cm.fecha_emision then          
		  pFechaInicio:=pFechaInicio::date + integer '1';                      
		else          
		  pFechaInicio:=cm.fecha_emision;          
		end if;
		
		if make_date(_gestion, _mes, 20) >= pFechaInicio and make_date(_gestion, _mes, 20) <= pFechaFin then
		  return cm.porcentaje_discapacidad;
		end if;
		         
	      END LOOP;
	      return 0;
	    END;
	  $BODY$
	  LANGUAGE plpgsql
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
