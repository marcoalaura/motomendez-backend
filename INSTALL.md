# Proyecto Base Backend

Despues de ejecutar las instrucciones para instalar el gestor de base de datos `postgres` descritos paso a paso en el archivo ([SERVER.md](SERVER.md)).

#### Pasos para instalar GIT

- Para sistemas basados en UNIX
> Revisar como se realiza la instalacion y configuracion en ([SERVER.md](SERVER.md))

Despues de tener lo basico necesitamos instalar nuestra aplicación

#### Creación de la Base de Datos
Se debe crear la base de datos para la ejecución del backend, para ello conectarse con el siguiente comando:
```sh
$ psql -U postgres -h localhost
psql (9.5.4)
SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
Type "help" for help.

postgres=#
```
Crear un usuario que adiministre la base de datos del sistema:
```sh
postgres=# CREATE USER user_centralizador_pcd WITH PASSWORD 'user_centralizador_pcd';
CREATE ROLE
```
Luego creamos la base de datos:
```sh
postgres=# CREATE DATABASE centralizador_pcd_db WITH OWNER user_centralizador_pcd;
CREATE DATABASE
```
Asignamos todos los privilegios al usuario creado:
```sh
postgres=# GRANT ALL PRIVILEGES ON DATABASE centralizador_pcd_db to user_centralizador_pcd;
GRANT
```
#### Instalación

Para instalar el proyecto:

Clonarlo:

**Opción 1:** Si se generó llave SSH: (En los pasos del archivo SERVER.md)
```sh
$ git clone git@gitlab.geo.gob.bo:agetic/centralizador-pcd-backend.git
```

**Opción 2:** Si se quiere clonar el proyecto por HTTPS:
```sh
$ git clone https://gitlab.geo.gob.bo/agetic/centralizador-pcd-backend.git
```
Es posible que al descargar el proyecto con HTTPs, nos lance el siguiente error:
```sh
Cloning into 'nombre-del-proyecto'...
fatal: unable to access 'https://url-del-proyecto.git/': server certificate verification failed. CAfile: /etc/ssl/certs/ca-certificates.crt CRLfile: none
```
```sh
$ git config --global http.sslverify false
$ git clone https://gitlab.geo.gob.bo/agetic/centralizador-pcd-backend.git

Ingresar a la carpeta:
```sh
$ cd centralizador-pcd-backend
```
Podemos verificar que estamos en el branch master:

```
$ git status
```
Nos devolverá:
```
On branch master
```
(Opcional) Si necesitamos trabajar un branch específico (en este ejemplo, el nombre del branch es `branch_copia_master`) ejecutamos:

```
$ git checkout branch_copia_master
```

Al volver a verificar con git status:
```
$ git status
```

Se obtiene como respuesta que el proyecto se sitúa en el branch elegido:
```
On branch branch_copia_master
```

Para instalar la aplicación, se tienen las siguientes opciones:

#### Instalar dependencias del proyecto

Ejecutar el comando npm install que instalará todas las dependencias que el proyecto necesita:
```
$ npm install
```

#### Archivos de Configuración

Para modificar los datos de conexion a la base de datos realizar una copia del archivo `src/config/config-example.json` y cambiar los datos de conexión a la base de datos respectiva, el archivo debería ser nombrado de la siguiente manera:

- `src/config/config.json`

Es importante cambiar lo siguiente:
- `username - nombre de usuario de la base de datos`
- `password - contraseña del usuario de la base de datos`
- `database - nombre de la base de datos`
- `host - servidor donde se encuentra la base de datos`
- `demás variables`

##### Archivo de configuracion de variables del sistema y servicios de interoperabilidad

Duplicar el archivo config-example.js y renombrarlo bajo el nombre config.js.
Configurar las variables necesarias de acuerdo al ambiente en el que se hará correr la aplicación.

Ejemplo:

```sh
urlConfirmarCuenta: 'http://localhost:8888/#!/confirmarCuenta/',
```

##### Configuración de Correo

Es posible hacer levantar la configuración de correo de dos formas:

**Opción 1. Solicitar a infraestructura que agregue el IP donde correrá el sistema backend a su lista para que puedan salir nuestros correos, además: (GENERALMENTE PARA PRODUCCIÓN)**

- En el archivo config/config.js colocar en la variable respectiva de correo:

```sh
"correo": {
      "origen": "centralizadorpcd@agetic.gob.bo",
      "host":"localhost",
      "port":25,
      "secure":false,
      "tls": {
        "rejectUnauthorized": false
      }
    }
```

- Instalar postfix, en la instalación, seleccionar los valores por defectos

```sh
$ sudo apt-get install postfix
```

- Modificar la variable `relayhost` del archivo `/etc/postfix/main.cf`

```sh
$ sudo nano /etc/postfix/main.cf
```

- Llenar con el IP que indique infraestructura, ejemplo 192.168.15.15:

```sh
relayhost = 192.168.15.15
```

**Opción 2. Configurar los correos con una cuenta personal:**

- Llenar la variable auth, con la credenciales de un correo personal.
```sh
"correo": {
     "origen": "usuario@agetic.gob.bo",
     "host":"smtp.agetic.gob.bo",
     "port":587,
     "secure":false,
     "tls": {
       "rejectUnauthorized": false
     },
     "auth": {
       "user": "usuario@agetic.gob.bo",
       "pass": "micontrasena"
     }
   }
```

##### Servicio Web SEGIP

Este proyecto realiza el consumo del servicio web del SEGIP, para obtener y validar los datos de las personas que se registren en el sistema. En el archivo config/config.js se encuentra bajo el nombre de servicio `segip`.

```sh
segip: {
  url: 'https://test.agetic.gob.bo/kong/fake2',
  path: '/segip/v2/',
  credenciales: {
    apikey: '383a0f19857f4dde885271725bdc1f20',
  },
  tokenKong: 'Bearer <-- solicitar el token a interoperabilidad -->',
},
```
##### Servicio Web SIPRUNPCD
Este proyecto realiza el consumo del servicio web del SIPRUMPCD, para obtener y validar los datos de las personas con discapacidad que se registren en el sistema. En el archivo config/config.js se encuentra bajo el nombre de servicio `siprumpcd`.
```sh
siprunpcd: {
  url: 'http://192.168.21.61:5000',
  path: '/api/v2/pcd2/',
  token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IntcImZlY2hhXCI6XCIyMDE4LTExLTE2VDIxOjUwOjI0LjQyM1pcIixcImRpblwiOjB9Ig.msd-robFcWD7rVuIsrwf4ANQvzzVrDsywbRMGI6HWVI',
},
```
##### Servicio Web IBC
Este proyecto realiza el consumo del servicio web del IBC, para obtener y validar los datos de las personas con discapacidad que se registren en el sistema. En el archivo config/config.js se encuentra bajo el nombre de servicio `ibc`.
```sh
ibc: {
      url: 'http://localhost:5005',
      path: '/api/v1/',
      token: 'Beare eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IntcImZlY2hhXCI6XCIyMDE4LTEyLTA0VDE4OjQxOjQ1LjgxMlpcIixcImRpblwiOjB9Ig.XjOtvrkIs0_vopvfi5-htn0En0OKkqlDM6j2bHFibvU',
    },
```
##### Servicio Web OVTPARCHE
Este proyecto realiza el consumo del servicio web del OVTParche, para obtener y validar los datos de las personas con discapacidad o tutores de personas con discapacidad que cuenten con inamovilidad laboral. En el archivo config/config.js se encuentra bajo el nombre de servicio `ovtParche`.
```sh
ovtParche: {
  url: 'http://localhost:5000',
  path: '/api/v1/empleado/reporte/',
  token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZF91c3VhcmlvIjoxLCJ1c3VhcmlvIjoiYWRtaW4iLCJpZF9wZXJzb25hIjpudWxsLCJpZF9yb2wiOjEsIm5pdCI6bnVsbCwic2VjcmV0IjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5Sm1aV05vWVNJNklqSXdNVGN0TVRFdE1qTlVNak02TXprNk5Ua3RNRFE2TURBaUxDSmpiR0YyWlNJNklubzJOWEI2WVc5eUluMC5zQzhvXzc5Q2FzZ0xwNGpYRDVuM1NKT2MwRFBWbWtKeXhFMTNLVF9LbXhzIiwiY2xhdmUiOiI2aHM4eGd2aSJ9.wOzeVqIRDXvV_C4ZzkGJfz15ZnRakBcNSANc-Sng-7c',
},
```
##### **`Sólo para ambiente de producción`**

Para configurar el ambiente de producción de forma global en la máquina en donde se vaya a instalar la aplicación es necesario ejecutar el siguiente comando en la consola:
```sh
$ export NODE_ENV=production
```

## Iniciar la aplicación

Las opciones de ejecución son las siguientes:
+ Genera o regenera las tablas necesarias en la base de datos y ejecuta los seeders y migrations.
```
$ npm run setup
```

+ Levanta el sistema en modo developer, se reinicia en cada cambio realizado en los archivos..
```
$ npm run startdev
```
+ Levanta el sistema en modo normal
```
$ npm run start
```
+ Ejecuta el eslint para verificar el estandar de programacion, actualmente esta basado en: (https://github.com/airbnb/javascript).
```
$ npm run lint
```
+ Genera la documentacion del sistema
```
$ npm run apidoc
```

##### RAM

NodeJS por defecto utiliza 1.76GB en máquinas de 64 bits, para aumentar este parámetro es necesario utilizar el siguiente comando: "--max_old_space_size=".

Para hacer esto, se debe modificar el archivo package.json, en la opción start, línea 7 aproximadamente, por ejemplo para utilizar 4GB de RAM cambiar por:

```sh
...
...
  "scripts": {
    "start": "babel-node --max_old_space_size=4096 index.js",
    ...
  }
...
...
```
Referencia:
> http://prestonparry.com/articles/IncreaseNodeJSMemorySize/


## Configuración de supervisor
Si se desea hacer correr la aplicación mediante `supervisor` se debe realizar la siguiente configuración:

Navegar hasta la ruta:
```sh
$ cd /etc/supervisor/conf.d/
```
Crear un archivo para hacer correr la aplicación de backend, en este ejemplo, se definirá el archivo bajo el nombre de `centralizadorPcdBackendDEV`:
```sh
$ sudo touch centralizadorPcdBackendDEV.conf
```
Nota
- Si no te no te permite modificar el archivo centralizadorPcdBackendDEV.conf
```
$ sudo chmod 777 centralizadorPcdBackendDEV.conf
```
Y colocar el siguiente contenido:

##### Ambiente de desarrollo

```sh
[program:centralizadorPcdBackendDEV]
command=/home/usuario/.nvm/versions/node/v6.10.1/bin/npm start
directory=/home/usuario/centralizador-pcd-backend
autostart=true
autorestart=true
stderr_logfile=/var/log/centralizadorPcdBackendDEV.err.log
stdout_logfile=/var/log/centralizadorPcdBackendDEV.out.log
user=usuario
```

##### Ambiente de test

```sh
[program:centralizadorPcdBackendTEST]
command=/home/usuario/.nvm/versions/node/v6.10.1/bin/npm start
directory=/home/usuario/centralizador-pcd-backend
autostart=true
autorestart=true
environment=NODE_ENV=test
stderr_logfile=/var/log/centralizadorPcdBackendTEST.err.log
stdout_logfile=/var/log/centralizadorPcdBackendTEST.out.log
user=usuario
```

##### Ambiente de producción

```sh
[program:centralizadorPcdBackend]
command=/home/usuario/.nvm/versions/node/v6.10.1/bin/npm start
directory=/home/usuario/centralizador-pcd-backend
autostart=true
autorestart=true
environment=NODE_ENV=production
stderr_logfile=/var/log/centralizadorPcdBackend.err.log
stdout_logfile=/var/log/centralizadorPcdBackend.out.log
user=usuario
```

##### Reiniciar "supervisor"
Cuando se hagan cambios y se requiere reiniciar el servicio "supervisor" para que se ejecute la aplicación:
```sh
$ sudo /etc/init.d/supervisor restart
```
Para verificar que la aplicación este efectivamente corriendo, se puede ejecutar el siguiente comando, y verificar que la aplicación este corriendo en el puerto configurado:
```sh
$ netstat -ltpn

Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      -               
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      -               
tcp        0      0 0.0.0.0:5432            0.0.0.0:*               LISTEN      -               
tcp6       0      0 :::4000                 :::*                    LISTEN      32274/nodejs
tcp6       0      0 :::3000                 :::*                    LISTEN      4381/gulp
```

Ó se puede revisar las tareas del `supervisor`, buscar el nombre de la tarea y su respectivo estado:

```sh
$ sudo supervisorctl

centralizadorPcdBackendDEV                   RUNNING    pid 4617, uptime 3 days, 21:41:05
```
