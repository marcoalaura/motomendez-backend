## Sistema Centralizador de personas con discapacidad

\- Backend. [https://gitlab.agetic.gob.bo/agetic/centralizador-pcd-backend](https://gitlab.agetic.gob.bo/agetic/centralizador-pcd-backend)

\- Frontend. [https://gitlab.agetic.gob.bo/agetic/centralizador-pcd-frontend](https://gitlab.agetic.gob.bo/agetic/centralizador-pcd-frontend)

## **Descripción**

La Plataforma "Eustaquio Moto Méndez" (PEMM), fue desarrollada con el fin de generar reportes anuales y reportes mensuales necesarios para que se efectúe el pago del bono mensual a las personas con discapacidad grave y muy grave.

## Módulos

Es proyecto contiene los siguientes módulos:

*   PCD y tutores
*   Listado de bonos (anual, mensual)
*   Cambio de municipio
*   Consultas
*   Gestión de usuarios
*   Operaciones (anual, mensual)

## **Tecnologías**

Se utilizan las siguientes tecnologías principalmente:

*   Lenguaje: JavaScript
*   Framework MVC: AngularJS 1.6.1
*   Framework de diseño: Bootstrap 4.0.0
*   Entorno en tiempo de ejecución: Node.js v6.9
*   Framework para aplicaciones web: Express ^4.13.4
*   Framework ORM: Sequelize 3.21.0
*   Base de Datos: PostgreSQL 9.6

## **Interoperabilidad y Sistemas Interdependientes**

Se conecta con los siguientes servicios o sistemas:

*   Interoperabilidad con SEGIP, para contrastar datos personales de los beneficiarios.
*   Interoperabilidad con SIPRUNPCD (Ministerio de Salud), para obtener datos de las personas con discapacidad.
*   Interoperabilidad con SICOA (Instituto Boliviano de la Ceguera), para obtener datos de las personas con discapacidad.
*   Interoperabilidad con OVT (Ministerio de Trabajo), para obtener datos de personas con discapacidad con inserción laboral.
*   Interoperabilidad con MEFP (Ministerio de Econoía y Finanzas Públicas), para registrar beneficiarios y bonos ([https://test.agetic.gob.bo/documentacion/iop-servicios-mefp-v1/](https://test.agetic.gob.bo/documentacion/iop-servicios-mefp-v1/))

Ofrece los siguientes servicios para sistemas externos:

*   Servicio de consulta de bonos para el portal de ciudadanía digital.

## Documentación

La documentación del proyecto se encuentra de acuerdo al siguiente detalle:

<!-- *   [Modelo de objetos](docs/analisis/modelo_de_objetos.png) -->
*   [Diagrama de base de datos](docs/analisis/modelo_de_bd.png)
*   [Diccionario de datos](docs/analisis/diccionario-datos.pdf)
*   [Roles y permisos](docs/analisis/roles.md)

## Documentación APIs

La documentación de las APIs se pueden encontrar en la siguiente URL:

*   [Documentación](https://test.agetic.gob.bo/motomendez-api/apidoc/)

## Instalación

Los pasos para la instalación del proyecto se encuentran en la siguiente URL:

*   [INSTALL.md](INSTALL.md)
