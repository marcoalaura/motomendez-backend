module.exports = app => {
  const config = app.src.config.config;
  if (process.env.NODE_ENV !== "test") {
    app.src.db.sequelize.sync().done(() => {
      if (process.env.FORCE || false) {
        console.log("------------BASE DE DATOS CREADA--------------");
        process.exit(0);
      } else {
        const server = app.listen(app.get("port"), () => {
          console.log(`
               __
             >(\' )
               )/
              /(
             /  \`----/
             \\  ~=- /
           ~^~^~^~^~^~^~^

	              `);
          console.info(`Iniciando servidor en el puerto ${app.get('port')} `);
          console.info(`API ejecutandose en: http://localhost:${app.get('port')}${config.api.main}`);
          console.info(`API-REST(Autogenerado) ejecutandose en: http://localhost:${app.get('port')}${config.api.main}${config.api.crud}`);
        });
        server.timeout = 60000000;
      }
    });
  } else {
    app.src.db.sequelize.sync().done(() => {
      console.log("------------BASE DE DATOS CREADA--------------");
      if (process.env.FORCE || false)
        process.exit(0);
    });
  }
};
