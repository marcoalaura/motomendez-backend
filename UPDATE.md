## Backend
Ingresar a la carpeta del proyecto backend

> cd centralizador-pcd-backend

Actualizar la rama master.

```
git checkout master
git pull origin master
```

Ejecutar el comando 'npm run funciones' dentro de la carpeta del proyecto:

> NODE_ENV=production npm run funciones  

Adicionar variables adicionales como se puede ver en el ejemplo de config-example.js, en el archivo config.js
```
origen: 'AGEPCD',
```

Reiniciar el servicio o detener el proceso actual instanciado
```
netstat -tlpn
kill -9 XXXX
```
