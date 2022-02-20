'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {

    const sql = (
      `CREATE TABLE public.domicilio
      (
        id_domicilio serial NOT NULL,
        gestion integer NOT NULL,
        documento_identidad character varying(25) NOT NULL,
        fecha_nacimiento date NOT NULL,
        direccion character varying(300) NOT NULL,
        ci_solicitante character varying(25),
        solicitante character varying(500),
        documento_siprun character varying(100) NOT NULL,
        documento_factura character varying(100),
        estado character varying(30) NOT NULL DEFAULT 'ACTIVO'::character varying,
        _usuario_creacion integer NOT NULL,
        _usuario_modificacion integer,
        _fecha_creacion timestamp with time zone NOT NULL,
        _fecha_modificacion timestamp with time zone NOT NULL,
        cod_municipio_nuevo character varying(6) NOT NULL,
        cod_municipio_vigente character varying(6) NOT NULL,
        fid_pcd integer NOT NULL,
        fid_persona integer NOT NULL,
        CONSTRAINT domicilio_pkey PRIMARY KEY (id_domicilio),
        CONSTRAINT domicilio_cod_municipio_nuevo_fkey FOREIGN KEY (cod_municipio_nuevo)
            REFERENCES public.dpa (cod_municipio),
        CONSTRAINT domicilio_cod_municipio_vigente_fkey FOREIGN KEY (cod_municipio_vigente)
            REFERENCES public.dpa (cod_municipio),
        CONSTRAINT domicilio_fid_pcd_fkey FOREIGN KEY (fid_pcd)
            REFERENCES public.pcd (id_pcd),
        CONSTRAINT domicilio_fid_persona_fkey FOREIGN KEY (fid_persona)
            REFERENCES public.persona (id_persona),
        CONSTRAINT domicilio_gestion_documento_identidad_fecha_nacimiento_key UNIQUE (gestion, documento_identidad, fecha_nacimiento)
      )
      WITH (
        OIDS=FALSE
      );`
   );
    migration.sequelize.query(sql)
      .finally(done);
  },

  down: (migration, DataTypes, done) => {
    migration.sequelize.query('')
      .finally(done);
  },
};
