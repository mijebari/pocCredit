/**
 * Created by atong on 11/08/2016.
 */

module.exports = {

    schema:true,

    attributes: {
        default_context: {
            type: 'json'
        },
        tests: {
            type:'array'
        }
    },

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};

