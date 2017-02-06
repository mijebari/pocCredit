/**
 * Created by atong on 08/08/2016.
 */
module.exports = {
    schema:true,

    attributes: {
        name: {
            type:'string',
            required:true
        },

        vars: {
            collection: 'variable',
            via: 'scenario'
        },

        branches: {
            collection: 'branch',
            via: 'scenario'
        }

    },

    addScript: function (obj, cb) {
        Script.create(obj)
            .exec(cb);
    },

    deleteScript: function (name, cb) {
        Script.destroy({name: name}).exec(cb);
    },

    destroyAll : function(cb){
        Script.destroy().exec(cb);
    }


};