/**
 * Created by rlespagnol on 05/08/2016.
 */

var Filesystem = require('machinepack-fs');

module.exports = {

    /**
     * This function returns a set of variables corresponding to a ScenarioData
     * @param name : name of the ScenarioData
     * @param cb : callback function to be executed once all the tasks are done
     */
    getScenarioData(name, cb){
        var result = {};

        ScenarioData.findOne({name: name}).exec(function (e1, r1) {

            cb(null, r1);
        });

       
    },

    /**
     * This function parses a json object and saves it in the database : ScenarioData, branches, variables
     * @param name : the name of the ScenarioData
     * @param obj : object from the json file
     * @param cb : callback to be executed when the tasks are done
     * @constructor
     */
    JsonToScenarioData: function (name, obj, cb) {


                //add ScenarioData

                ScenarioData.destroy({}).exec(function (err) {
                    if (er){ sails.log.error(er);
                        cb(er,null);
                    }

                    ScenarioData.addScenarioData({name: name}, function (err, ScenarioData) {
                        if (err) cb(err, null);

                        cb(null,ScenarioData);
                    });

             });   
            


        
        
    },

    /**
     * return the branches of the ScenarioData by name
     * @param ScenarioDataName
     * @param cb
     */
    getBranchesByScenarioData: function (ScenarioDataName, cb) {
        ScenarioData.find({name: ScenarioDataName}).exec(function (err, ScenarioData) {
            if (err) cb(err, null);
            if (ScenarioData != null && ScenarioData != undefined && ScenarioData.length > 0) {
                var ScenarioDataID = ScenarioData[0].id;
                var finalBranches = [];
                Branch.find({scenario: ScenarioDataID}).exec(function (error, branches) {
                    if (error) cb(error, null);
                    if (branches != null && branches != undefined && branches.length > 0) {
                        for (var i = 0; i < branches.length; ++i) {
                            finalBranches.push(branches[i]['values']);
                        }
                        cb(null, finalBranches);
                    } else {
                        cb("Branches not found", null);
                    }
                })
            } else {
                cb("ScenarioData not found", null);
            }
        });
    }
};
