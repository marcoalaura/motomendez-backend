var errors = require('../../errors'),
    transform = require('../parsers/transform'),
    i18n = require('../../../lib/i18n');

module.exports = init; 

function init(model) {
    return [
        transform,
        update    
    ];
    
    function update(req, res, next) {
        var body = req.body,
            options = req.options || {}; 

        options.where = options.where || {};
        options.where[model.primaryKeyAttribute] = req.params.id;

        model
            .findOne(options)
            .then(updateAttributes)
            .then(respond)
            .catch(error => {
                res.status(error.statusCode).send(error);
            });
            
        function updateAttributes(row) {
            if (!row) {
                throw new errors.NotFoundError(i18n.t('errors.crud.rowNotFound'));
            } else {
                return row.updateAttributes(body);
            }
        }
        
        function respond(row) {
            res
                .status(200)
                .send(res.transform(row));
        }
    }
}