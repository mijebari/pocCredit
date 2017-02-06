/**
 * Created by rlespagnol on 25/04/2016.
 */
"use strict"

/**
 * Module to interact with the dialog service
 */

var watson = require('watson-developer-cloud');
var _ = require('lodash');

module.exports = {
    getDialogs: function (credentials, cb) {
        var dialog_service = watson.dialog(credentials);
        dialog_service.getDialogs({}, function (err, dialogs) {
            cb(err, dialogs);
        });
    },
    createDialog(credentials, name, file, cb){
        var params = {
            name: name,
            // Ex : fs.createFileStream('template.xml')
            file: file
        };

        var dialog_service = watson.dialog(credentials);
        dialog_service.createDialog(params, function (err, dialog) {
            cb(err, dialog);
        });
    },
    deleteDialog (credentials, dialog_id, cb){
        var dialog_service = watson.dialog(credentials);
        dialog_service.deleteDialog({dialog_id: dialog_id}, function (err, dialog) {
            cb(err, dialog);
        });
    },
    updateDialog(credentials, dialog_id, file, cb){
        var params = {
            dialog_id: dialog_id,
            // Ex : fs.createFileStream('template.xml')
            file: file
        };

        var dialog_service = watson.dialog(credentials);
        dialog_service.updateDialog(params, function (err, dialog) {
            cb(err, dialog);
        });
    },
    converse(credentials, dialog_id, conversation_id, client_id, input, cb){
        var params = {
            conversation_id: conversation_id,
            dialog_id: dialog_id,
            client_id: client_id,
            input: input
        };

        var dialog_service = watson.dialog(credentials);
        dialog_service.conversation(params, function (err, conversation) {
            cb(err, conversation);
        });
    },
    // YYYY-MM-DD HH:MM:SS for the date
    getConversation(credentials, dialog_id, date_from, date_to, limit, offset, cb){
        var params = {
            dialog_id: dialog_id,
            date_from: date_from,
            date_to: date_to,
            limit: limit,
            offset: offset
        };
        var dialog_service = watson.dialog(credentials);
        dialog_service.getConversation(params, function (err, session) {
            cb(err, session);
        });
    },
    getProfile(credentials, dialog_id, client_id, name, cb){
        var params = {
            dialog_id: dialog_id,
            client_id: client_id,
            name: name
        };
        var dialog_service = watson.dialog(credentials);
        dialog_service.getProfile(params, function (err, profile) {
            cb(err, profile);
        });
    },
    getProfiles(credentials, dialog_id, client_id, cb){
        var params = {
            dialog_id: dialog_id,
            client_id: client_id
        };
        var dialog_service = watson.dialog(credentials);
        dialog_service.getProfile(params, function (err, profile) {
            cb(err, profile);
        });
    },
    setProfile(credentials, dialog_id, client_id, name, cb){
        var params = {
            dialog_id: dialog_id,
            client_id: client_id,
            name_values: name
        };
        var dialog_service = watson.dialog(credentials);
        dialog_service.updateProfile(params, function (err, profile) {
            cb(err, profile);
        });
    },
    initDialogs(cb){
        async.series({
            removeDialogs: function (callback) {
                Dialog.destroy({}).exec(function (err, results) {
                    if (err) sails.log(err);
                    callback(null, null);
                });
            },
            initDialogs: function (callback) {
                _.forEach(sails.config.lang, function (lang) {
                    var credentials = CredentialService.getCredentials(lang);

                    DialogService.getDialogs(credentials, function (err, result) {
                        if (err) {
                            sails.log.error(err);
                            callback(null, null);
                            return;
                        }

                        _(result.dialogs).forEach(function (value) {
                            Dialog.create({
                                name: value.name,
                                dialog_id: value.dialog_id,
                                lang: lang
                            }).exec(function (err, results) {
                                if (err) sails.log(err);
                                if (results) sails.log(results);
                            })
                        });

                        callback(null, null);
                    })
                });


            },
            cb: function (callback) {
                cb();
                callback(null, null);
            }
        })
    }

};