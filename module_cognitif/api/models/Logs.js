/**
 * Created by rlespagnol on 22/08/2016.
 */
module.exports = {
    schema: true,

    attributes: {
        conversation_id: {
            type: 'string',
            required: true
        },

        user_input : {
            type: 'string',
            required: true
        },
        output: {
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
