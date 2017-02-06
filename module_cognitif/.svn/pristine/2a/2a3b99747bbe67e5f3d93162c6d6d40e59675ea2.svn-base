/**
 * Created by atong on 08/08/2016.
 */

module.exports = {
    schema:true,

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        type: {
            type: 'string',
            required: true
        },
        keys: {
            type: 'array'
        },
        entities: {
            type: 'array'
        },

        scenario: {
            model: 'script'
        }
    },


    addVariable: function (obj, cb) {
        Variable.create(obj)
            .exec(cb);
    },

    deleteVariable: function (name, cb) {
        Variable.destroy({name: name}).exec(cb);
    },

    destroyAll : function(cb){
        Variable.destroy().exec(cb);
    }


};