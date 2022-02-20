'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `ALTER TABLE pcd_beneficio_log ALTER COLUMN fid_pcd DROP NOT NULL;
      ALTER TABLE pcd_beneficio_log ADD COLUMN documento_identidad character varying(15);
      ALTER TABLE pcd_beneficio_log ADD COLUMN complemento_documento character varying(20);
      ALTER TABLE pcd_beneficio_log ADD COLUMN fecha_nacimiento date;
      ALTER TABLE pcd_beneficio_log ADD COLUMN nombres character varying(100);
      ALTER TABLE pcd_beneficio_log ADD COLUMN primer_apellido character varying(100);
      ALTER TABLE pcd_beneficio_log ADD COLUMN segundo_apellido character varying(100);
      ALTER TABLE pcd_beneficio_log ADD COLUMN tipo_documento_identidad integer;`
    );
    migration.sequelize.query(sql)
      .finally(done);
  },

  down() {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  },
};
