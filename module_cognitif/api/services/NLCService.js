/**
 * Created by rlespagnol on 25/04/2016.
 */

/**
 * Service to interact with the NLC
 */

var watson = require('watson-developer-cloud');

module.exports = {
    createClassifier(credentials, language, name, training_data, cb){
        var params = {
            language: language,
            name: name,
            training_data: training_data
        };
        
        var classifier = watson.natural_language_classifier(credentials);
        classifier.create(params, function(err, response) {
            cb(err,response);
        });
    },
    getClassifiers(credentials, cb){
        var classifier = watson.natural_language_classifier(credentials);
        classifier.list({}, function (err, response) {
            cb(err,response);
        });
    },
    getClassifierInformation(credentials, classifier_id, cb){
        var classifier = watson.natural_language_classifier(credentials);
        classifier.status({classifier_id : classifier_id}, function (err, response) {
            cb(err,response);
        });
    },
    deleteClassifier(credentials, classifier_id, cb){
        var classifier = watson.natural_language_classifier(credentials);
        classifier.remove({classifier_id : classifier_id}, function (err, response) {
            cb(err,response);
        });
    },
    classify(credentials, text, classifier_id, cb){
        var params = {
            text : text ? text : 'N/A',
            classifier_id : classifier_id
        }
        var classifier = watson.natural_language_classifier(credentials);
        sails.log("classify param");
        sails.log(params);

        classifier.classify(params, function (err, response) {
                    sails.log("debug NLC");
        sails.log(err);
        sails.log(response);

            cb(err,response);
        });
    }

};