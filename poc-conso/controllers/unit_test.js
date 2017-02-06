/**
 * Created by rlespagnol on 07/10/2016.
 */

var request = require('request')
//const cheminPrincipal='http://module-cognitif-dev.eu-gb.mybluemix.net';
const cheminPrincipal='http://localhost:3001';
//const cheminPrincipal='http://test-module-cognitif.eu-gb.mybluemix.net';

const conversationServer = cheminPrincipal+'/v1/';


exports.index = (req, res) => {
    res.render('unit_test/index', {
        title: 'Unit test'
    });
};

exports.test = (req, res) => {

    var url = conversationServer + 'ctuResults';

    request({
        url: url,
        method: 'GET',
        qs : {
            limit : 150
        }
    }, function (e, r, body) {
        var tests = [];
        if (!e && r.statusCode == 200) {
            var obj = JSON.parse(body)
            tests = obj.data
            tests = tests.sort(function(x,y){
                return  (x === y)? 0 : x? -1 : 1;
            })
        }



        console.log(tests)

        res.render('unit_test/test', {
            title: 'Run Test',
            tests : tests
        });
    });
};

exports.getTest = (req, res) => {
    var url = conversationServer + 'ctus/getTest';

    request({
        url: url,
        method: 'GET'
    }, function (e, r, body) {
        if (!e && r.statusCode == 200) {
            var obj = JSON.parse(body)
            res.json(obj)
        }
        else{
            res.json({})
        }
    });
}

exports.saveTest = (req, res) => {
    var url = conversationServer + 'ctus/saveTest';
    var unit_tests = req.body.unit_tests;

    console.log(unit_tests)

    request({
        url: url,
        method: 'POST',
        form : {
            unit_tests : unit_tests
        }
    }, function (e, r, body) {
        if (!e && r.statusCode == 200) {
            var obj = JSON.parse(body)
            res.json({result: 'ok'})
        }
        else {
            console.log(e)
            res.json(e)
        }
    });

}

exports.runTest = (req, res) => {
    var url = conversationServer + 'ctus/executeUnitTest';
    request({
        url: url,
        method: 'GET'
    }, function (e, r, body) {
        if (!e && r.statusCode == 200) {
            var obj = JSON.parse(body)
            res.json(obj)
        }
        else {
            console.log(e)
            res.json(e)
        }
    });

}