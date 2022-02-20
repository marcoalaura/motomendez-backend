module.exports = (app) => {
  const _app = app;
  _app.dao.autenticacion = {};

  const UsuarioModel = app.src.db.models.usuario;
  const PersonaModel = app.src.db.models.persona;
  const UsuarioRolModel = app.src.db.models.usuario_rol;
  const RolModel = app.src.db.models.rol;
  const RolMenuModel = app.src.db.models.rol_menu;
  const MenuModel = app.src.db.models.menu;
  const DpaModel = app.src.db.models.dpa;

  async function buscarUsuario(condiciones) {
    const data = await UsuarioModel.findOne({
      where: condiciones,
      include: [{
        model: PersonaModel,
        as: 'persona',
        attributes: ['id_persona', 'nombres', 'primer_apellido', 'segundo_apellido'],
      },
      {
        model: DpaModel,
        as: 'dpa',
        attributes: ['municipio'],
        requerid: false,
      }],
    });
    return data;
  }

  async function buscarUsuarioRol(idUsuario) {
    const data = await UsuarioRolModel.findAll({
      attributes: ['fid_rol'],
      where: {
        fid_usuario: idUsuario,
        estado: 'ACTIVO',
      },
      include: [{
        model: RolModel,
        as: 'rol',
        attributes: ['id_rol', 'nombre', 'peso'],
        order: [
          ['peso', 'ASC'],
        ],
      }],
    });
    return data;
  }

  async function buscarRolMenu(fIdRol) {
    const data = await RolMenuModel.findAll({
      attributes: ['method_get', 'method_post', 'method_put', 'method_delete'],
      where: {
        fid_rol: fIdRol,
        estado: 'ACTIVO',
      },
      include: [{
        model: MenuModel,
        as: 'menu',
        attributes: [
          ['nombre', 'label'],
          ['ruta', 'url'],
          ['icono', 'icon'], 'fid_menu_padre',
        ],
        include: [{
          model: MenuModel,
          as: 'menu_padre',
          attributes: ['id_menu', ['nombre', 'label'],
            ['ruta', 'url'],
            ['icono', 'icon'],
          ],
        }],
      }],
    });
    return data;
  }

  _app.dao.autenticacion.buscarUsuario = buscarUsuario;
  _app.dao.autenticacion.buscarUsuarioRol = buscarUsuarioRol;
  _app.dao.autenticacion.buscarRolMenu = buscarRolMenu;
};
