var errors = require('../../errors'),
    i18n = require('../../../lib/i18n');

module.exports = init;

function init(model) {
    return [
        remove
    ];
    
    function remove(req, res, next) {
        var options = req.options || {}; 

        options.where = options.where || {};
        options.where[model.primaryKeyAttribute] = req.params.id;

        removeRow(model, options)
        .then(() => {
            res.status(204).send({message: "deleted"});
        }).catch(() => {
            let err = new errors.NotFoundError(i18n.t('errors.crud.rowNotFound'));
            res.status(err.statusCode).send(err);
        });
        
        function removeRow(model, options) {
            return new Promise((resolve, reject) => {
                model.findOne(options)
                .then( row => {
                    if (!row) {
                        reject(false);
                    } else {
                        return row.destroy();
                    }
                })
                .then(() => {
                    resolve(true);
                })
                .catch( error => {
                    reject(false);
                });
            });
        }
    }
}
