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
            type: 'json',
            defaultsTo: {}
        },

        branches: {
            type: 'json',
            defaultsTo: []
        }

    },

    addScenarioData: function (obj, cb) {


 ScenarioData.destroy({name:obj.name}).exec(function (err) {
                    if (err){ sails.log.error(er);
                        cb(err,null);
                    }

                            ScenarioData.create(obj).exec(cb);

             });   
            

    },

    deleteScenarioData: function (name, cb) {
        ScenarioData.destroy({name: name}).exec(cb);
    },

    destroyAll : function(cb){
        ScenarioData.destroy().exec(cb);
    }


};