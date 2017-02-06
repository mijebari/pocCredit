/**
 * Created by atong on 08/08/2016.
 */
const fs = require('fs');
const _ = require('lodash');
const request = require('request');

module.exports = {

    /**
     * Upload the ScenarioData for the scenario
     * @param req
     * @param res
     * @returns {*}
     */

     
    uploadScenarioData : function(req,res){
        const name = req.param('name');
        if (!name) return res.badRequest(null, {message: 'You should send param \'name\''});

        req.file('scenario_json').upload({maxBytes: Number.MAX_VALUE}, function (err, uploadedFiles) {
            if (err) return res.send(500, err);
            if (uploadedFiles.length === 0) return res.badRequest(null, {message: 'You should send a json file'});
            if (uploadedFiles[0] != null && uploadedFiles[0] != undefined) {
                var filePath = uploadedFiles[0].fd;
                fs.readFile(filePath, 'utf8', function(err, contents) {
                    if(err) throw err;
                    var obj = JSON.parse(contents);
                                        sails.log(obj);

                 ScenarioData.addScenarioData({name: name,vars:obj.vars,branches:obj.branches}, function (err, scenarioData) {
                    if (err) res.json({err:err,error:"uploadscenariodata"});

res.json({scenariodata:scenarioData});
        });
                });
            }
        });
    },


    /**
     * controller to test ScenarioDataService.getScenarioData
     */
    getScenarioData(req, res) {
        const name = req.param('name');
        if (!name) return res.badRequest(null, {message: 'You should send param \'name\''});

        ScenarioDataService.getScenarioData(name, function(error, result) {
            return res.json({
                error: error,
                message: result
            });
        });
    }
};