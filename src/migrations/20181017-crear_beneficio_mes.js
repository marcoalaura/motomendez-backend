'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {

    const sql = (
      `
CREATE TABLE pcd_beneficio_mes
(
  id_pcd_beneficio_mes serial NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_fin date NULL,
  descripcion text,
  observacion text,
  estado character varying(30) NOT NULL DEFAULT 'ACTIVO'::character varying,
  nit bigint,
  matricula bigint,
  tipo character varying(30) NOT NULL DEFAULT 'DIRECTO'::character varying,
  mes integer NOT NULL,
  _usuario_creacion integer NOT NULL,
  _usuario_modificacion integer,
  _fecha_creacion timestamp with time zone NOT NULL,
  _fecha_modificacion timestamp with time zone NOT NULL,
  fid_pcd integer NOT NULL,
  fid_beneficio integer NOT NULL,
  fid_tutor_ovt integer,
  fid_gestion integer NOT NULL,  
  PRIMARY KEY (id_pcd_beneficio_mes),
  FOREIGN KEY (fid_beneficio) REFERENCES beneficio(id_beneficio),
  FOREIGN KEY (fid_gestion) REFERENCES gestion(id_gestion),
  FOREIGN KEY (fid_pcd) REFERENCES pcd(id_pcd),
  FOREIGN KEY (fid_tutor_ovt) REFERENCES tutor_ovt(id_tutor_ovt)
);

alter table pcd_beneficio_log add mes int null;
alter table pcd_beneficio_log add fid_gestion int null;
alter table pcd_beneficio_log add modalidad_contrato character varying(30) null;

UPDATE menu SET nombre = 'HABILITADOS GENERAL' WHERE id_menu = 20;
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
