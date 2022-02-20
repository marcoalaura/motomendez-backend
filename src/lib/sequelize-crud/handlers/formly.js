var tipos = {
    "INTEGER":{//INTEGER
        "fieldType": "input",
        "templateType": "number",
    },
    "CHARACTER VARYING":{//STRING
        "fieldType": "input",
        "templateType": "text",
    },
    "CHARACTER":{//CHAR
        "fieldType": "input",
        "templateType": "text",
    },
    "TEXT":{//TEXT
        "fieldType": "textarea",
        "templateType": "",
    },
    "BIGINT":{//BIGINT
        "fieldType": "input",
        "templateType": "number",
    },
    "DOUBLE PRECISION":{//FLOAT, DOUBLE
        "fieldType": "input",
        "templateType": "number",
        'step': 'any',
    },
    "REAL":{//REAL
        "fieldType": "input",
        "templateType": "number",
    },
    "NUMERIC":{//DECIMAL
        "fieldType": "input",
        "templateType": "number",
    },
    "BOOLEAN":{//BOOLEAN
        "fieldType": "checkbox",
        "templateType": "",
    },
    "TIME WITHOUT TIME ZONE":{//TIME
        "fieldType": "input",
        "templateType": "time",
    },
    "TIMESTAMP WITH TIME ZONE":{//DATE
        //"fieldType": "input",
        "fieldType": "datepicker",
        "templateType": "datetime-local",
    },
    "DATE":{//DATEONLY
        //"fieldType": "input",
        "fieldType": "datepicker",
        "templateType": "date",
    },
    "JSON":{//JSON
        //"fieldType": "input",
        "fieldType": "textarea",
        "templateType": "",
    },
    "BYTEA":{//BLOB
        "fieldType": "textarea",
        "templateType": "",
    },
    "USER-DEFINED":{//ENUM
        "fieldType": "select",
        "templateType": "",
    },
};

function formly(modelo, app_modelos) {
    app_modelos = app_modelos || [];
    return function (req, res, next) {
        getDescribe(modelo, app_modelos)
            .then(function (response) {
                res.json(response);
            }, function (error) {
                res.json({error: error});
            });
    };
}

function getDescribe(modelo, app_modelos) {
    return new Promise(function (resolve, reject) {
        modelo.describe().then(function (fields) {
            var xconfig = modelo.rawAttributes;
            var xformly = [];
            var promises = [];
            for (var field in fields) {
                var dataField = fields[field];
                //console.log(dataField);

                var formlyField = {
                    "key": getXAttribute(xconfig, field, 'fieldName'),
                    "type": tipos[dataField.type].fieldType,
                    "templateOptions": {
                        "type": tipos[dataField.type].templateType,
                        "label": getXAttribute(xconfig, field, 'xlabel'),
                        "required": !dataField.allowNull
                    }
                };
                if (dataField.type == "USER-DEFINED"){
                    var ud_options = [];
                    for (var dopt in dataField.special){
                        ud_options.push({"name":dataField.special[dopt], "value":dataField.special[dopt]});
                    }
                    //console.log(ud_options);
                    formlyField.templateOptions.options = ud_options;
                }
                promises.push(getChoises(xconfig, field, app_modelos));
                xformly.push(formlyField);
            }

            Promise.all(promises).then(function(values) {
                var filters = values.filter(function (e) { return e.field != 'empty'; });
                for (var i in xformly) {
                    var data = findField2(filters, xformly[i].key);
                    if (data) {
                        xformly[i].type = "select";
                        xformly[i].templateOptions.options = data.options;
                    }
                }
                resolve(xformly);
            }, function(error) {
                console.log(error);
                reject('Se produjo un error:' + JSON.stringify(error));
            });

        });
    });

}

function findField(xconfig, fieldDB){
    for(var i in xconfig){
        if(xconfig[i].field == fieldDB){
            return xconfig[i];
        }
    }
    return [];
}

function findField2(xconfig, fieldDB){
    for(var i in xconfig){
        if(xconfig[i].field == fieldDB){
            return xconfig[i];
        }
    }
    return null;
}

function getXAttribute(xconfig, field, attribute) {
    var xfield = field;
    var xconfig_find = findField(xconfig, field);
    if (attribute in xconfig_find) {
        xfield = xconfig_find[attribute];
    }
    return xfield;
}

function getChoises (xconfig, field, app_modelos) {
    return new Promise(function (resolve, reject) {
        var rchoice = [];
        var xconfig_find = findField(xconfig, field);
        if ('references' in xconfig_find) {
            var rmodel = xconfig_find.references.model;
            var rkey = xconfig_find.references.key;
            var xchoice = 'xchoice' in xconfig_find ? xconfig_find.xchoice : "";
            if(xchoice === "" && 'references' in xconfig_find){
                xchoice = 'xchoice' in xconfig_find.references ? xconfig_find.references.xchoice : "";
            }
            //console.log("******************************>", xchoice);

            //datos de
            var xconfig_rel = app_modelos[rmodel.tableName || rmodel].rawAttributes;//var xconfig_rel = app_modelos[rmodel].rawAttributes; //

            app_modelos[rmodel.tableName || rmodel].findAll().then(function(items){//app_modelos[rmodel].findAll().then(function(items){
                for(var item in items){
                    var xconfig_rkey = findField(xconfig_rel, rkey);
                    rchoice.push({
                        //"name": objxcat(items[item], xchoice.references.xchoice),
                        "name": objxcat(items[item], xchoice),
                        "value": items[item][xconfig_rkey.fieldName]
                    });
                }
                resolve({field: field, options: rchoice});
            });
        } else {
            resolve({field: 'empty', options: []});
        }
    });
}


function objxcat(obj, parametros){
    var concatenar = "";
    parametros.split("+").forEach(function(item){
        concatenar += obj[item.trim()]+' ';
    });
    return concatenar.trim();
}

module.exports = formly;