const request = require('request');
//const cheminPrincipal='http://module-cognitif-dev.eu-gb.mybluemix.net';
const cheminPrincipal='http://localhost:3001';
//const cheminPrincipal = 'http://test-module-cognitif.eu-gb.mybluemix.net';

const conversationServer = cheminPrincipal + '/v1/conversation';



/**
 * GET /
 * Chat page.
 */



exports.index = (req, res) => {
    res.render('chat/index', {
        title: 'Chat'
    });
};

exports.postMessage = (req, res) => {
    var client_id = '';
    //var conversation_id = '';

    if (req.session && req.session.client_id /*&& req.session.conversation_id*/ ) {
        client_id = req.session.client_id;
        //conversation_id = req.session.conversation_id;
    }

    var sugar_id = req.body.id_client;
    var ginger = req.body.ginger ? req.body.ginger : false;

    request({
        url: conversationServer + '/',
        qs: {
            user_input: req.body.text,
            client_id: client_id,
            sugar_id: sugar_id,
            ginger: ginger
        }
    }, function(e, r, body) {

        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            if (!object.hasOwnProperty('conversation') || !object.conversation.hasOwnProperty('output')) return res.json({})
            var responses = object.conversation.output.text;
            var cleanResponse = [];

            for (var i = 0; i < responses.length; i++) {
                if (responses[i] !== '') {
                    cleanResponse.push(responses[i]);
                }
            }

            var response = cleanResponse /*.join('<br />')*/ ;

            // Set cookie to user
            req.session.client_id = object.client.client_id;
            //req.session.conversation_id = object.dialog.conversation_id;

            var update = object.hasOwnProperty('update') ? object.update : false;

            var obj = {
                response: response,
                input: object.ginger_input,
                update: update
            }
            console.log(obj)
            res.json(obj);
        }
    })
}

exports.getClientInfo = (req, res) => {
    var id_client = req.body.id_client;
    request({
        url: 'http://watson-vm.cloudapp.net:8080/fonction/getClientAllInfoById.php?id=' + id_client,
        method: 'GET'
    }, function(e, r, body) {

        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            res.json(object)
        }
    });
}

exports.getCRMClientInfo = (req, res) => {
    var id_client = req.body.id_client;
    request({
        url: 'http://watson-vm.cloudapp.net:8080/fonction/getFieldByModule.php',
        qs: {
            module: 's_client',
            field_name: 'id',
            value: id_client
        }
    }, function(e, r, body) {

        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            res.json(object)
        }
    });
}

exports.getCRMCardInfo = (req, res) => {
    var id_carte = req.body.id_carte;
    request({
        url: 'http://watson-vm.cloudapp.net:8080/fonction/getFieldByModule.php',
        qs: {
            module: 's_card',
            field_name: 'id',
            value: id_carte
        }
    }, function(e, r, body) {

        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            res.json(object)
        }
    });
}

exports.postRemoveCookies = (req, res) => {
    if (req.session && req.session.client_id /*&& req.session.conversation_id*/ ) {
        delete req.session.client_id;
        //delete req.session.conversation_id;
    }
    res.json('ok')
}

exports.sendEmail = (req, res) => {
    var email = req.body.email;
    var expect = req.body.expect;
    var comment = req.body.comment;

    request({
        url: conversationServer + '/sendFeedback',
        qs: {
            client_id: req.session.client_id || '',
            email: email,
            expect: expect,
            comment: comment
        }
    }, function(e, r, body) {
        if (!e && r.statusCode == 200) {
            res.json({
                result: 'OK'
            })
        }
    });
}

exports.updateField = (req, res) => {
    var id = req.body.id;
    var value = req.body.value;
    var field = req.body.field;

    request({
        url: 'http://watson-vm.cloudapp.net:8080/fonction/updateFieldById.php',
        qs: {
            module: 's_card',
            field_name: field,
            value: value,
            id: id
        }
    }, function(e, r, body) {
        if (!e && r.statusCode == 200) {
            res.json({
                result: 'OK'
            })
        }
    });
}