/**
 * Created by rlespagnol on 13/09/2016.
 */
var request = require('request');

var cheerio = require('cheerio');
var xhr2 = require('xhr2');
const wikiapiUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=";
const googleUrl = "https://www.google.fr/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=";
const sorry = [
    'Sorry, I’m afraid I don’t follow you.',
    'Excuse me, could you repeat please ?',
    'I’m sorry, I don’t understand. Could you say it again?',
    'I’m confused. Could you tell me again?',
];
//const whRegex = /(^(what|who|whom|when|where|why|how|how|which|whose))|(\?$)/gi;
const whRegex = /(^(who|what|whom|when|where|why|how|how|which|whose))|\?/;
const taxonomyRegex = /((company|bank|financ|investing|insurance|lending))|\?/;
const keywordScope = ["credit", "revolving", "loan", "funds", "rate", "interest", "debt", "owed", "mortgage", "lend", "ratio", "risk", "tick"];

module.exports = {
    getRandomSorry() {
        return sorry[Math.floor(Math.random() * sorry.length)];
    },
    getExterneCorpus(question, alchemyData,trainingData, callback) {
 
            SorryService.getSolr(question, alchemyData, function(err, res) {
                if (err) {
                    sails.log("GETEXTERNECORPUS ERR:")
                    sails.log(err)

                    TrainingData.newTraining(question,trainingData.class_suggestion_faq,
                                            trainingData.confidence_class_suggestion_faq, 
                                            trainingData.class_suggestion_intent, 
                                            trainingData.confidence_class_suggestion_intent,
                                            function(err, training) {
                                                if (err)
                                                    sails.log("new training error : " + err);
                                            });
                    callback(null, SorryService.getRandomSorry());
                } else {
                    callback(err, res);
                }
            });
        
    },
        getExterneCorpus2(question, alchemyData,trainingData, callback) {
 
            SorryService.getSolr(question, alchemyData, function(err, res) {
                if (err) {
                    sails.log("GETEXTERNECORPUS ERR:")
                    sails.log(err)

                    TrainingData.newTraining(question,trainingData.class_suggestion_faq,
                                            trainingData.confidence_class_suggestion_faq, 
                                            trainingData.class_suggestion_intent, 
                                            trainingData.confidence_class_suggestion_intent,
                                            function(err, training) {
                                                if (err)
                                                    sails.log("new training error : " + err);
                                            });
                    callback(null, SorryService.getRandomSorry());
                } else {
                    callback(err, res);
                }
            });
        
    },
    getSolr(question, alchemyData, callback) {
        if (SorryService.containsKeywordOnScope(question)) {
            request({
                url: 'http://watson-vm.cloudapp.net:8082/RESTfulExample/rest/file/select',
                qs: {
                    keywords: alchemyData.wordsList,
                },
                method: 'POST',
                json: {
                    keywords: alchemyData.wordsList,
                    field2: 'data'
                }
            }, function(err, response, body) {
                sails.log("solr return");
                var obj = body;
                if (!err && body != null && body != undefined && response.statusCode == 200
                 && obj.hasOwnProperty("solrResult") && obj.solrResult.length > 0 
                 && obj.solrResult[0].hasOwnProperty("body")) {
                    var repSolr = obj.solrResult[0];
                    if (obj.hasOwnProperty("docMatch") && obj.docMatch.length > 0) {
                        sails.log("DOC MATCH");
                        repSolr = obj.docMatch[0];
                    }
                    callback(null, SorryService.cleanText(repSolr.body));
                } else {
                    SorryService.getDBpedia(question, alchemyData, function(err, res) {
                        callback(err, res);
                    });
                }
            });
        } else {
            SorryService.getDBpedia(question, alchemyData, function(err, res) {
                callback(err, res);
            });
        }
    },
    getDBpedia(question, alchemyData, callback) {
        if ((whRegex.test(question)) && (alchemyData != null) 
            && alchemyData.entityAndConcept != null 
            && alchemyData.entityAndConcept != undefined 
            && alchemyData.wordsList.length < 3 
            && alchemyData.entityAndConcept.length == 1 
            && alchemyData.entityAndConcept[0].hasOwnProperty("link")) {
            request(alchemyData.entityAndConcept[0].link, function(error, response, html) {
                if (!error) {
                    var $ = cheerio.load(html);
                    var dataText = '';
                    $('p.lead').each(function(i, elem) {
                        if (elem.children[0].hasOwnProperty("data") && elem.children[0].type == "text") {
                            dataText = dataText + ' ' + elem.children[0].data;
                        }
                    });
                    return callback(null, SorryService.cleanText(dataText));
                } else {
                    SorryService.getWikipedia(question, alchemyData, function(err, res) {
                        callback(err, res);
                    });
                }
            });
        } else {
            SorryService.getWikipedia(question, alchemyData, function(err, res) {
                callback(err, res);
            });
        }
    },

    getWikipedia(question, alchemyData, callback) {
        if ((whRegex.test(question)) && taxonomyRegex.test(alchemyData.taxonomy) 
            && (alchemyData != null) && alchemyData.wordsList != null 
            && alchemyData.wordsList != undefined && alchemyData.wordsList.length == 1) {
            request(wikiapiUrl + alchemyData.wordsList, function(error, response, body) {
                var object = JSON.parse(body);
                if (!error && object.hasOwnProperty("query") && object.query.hasOwnProperty("pages") 
                    && Object.keys(object.query.pages).length > 0 
                    && object.query.pages[Object.keys(object.query.pages)[0]].hasOwnProperty("extract")) {

                    var descrWiki = object.query.pages[Object.keys(object.query.pages)[0]].extract;
                    return callback(null, SorryService.cleanText(descrWiki.split(".")[0]));
                } else {

                    return callback("response wiki not found", "");
                }
            });
        } else {
            callback("condition wikipedia :" + taxonomyRegex + " " + alchemyData.taxonomy + " " + taxonomyRegex.test(alchemyData.taxonomy), "wikipedia false");
        //desolé je ne traite pas cette reponse

        }
    },
    containsKeywordOnScope(question) {
        //sails.log("containsKeywordOnScope")
        var findK = false
        for (var numkeyw in keywordScope) {
            if (question.toUpperCase().search((keywordScope[numkeyw]).toUpperCase()) != -1) {
                findK = true;
                return findK;
            }
        }
        return findK;
    },
    cleanText(text) {
        if (text.length > 1) {
            text = text.replace(/ *\([^)]*\) */g, " ");
            text = text.replace(/[^A-Za-z0-9\s!?]/g, ' ');
            return text;
        } else {
            return "";
        }
    }
}