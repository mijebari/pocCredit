/**
 * Created by rlespagnol on 05/08/2016.
 */

var Filesystem = require('machinepack-fs');

module.exports = {

    /**
     * This function returns a set of variables corresponding to a script
     * @param name : name of the script
     * @param cb : callback function to be executed once all the tasks are done
     */
    getScript(name, cb){
        var result = {};

        Script.findOne({name: name}).populate('branches').populate('vars').exec(function (e1, r1) {
            if (e1) return cb(e1, result)

            var vars = r1.vars;
            var branches = r1.branches;

            _.forEach(vars, function (myVar) {
                var varName = myVar['name'];
                //delete some useless fields of the object Variable
                delete myVar['name'];
                delete myVar['id'];
                delete myVar['scenario'];
                delete myVar['createdAt'];
                delete myVar['updatedAt'];
                result[varName] = myVar;
            });

            var finalBranches = []
            _.forEach(branches, function (branche) {
                finalBranches.push(branche.values);
            })

            result['branches'] = finalBranches;

            cb(null, result);
        })

        // var finalObj = {};
        // Script.findOne({name: name}).exec(function (err, script) {
        //     if (err) throw error;
        //
        //     if (script != null && script != undefined) {
        //         var id = script.id;
        //
        //         aync.parallel([
        //             function (_cb) {
        //                 //find the variables
        //                 Variable.find({scenario: id}).exec(function (error, vars) {
        //                     if (error) _cb(error, null);
        //                     async.each(vars, function (myVar, callback) {
        //                         var varName = myVar['name'];
        //                         //delete some useless fields of the object Variable
        //                         delete myVar['name'];
        //                         delete myVar['id'];
        //                         delete myVar['scenario'];
        //                         delete myVar['createdAt'];
        //                         delete myVar['updatedAt'];
        //                         finalObj[varName] = myVar;
        //                         _cb(null, null);
        //                     }, function (err) {
        //                         if (err) sails.log.error(err);
        //                         callback(null, finalObj);
        //                     });
        //                 });
        //             },
        //             function (callback) {
        //                 var finalBranches = [];
        //                 Branch.find({scenario: id}).exec(function (error, branches) {
        //                     if (error) cb(error, null);
        //                     if (branches != null && branches != undefined && branches.length > 0) {
        //                         for (var i = 0; i < branches.length; ++i) {
        //                             finalBranches.push(branches[i]['values']);
        //                         }
        //                         finalObj['branches'] = finalBranches;
        //                         callback(null, finalObj);
        //                     } else {
        //                         callback("Branches not found", null);
        //                     }
        //                 })
        //             }
        //         ], function (err, result) {
        //             cb(err, result)
        //         });
        //
        //     } else {
        //         cb("Error : script not found!", null);
        //     }
        // });
    },

    /**
     * This function parses a json object and saves it in the database : script, branches, variables
     * @param name : the name of the script
     * @param obj : object from the json file
     * @param cb : callback to be executed when the tasks are done
     * @constructor
     */
    JsonToScript: function (name, obj, cb) {
sails.log("SCRIPT SERVICE");
        //look in the db if a script with the same exists already
        Script.find({name: name}).exec(function (er, oldScript) {
            if (er) sails.log.error(er);

            //if there's no duplicated script in the db
            if (oldScript == null || oldScript == undefined || oldScript.length == 0) {
                var keys = Object.keys(obj);
                //add script
                Script.addScript({name: name}, function (err, script) {
                    if (err) cb(err, null);

                    async.each(keys, function (key, callback) {

                        if (key == "branches") { //if branches
                            var branches = obj["branches"]; // branches is an array of array
                            //create branch objects by iterating
                            async.each(branches, function (branchArray, callb) {
                                var branch = {values: branchArray};
                                branch['scenario'] = script.id; //relation many-to-one with script
                                Branch.addBranch(branch, function (e, r) {
                                    if (e) callb(e, null);
                                    callb(null, null);
                                });
                            }, function (err, result) {
                                if (err) callback(err, null);
                                callback(null, null);
                            });
                        } else { //if variables
                            // create the object Variable
                            var variable = obj[key];
                            variable['name'] = key; //name of the variable
                            variable['scenario'] = script.id; //relation many-to-one with script

                            Variable.addVariable(variable, function (err, res) {
                                if (err) callback(err, null);
                                callback(null, null);
                            });
                        }
                    }, function (err, res) {
                        if (err) {
                            sails.log.error(err);
                        } else {
                            console.log("JSON file successfully parsed!");
                            cb();
                        }
                    });

                });
            } else {
                //if a script with the same name is found in the db
                //delete this script
                Script.destroy({name: name}).exec(function (err) {

                    async.waterfall([
                        function (callback) { // destroy the variables of the old script
                            Variable.destroy({scenario: oldScript[0].id}).exec(function (e) {
                                callback(null, "ok");
                            });
                        },
                        function (arg1, callback) { //delete the branches of the old script
                            if (arg1 == "ok") {
                                Branch.destroy({scenario: oldScript[0].id}).exec(function (e) {
                                    callback(null, "ok");
                                });
                            } else {
                                callback("Error at deleting the branches of the old script", null);
                            }
                        }
                    ], function (err, result) { //add new script
                        if (err) cb(err, null);
                        if (result != "ok") callback("Error at deleting the variables of the old script", null);

                        var keys = Object.keys(obj);
                        //add new script
                        Script.addScript({name: name}, function (err, script) {
                            if (err) cb(err, null);

                            async.each(keys, function (key, callback) {

                                if (key == "branches") { //if branches
                                    var branches = obj["branches"];
                                    //create objects branch
                                    async.each(branches, function (branchArray, callb) {
                                        var branch = {values: branchArray};
                                        branch['scenario'] = script.id;
                                        Branch.addBranch(branch, function (e, r) {
                                            if (e) callb(e, null);
                                            callb(null, null);
                                        });
                                    }, function (err, result) {
                                        if (err) callback(err, null);
                                        callback(null, null);
                                    });
                                } else { //if variables
                                    // create the object Variable
                                    var variable = obj[key];
                                    variable['name'] = key;
                                    variable['scenario'] = script.id;

                                    Variable.addVariable(variable, function (err, res) {
                                        if (err){ callback(err, null);
                                        }
                                        else{
                                        callback(null, res);
                                    }
                                    });
                                }
                            }, function (err, res) {
                                if (err) {
                                    sails.log.error(err);
                                } else {
                                    console.log("JSON file successfully parsed!");
                                    cb();
                                }
                            });

                        });
                    });
                });
            }
        });
    },

    /**
     * return the branches of the script by name
     * @param scriptName
     * @param cb
     */
    getBranchesByScript: function (scriptName, cb) {
        Script.find({name: scriptName}).exec(function (err, script) {
            if (err) cb(err, null);
            if (script != null && script != undefined && script.length > 0) {
                var scriptID = script[0].id;
                var finalBranches = [];
                Branch.find({scenario: scriptID}).exec(function (error, branches) {
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
                cb("Script not found", null);
            }
        });
    }
};
