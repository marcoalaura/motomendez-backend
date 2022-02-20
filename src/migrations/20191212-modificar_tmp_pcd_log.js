'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `
      ALTER TABLE tmp_pcd_log 
      ADD COLUMN id SERIAL PRIMARY KEY;

      ALTER TABLE tmp_pcd_log
      ADD COLUMN tipo_caso VARCHAR(30);

      UPDATE tmp_pcd_log
      SET tipo_caso = 'TMPPCD';
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
