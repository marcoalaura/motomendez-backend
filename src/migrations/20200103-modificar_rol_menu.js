'use strict';

module.exports = {
  up: (migration, DataTypes, done) => {
    const sql = (
      `
      -- Habilitación del menu Operaciones/Corte anual
      UPDATE rol_menu
      SET estado = 'ACTIVO'
      WHERE id_rol_menu = 28;

      -- Inhabilitacion del menu Consultas/Corte Anual
      UPDATE rol_menu
      SET estado = 'INACTIVO'
      WHERE fid_menu = 17;

      -- Caso duplicado del corte anual 2019
      UPDATE pcd SET estado = 'INACTIVO' WHERE fid_persona = 57545;

      -- Registrar nuevo municipio DPA
      INSERT INTO public.dpa( cod_municipio, municipio, cod_provincia, provincia, cod_departamento, departamento, id_ubigeo, entidad, id_entidad, estado, _usuario_creacion, _usuario_modificacion, _fecha_creacion, _fecha_modificacion)VALUES ('031304', 'GAIOC del territorio de Raqaypampa', '0313', 'Mizque',  '03', 'Cochabamba', '257', 3301, 728, 'ACTIVO', 1, 1, now(), now());

      -- Actualizamos los registros de tmp_pcd, con los campos gestion_carga, mes_carga
      UPDATE tmp_pcd SET estado_corte_anual = 'HABILITADO', mes_carga = 1, gestion_carga = 2020, _usuario_modificacion = 1, _fecha_modificacion = now() WHERE estado_corte_anual = 'INHABILITADO';

      -- Caso Pedro Vaca
      update log_servicio_sigep set cod_beneficiario = null, estado = 'CREADO' where fid_pcd = 45207;
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
