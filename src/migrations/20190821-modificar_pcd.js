'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `ALTER TABLE public.pcd ADD COLUMN fecha_habilitacion date;`
    );
    migration.sequelize.query(sql)
      .finally(done);
  },

  down: (migration, DataTypes, done) => {
    migration.sequelize.query('')
      .finally(done);
  },
};
