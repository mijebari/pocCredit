"use strict";

/**
 * DEPRECATED
 */

/**
 * ConverseController
 * @description :: Server-side logic for ...
 */



var credentials = {
    url: 'https://gateway.watsonplatform.net/dialog/api',
    username: '83c61bbd-6c2e-4a92-b924-807e321afcb4',
    password: 'YOda0hQRbiJ8',
    version: 'v1'
};

var fs = require('fs');

module.exports = {
    converse(req, res){

        const dialog_id = req.param('dialog_id');
        const conversation_id = req.param('conversation_id');
        const client_id = req.param('client_id');
        const user_input = req.param('user_input'); 

        if (!dialog_id) return res.badRequest(null, {message: 'You should specify a "dialog_id" parameter!'});
        if (!conversation_id) return res.badRequest(null, {message: 'You should specify a "conversation_id" parameter!'});
        if (!client_id) return res.badRequest(null, {message: 'You should specify a "client_id" parameter!'});
        if (!user_input) return res.badRequest(null, {message: 'You should specify a "user_input" parameter!'});

    }
};
