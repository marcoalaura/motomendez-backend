# Instalación General en el Servidor

Primeramente se necesita tener instalado ``` Postgres.```

#### Instalando Postgres
Para instalar Postgres se realizaron las instrucciones, basados en el siguiente enlace:
- Para sistemas operativos (Debian v.8)
> https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-9-4-on-debian-8

- Para sistemas operativos (Ubuntu v.16.04)
> https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04

- Para sistemas operativos (Centos 6)
> https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-centos-6

Si no estas seguro de cual es el sistema operativo que tienes instalado o la version puedes saber escribiendo esta linea de comando en la terminal.

```
$ cat /etc/issue
```
Como se indica se ejecutaron los siguientes comandos:
```sh
$ sudo apt-get update
$ sudo apt-get install postgresql-9.5
$ sudo apt-get install postgresql-contrib postgresql-client-9.5
$ ps -ef | grep postgre
```
El último comando sólo es par comprobar la instalación.

##### Problemas en la Autenticación
Fuente:
> http://stackoverflow.com/questions/7695962/postgresql-password-authentication-failed-for-user-postgres

Al conectar con postgres, es posible que dispare el siguiente error:
```sh
$ psql -U postgres
Postgresql: password authentication failed for user “postgres”
ó
psql: FATAL:  la autentificación Peer falló para el usuario «postgres»
```
Si esto es así, se debe verificar los datos del siguiente archivo:
```sh
$ cd /etc/postgresql/9.5/main/
$ sudo nano pg_hba.conf
```
Como indica el enlace, la primera línea no comentada debería estar en peer o ident, en caso de que no sea así cambiarlo a estos valores, luego reiniciar el servicio:
```sh
$ sudo /etc/init.d/postgresql restart
```
Posteriormente, se procede a cambiar los datos del usuario postgres:
```sh
$ sudo -u postgres psql template1
$ ALTER USER postgres PASSWORD 'suContrasenia';
```
Después, volver al archivo de configuración de postgres y cambiar peer por md5:
```sh
$ cd /etc/postgresql/9.5/main/
$ sudo nano pg_hba.conf
```
Ejemplo:
```sh
> # DO NOT DISABLE!
> # If you change this first entry you will need to make sure that the
# database superuser can access the database using some other method.
# Noninteractive access to all databases is required during automatic
# maintenance (custom daily cronjobs, replication, and similar tasks).
#
# Database administrative login by Unix domain socket
local   all             postgres                                md5

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     md5
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
```
Reiniciar el servicio.
```sh
$ sudo /etc/init.d/postgresql restart
```
Con estos cambios ya es posible realizar la conexión con el siguiente comando:
```sh
$ psql -U postgres
Password for user postgres:
psql (9.5.6)
Type "help" for help.

postgres=#
```

## Otros

En la plantilla de la máquina virtual de producción se tuvieron problemas con los certificados, para resolverlo se instaló lo siguiente:

```sh
$ sudo  apt-get install ca-certificates
```

## Build Essentials
Instalar build essentials
```sh
$ sudo apt-get install build-essential libssl-dev
```

## Generación de reportes PDF
```sh
$ sudo apt-get install libfontconfig1
```

## GIT
Para la instalación de git se siguieron algunas instrucciones de la siguiente página:

- Para sistemas operativos (Debian v.8)
> https://www.digitalocean.com/community/tutorials/how-to-install-git-on-debian-8

- Para sistemas operativos (Ubuntu v.16.04)
> https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-16-04

- Para sistemas operativos (Centos v.6)
>https://www.digitalocean.com/community/tutorials/how-to-install-git-on-a-centos-6-4-vps

Como se indica se siguieron las siguientes instruciones
```sh
$ sudo apt-get update
$ sudo apt-get install git-core
```

Es posible configurar los nombres de usuarios:
```sh
$ git config --global user.name "usuario"
$ git config --global user.email usuario@agetic.gob.bo
$ git config --list
```

El último comando es para verificar que se haya guardado la configuración realizada.

### Generar SSH key
Si aún no se cuenta con una llave SSH para la conexión a GIT, seguir los siguientes pasos:
Para la generación de la llava SSH se siguieron los pasos del siguiente enlace:
> https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/

```sh
$ ssh-keygen -t rsa -b 4096 -C "usuario@agetic.gob.bo"
```

Para verificar la creación de la llave SSH navegar al siguiente directorio:
```sh
$ cd /home/nombre_usuario/.ssh/
```

La llave se encontrará en el archivo `id_rsa.pub`;

Copiar el contenido del archivo en la respectiva cuenta del GITLAB para la autenticación.

> **Profile Settings** >> **SSH Keys**

## Curl y Wget

Si no se tiene instalado el curl y el wget, instalarlos.

```sh
$ sudo  apt-get install curl
$ sudo  apt-get install wget
```

## Instalación NVM, Node y NPM

Desinstalar alguna versión existente de nvm:
```
$ sudo rm -rf $NVM_DIR ~/.npm
```
Salir de la terminal:
> **CTRL** + **d** , **CTRL** + **c** o **exit**

Descargar el instalador de nvm y renombrarlo con "install_nvm.sh":
```
$ curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.24.0/install.sh -o install_nvm.sh
```

Verifica su existencia si el archivo se descargó satisfactoriamente:
```
$ nano install_nvm.sh
```

Ejecuta el instalador
```
$ bash install_nvm.sh
```

Reiniciar la consola para que surtan efecto los cambios
> **CTRL** + **d** , **CTRL** + **c** o **exit**

Verificar la existencia de nvm
```
$ nvm --version
```

Descargar la versión de node deseada **(la versión LTS)**:
```
$ nvm install 6.10.1
```

`**NOTA**`
Es posible que posteriormente se tenga el siguiente problema al tratar de levantar la aplicación:
```
/usr/bin/env: node: No such file or directory
```

**`Sólo si se tuviera dicho problema, ejecutar lo siguiente:`**
```sh
$  which node # Devolverá por ejemplo:
/home/usuario/.nvm/versions/node/v6.10.1/bin/node
 $ sudo ln -s "$(which node)" /usr/bin/node
```

NOTA: De acuerdo a la distribución/versión del sistema operativo el comando which puede variar de `which node` a `which nodejs`.

#### Indicar que version usaremos

Para ello usaremos la siguiente linea de comando
```
$ nvm use 6.10
```

#### Instalar npm
Para instalar npm:
```
$ sudo apt-get install npm
```

## Paquetes NPM
Instalar de manera global:
```sh
$ npm install --global eslint
$ npm install --global apidoc
$ npm install --global yo bower gulp
$ npm install --global sequelize sequelize-cli
$ npm install --global pg pg-hstore
$ npm install --global nodemon
```

## Instalación necesaria para pruebas

Para ejecutar los tests, necesitamos instalar mocha de manera global:
```
$ npm install -g mocha
```

## Automatización de procesos
Para automatizar la ejecución de la aplicación se utilizó **Supervisor**.

```sh
$ sudo apt-get install supervisor
```
Para probar la correcta instalación del servicio se puede ejecutar el siguiente comando:
```sh
$ sudo /etc/init.d/supervisor restart
```
El servicio debería reiniciarse sin problemas.
