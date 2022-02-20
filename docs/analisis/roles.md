## Roles

| **ROL** | **DESCRIPCIÓN** | **ENTIDAD** |
|---|---|---|
| ADMIN | Super administrador del sistema | MTEPS |
| MINISTERIO | Responsable de la administración del sistema y generación de las listas de bonos | MTEPS |
| MUNICIPIO | Rol de los municipios para ver datos de bonos mensuales de su propio municipio | GAM |
| CONSULTA | Rol de consulta de habilitaciones anuales y mensuales | |
| SERVICIO_OVT | Rol habilitado para servicios del OVT | MTEPS |
| SALUD | Responsable de realizar correcciones de datos obtenidos del SIPRUNPCD | Ministerio de Salud|
| IBC | Responsable de realizar correcciones de datos obtenidos del SICOA | IBC |
| ECONOMIA | Rol con permiso de descarga de datos del corte anual | MEFP |

* MTEPS - Ministerio de Trabajo, Empleo y Previsión Social
* IBC - Instituto Boliviano de la Ceguera
* MEFP - Ministerio de Economía y Finanzas Públicas
* GAM - Gobierno Autónomo Municipal

## Permisos

| **FUNCIÓN/ROL** | **ADMIN** | **MINISTERIO** | **MUNICIPIO** | **CONSULTA** | **SALUD** | **IBC** | **ECONOMIA** |
|---|---|---|---|---|---|---|---|
|Gestión de usuarios|X|X||||||
|Ver datos de PCD||X||X||||
|Modificar datos de PCD||X||||||
|Registro de tutores||X|X|||||
|Reporte corte anual||X||||||
|Reporte habilitados mensual||X|X|X||||
|Reporte observados mensual||X|X|X||||
|Reporte habilitados general||X|X|X||||
|Listado corte anual||X||||||
|Descargar csv corte anual|||||||X|
|Registrar cambio de municipio||X|X|||||
|Descargar csv cambio de municipio||X||||||
|Listado SIPRUNPCD-IBC||X|||X|X||
|Modificar SIPRUNPCD-IBC|||||X|X||
|Operaciones corte anual||X||||||
|Operaciones corte mensual||X||||||
|Soporte|||X|||||
