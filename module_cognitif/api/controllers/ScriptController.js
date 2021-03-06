/**
 * Created by atong on 08/08/2016.
 */
const fs = require('fs');
const _ = require('lodash');
const request = require('request');

module.exports = {

    /**
     * Upload the script for the scenario
     * @param req
     * @param res
     * @returns {*}
     */
    uploadScript : function(req,res){
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
                    ScriptService.JsonToScript(name, obj, function(err, result) {
                        if (err) sails.log.error(err);
                        return res.ok();
                    });
                });
            }
        });
    },


    /**
     * controller to test ScriptService.getScript
     */
    getScript(req, res) {
        const name = req.param('name');
        if (!name) return res.badRequest(null, {message: 'You should send param \'name\''});
        ScriptService.getScript(name, function(error, result) {
            return res.json({
                error: error,
                message: result
            });
        });
    }
};