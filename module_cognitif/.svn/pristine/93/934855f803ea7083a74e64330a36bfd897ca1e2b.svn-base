/**
 * Created by rlespagnol on 21/06/2016.
 */

var request = require('request');

module.exports = {
    getVariableFromCRM(client, variable, cb){
        getClientFromCRM(client, function (err, result) {
            if (result.hasOwnProperty(variable))
                cb(null, result[variable]);
            else
                cb("No variable " + variable, null)
        })
    },

    updateProfileFromCRM(client, variables, cb){
        getClientFromCRM(client, function (err, result) {
            if (result.hasOwnProperty('id')){
                async.map(variables, function (variable, callback) {
                    request({
                        url: sails.config.webservice.crm_host + '/phpCode/updateClientField.php',
                        qs: {
                            id: result.id,
                            field_name: variable.field_name,
                            value : variable.value
                        }
                    }, function (err, response, body) {
                        if (err) {
                            sails.log(err);
                            callback(err, null);
                        }
                        if (response.statusCode == 200) {
                           callback(null, '');
                        }
                        else {
                            return callback("CRM server is down", null);
                        }
                    })

                }, function (e, r) {
                    cb(e,r);
                });
            }
            else{
                cb("Client not found", null);
            }
        })
    },

    executeActionFromCRM(client, action_name, param, cb){
        if (!isAlive) return cb("SCRM server is down", null);

        request({
            url: sails.config.webservice.crm_host + '/phpCode/executeAction.php',
            qs: {
                client: client,
                action_name: action_name,
                param: param
            }
        }, function (err, response, body) {
            if (err) {
                sails.log(err);
                cb(err, null);
            }
            if (response.statusCode == 200) {
                var obj = JSON.parse(body);

                console.log(obj);
                cb(null, obj);
            }
            else {
                return cb("SCRM server is down", null);
            }
        })

    },

    getResponseNLCFromCRM(classeNLC, cb) {
        request({
            url: 'http://watson-vm.cloudapp.net:8080/fonction/getFieldByModule.php?module=s_nlc_response&field_name=class&value='+classeNLC,
            method: 'GET'
        }, function (err, response, body) {
            if (err) {
                sails.log(err);
                cb(err, null);
            }
            if (response.statusCode == 200) {
                var obj = JSON.parse(body);
                cb(null, obj);
            }
            else {
                return cb("SCRM data nlc server is down", null);
            }
        })
    },

    getClientByID(clientID, cb) {
        request({
            url: 'http://watson-vm.cloudapp.net:8080/fonction/getClientAllInfoById.php?id='+clientID,
            method: 'GET'
        }, function (err, response, body) {
            if (err) {
                sails.log(err);
                cb(err, null);
            }
            if (response.statusCode == 200) {
                var obj = JSON.parse(body);

                //console.log("Response from SCRM : "+obj[0].full_name);
                cb(null, obj);
            }
            else {
                return cb("SCRM server is down", null);
            }
        })
    }

};

function getClientFromCRM(client, cb) {
    request({
        url: sails.config.webservice.crm_host + '/phpCode/getClientByName.php',
        qs: {
            first_name: client.first_name,
            last_name: client.last_name
        }
    }, function (err, response, body) {
        if (err) {
            sails.log(err);
            cb(err, null);
        }
        if (response.statusCode == 200) {
            var obj = JSON.parse(body);
            if (obj.length > 0)
                cb(null, obj[0]);
            else
                cb("No profile found", null);
        }
        else {
            return cb("CRM server is down", null);
        }
    })
}