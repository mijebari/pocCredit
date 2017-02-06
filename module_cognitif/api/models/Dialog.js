/**
 * Created by rlespagnol on 29/04/2016.
 */

module.exports = {
    schema: true,

    attributes: {
        name: {
            type: 'string',
            required: true
        },

        dialog_id: {
            type: 'string',
            required: true
        },
        lang: {
            type: 'string',
            required: true
        },
        toJSON() {
            return this.toObject();
        }
    },

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};
