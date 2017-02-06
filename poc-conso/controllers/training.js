const request = require('request');
//const cheminPrincipal='http://module-cognitif-dev.eu-gb.mybluemix.net';
const cheminPrincipal='http://localhost:3001';
//const cheminPrincipal = 'http://test-module-cognitif.eu-gb.mybluemix.net';
//const cheminPrincipal='http://module-poc-credit.eu-gb.mybluemix.net';

const conversationServer = cheminPrincipal + '/v1/conversation';


const nlcServer = cheminPrincipal + '/v1/nlcs'


const trainingServer = cheminPrincipal + '/v1/trainingdatas';

/**
 * GET /
 * training page.
 */


exports.nlcTrained = (req, res) => {

    console.log(trainingServer);
    console.log("nlctrained");
    var type = req.query.type;
    if (type == null || type == undefined || type == "") {
        type = "all";
    }
    request({
        url: trainingServer + '/findAllByState',
        qs: {
            state: "alreadyTrained",
        }
    }, function(e, r, body) {

        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            return res.render('training/nlcTrained', {
                training: object.data,
                types: object.types,
                title: 'nlcTrained',
                type: type
            });
        } else {
            return res.json({
                err: "error",
                r: "error"
            });
        }
    });
};



exports.toTrained = (req, res) => {

    request({
        url: trainingServer + '/findAllByState',
        qs: {
            state: "toTrained",
        }
    }, function(e, r, body) {

        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            return res.render('training/toTrained', {
                training: object.data,
                types: object.types,
                title: 'toTrained'
            });
        } else {
            return res.json({
                err: "error",
                r: "error"
            });
        }
    });
};


exports.toValidate = (req, res) => {
    request({
        url: trainingServer + '/findAllByState',
        qs: {
            state: ["toValidate"],
        }
    }, function(e, r, body) {
        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            return res.render('training/toValidate', {
                training: object.data,
                types: object.types
            });
        } else {
            return res.json({
                err: "error",
                r: e
            });
        }
    })

};

exports.categories = (req, res) => {
     console.log(nlcServer);
    console.log("categories");
    
    var type = req.query.type;
    if (type == null || type == undefined || type == "") {
        type = "all";
    }


    request({
        url: nlcServer + '/findAllType',

    }, function(e, r, body) {

        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);

            return res.render('training/categories', {
                nlc: object.data,
                title: 'nlc categories',
                type: type
            });
        } else {
            return res.json({
                err: "error",
                r: "error"
            });
        }
    });

};





exports.setCategoryResponse = (req, res) => {
    var id = req.query.id;
    var response = req.query.response;



    request({
        url: nlcServer + '/setResponse',
 qs: {
            response: response,
            id: id
        }
    }, function(e, r, body) {
console.log(body);
        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);

return res.json(object);
        } else {
            return res.json({
                err: "error",
                r: "error"
            });
        }
    });

};

exports.trainingAction = (req, res) => {

    var correction = req.query.correction;
    var id = req.query.id;
    request({
        url: trainingServer + '/training',
        qs: {
            correction: correction,
            id: id
        }
    }, function(e, r, body) {

        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            return res.json(object);
        } else {

            return res.json({
                err: "error",
                r: "error"
            });
        }
    })
};

exports.testNLC = (req, res) => {
//console.log("test NLC ");
    var sentence = req.query.sentence;
   // console.log(sentence);

    request({
        url: nlcServer + '/testNLC',
        qs: {
            sentence: sentence,
        }
    }, function(e, r, body) {

        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            console.log(object);

            return res.json(object);
        } else {

            return res.json({
                err: "error",
                r: "error"
            });
        }
    })
};



exports.validateTrainingsAction = (req, res) => {
   // console.log("validate training action");
    request({
        url: trainingServer + '/validateTrainings'
    }, function(e, r, body) {
        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            return res.json({
                training: "ok",
                data: object
            });
        } else {
            return res.json({
                err: "error",
                r: "error"
            });
        }
    })
};



exports.deleteByTypeAction = (req, res) => {
    var state = req.query.state;
    request({
        url: trainingServer + '/deleteAllByType',
        qs: {
            state: state
        }
    }, function(e, r, body) {
        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            return res.json(object);
        } else {

            return res.json({
                err: "error",
                r: "error"
            });
        }
    })


};



exports.getFile = (req, res) => {
    var type = req.query.type;
     var serverSource=trainingServer;
     if(type=='category'){
        serverSource=nlcServer;
     }
    request({
        url: serverSource + '/getFile',
        qs: {
            type: type,
        }
    }, function(e, r, body) {

        if (!e && r.statusCode == 200) {
            return res.end(body);

        } else {
            console.log("getFile RESPONSE error:");
            console.log(e);

            return res.json({
                err: "error",
                data: e,
                r: r
            });
        }
    })
};





exports.deleteAction = (req, res) => {
    var id = req.query.id;
    console.log("delete training");
    request({
        url: trainingServer + '/delete',
        qs: {
            id: id
        }
    }, function(e, r, body) {
        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            return res.json(object);
        } else {
            return res.json({
                err: "error",
                r: "error"
            });
        }
    })
};

exports.deleteCategory = (req, res) => {
    console.log(nlcServer + '/deleteCategory');
    var id = req.query.id;
    request({
        url: nlcServer + '/deleteCategory',
        qs: {
            id: id
        }
    }, function(e, r, body) {
        console.log(body);
        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            console.log(object);
            return res.json(object);
        } else {
            return res.json({
                err: "error",
                r: "error"
            });
        }
    })
};



exports.newSentence = (req, res) => {
    console.log('new sentence');
    var sentence = req.query.sentence;
        console.log(sentence);

    request({
        url: trainingServer + '/new',
        qs: {
            sentence: sentence,
            class_suggestion_faq: 'null',
            confidence_class_suggestion_faq: '0',
            class_suggestion_intent: 'null',
            confidence_class_suggestion_intent: '0'
        }
    }, function(e, r, body) {
        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            return res.json(object);
        } else {
            return res.json({
                err: "error",
                r: "error"
            });
        }
    })
};

exports.newCategory = (req, res) => {
    var name = req.query.name;
    var type = req.query.type;
    request({
        url: nlcServer + '/new',
        qs: {
            name: name,
            type: type
        }
    }, function(e, r, body) {
        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            return res.json(object);
        } else {
            return res.json({
                err: "error",
                r: "error"
            });
        }
    })
};


exports.setCategory = (req, res) => {
    var id = req.query.id;
    var category = req.query.category;
    console.log(category);
    console.log(id);
    request({
        url: trainingServer + '/setCategory',
        qs: {
            id: id,
            category: category
        }
    }, function(e, r, body) {
        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            console.log(object);
            return res.json(object);
        } else {
            return res.json({
                err: "error",
                r: "error"
            });
        }
    })
};

exports.modifySentence = (req, res) => {
    var sentence = req.query.sentence;
    var newsentence = req.query.newsentence;
    request({
        url: trainingServer + '/modifySentence',
        qs: {
            sentence: sentence,
            newsentence: newsentence
        }
    }, function(e, r, body) {
        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            return res.json(object);
        } else {
            return res.json({
                err: "error",
                r: "error"
            });
        }
    })
};