/**
 * Created by atong on 20/07/2016.
 */

/**
 * DEPRECATED
 */

const fs = require('fs');
const _ = require('lodash');
const request = require('request');
var requestObj = {

};

module.exports = {

    converse(req, res){
        var dialog_id = req.param('dialog_id');
        var conversation_id = req.param('conversation_id');
        var client_id = req.param('client_id');
        var user_input = req.param('user_input');
        var var_name = req.param('var_name');
        //var var_value = req.param('var_value');

        var lang = req.param('lang');
        if (!lang || (lang !== 'fr' && lang !== 'en')) lang = 'en';

        const credentials = CredentialService.getCredentials(lang);

        DialogService.converse(credentials, dialog_id, conversation_id, client_id, user_input, function (err, result) {
            if (err) return res.json({error: err});
            if (typeof result === 'undefined' || typeof result.response === 'undefined')
                return res.json({error: "No response from cognitive server"});
            conversation_id = result.conversation_id;

            if(var_name) {
                console.log(var_name);
                var name_values = [{
                    name: var_name,
                    value: null
                }];

                DialogService.setProfile(credentials, dialog_id, client_id, name_values, function (err, resul) {
                    if (err) return err;
                    console.log("setProfiles : "+JSON.stringify(resul));

                    DialogService.getProfiles(credentials, dialog_id, client_id, function(er, resu){
                        if (er) return er;
                        console.log("Profile variables : "+JSON.stringify(resu));
                        return res.json(result);
                    });

                });
            } else{
                return res.json(result);
            }


        });
    },

    testCRM(req, res) {
        CRMService.getClientByID("someID", function(err, client) {
            if(err) throw err;
            return res.json(client);
        })
    }

};