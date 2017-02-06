    /**
     * Created by rlespagnol on 13/09/2016.
     */
    var request = require('request');
    var watson = require('watson-developer-cloud');
    var _ = require('lodash');
    var cheerio = require('cheerio');
    var xhr2 = require('xhr2');
    var qs = require('qs');

    const wikiapiUrl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=";
    const googleUrl = "https://www.google.fr/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=";
    const sorry = [

        'Excuse me, could tell me more?',
        'Could you tell me more information?',
    ];
    //const whRegex = /(^(what|who|whom|when|where|why|how|how|which|whose))|(\?$)/gi;
    const whRegex = /(^(who|what|whom|when|where|why|how|how|which|whose))|\?/;
    const taxonomyRegex = /((company|bank|financ|finance|investing|insurance|lending|business))|\?/;
    const keywordScope = ["credit", "revolving", "loan", "funds", "rate", "interest", "debt", "owed", "mortgage", "lend", "ratio", "risk", "tick"];

    module.exports = {
        getRandomSorry(alchemyData) {
            if(false && alchemyData.hasOwnProperty("taxonomy") && alchemyData.taxonomy!='' && alchemyData.taxonomy.length>3 && !taxonomyRegex.test(alchemyData.taxonomy) ){
                return "Sorry,we don't treat this question"
            }
            else{
            return sorry[Math.floor(Math.random() * sorry.length)];
        }
        },
    select(sentence,alchemyData,cb){
    var retrieve_and_rank = watson.retrieve_and_rank(CredentialService.getRetrieveAndRankCredentials());

    var params = {
      cluster_id: 'sc90de4f5e_b4f2_4bf7_929e_bd1cebd7fead',
      collection_name: 'credit_conso2',
      wt: 'json'
    };

    // Get a Solr client for indexing and searching documents.
    // See https://github.com/watson-developer-cloud/node-sdk/blob/master/services/retrieve_and_rank/v1.js

    //sails.log('Searching all documents.');
    solrClient = retrieve_and_rank.createSolrClient(params);

    var ranker_id = '76643bx23-rank-935';
    var query     = qs.stringify({q: sentence, ranker_id: ranker_id, fl: 'body,ranker.confidence,score'});

    solrClient.get('fcselect', query, function(err, searchResponse) {
                      sails.log(JSON.stringify(searchResponse));

      if(err ){
        sails.log('Error searching for documents: ' + err);
        sails.log('searchResponse: ' + searchResponse);
        cb("RnR erreur",err,null);

      }
        else if ( (whRegex.test(sentence.toLowerCase())) && searchResponse.hasOwnProperty("response") && searchResponse.response.hasOwnProperty('docs')
    && searchResponse.response.docs.length>0 && searchResponse.response.docs[0].hasOwnProperty('body')
       && searchResponse.response.docs[0].hasOwnProperty('ranker.confidence') 
       && searchResponse.response.docs[0]["ranker.confidence"]>0.880
    && RetrieveNRankService.containsKeywordOnScope(alchemyData.entities)
       ) {
                  //sails.log(JSON.stringify(searchResponse));
                                sails.log("test ranker");
                                sails.log(searchResponse.response.docs[0]["ranker.confidence"]);
                                sails.log(!(searchResponse.response.docs[0]["ranker.confidence"]>0.895));
                                
                                                                                       

          sails.log(JSON.stringify(searchResponse.response.docs[0], null, 2));
          cb(null,searchResponse.response.docs[0].body);

        }
        else{
                    sails.log("TEST2");
                    sails.log(sentence);
                    //sails.log((whRegex.test(sentence.toLowerCase())));
                    //sails.log(RetrieveNRankService.containsKeywordOnScope(alchemyData.entities));
                    //sails.log(searchResponse.response.docs[0].hasOwnProperty('ranker.confidence') );
                    //sails.log("TEST2");

                cb("RnR erreur",null);

        }
    });


    },
            getExterneCorpus2(question, alchemyData,trainingData, callback) {
     
                RetrieveNRankService.getRnR(question, alchemyData, function(err, res) {
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
                        callback(null, RetrieveNRankService.getRandomSorry(alchemyData));
                    } else {
                        callback(err, res);
                    }
                });
            
        },

          getRnR(question, alchemyData, callback){
               

           RetrieveNRankService.select(question,alchemyData,function(err,res){
                        callback(err, res);


           });
        },
        getSolr(question, alchemyData, callback) {
            if (RetrieveNRankService.containsKeywordOnScope(question)) {
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
                        callback(null, RetrieveNRankService.cleanText(repSolr.body));
                    } else {
                        RetrieveNRankService.getDBpedia(question, alchemyData, function(err, res) {
                            callback(err, res);
                        });
                    }
                });
            } else {
                RetrieveNRankService.getDBpedia(question, alchemyData, function(err, res) {
                    callback(err, res);
                });
            }
        },
        getDBpedia(question, alchemyData, callback) {
            sails.log("getDBPedia1");
            if (false && (whRegex.test(question.toLowerCase())) && (alchemyData != null) 
                && alchemyData.entityAndConcept != null 
                && alchemyData.entityAndConcept != undefined 
                && alchemyData.wordsList.length < 3 
                && alchemyData.entityAndConcept.length == 1 
                && alchemyData.entityAndConcept[0].hasOwnProperty("link")) {
                request(alchemyData.entityAndConcept[0].link, function(error, response, html) {
                    if ( !error) {
                        var $ = cheerio.load(html);
                        var dataText = '';
                        $('p.lead').each(function(i, elem) {
                            if (elem.children[0].hasOwnProperty("data") && elem.children[0].type == "text") {
                                dataText = dataText + ' ' + elem.children[0].data;
                            }
                        });
                                    sails.log("getDBPedia2");
                                    sails.log(dataText);

                        return callback(null, RetrieveNRankService.cleanText(dataText));
                    } else {
                        RetrieveNRankService.getWikipedia(question, alchemyData, function(err, res) {
                            callback(err, res);
                        });
                    }
                });
            } else {
                RetrieveNRankService.getWikipedia(question, alchemyData, function(err, res) {
                    callback(err, res);
                });
            }
        },

        getWikipedia(question, alchemyData, callback) {
                    sails.log("getWIKIEDIA");
                    
            if ((whRegex.test(question.toLowerCase())) && taxonomyRegex.test(alchemyData.taxonomy) 
                && (alchemyData != null) && alchemyData.wordsList != null 
                && alchemyData.wordsList != undefined && alchemyData.wordsList.length < 3) {
                sails.log('wikipedia request');
                sails.log(wikiapiUrl + alchemyData.wordsList);
                request(wikiapiUrl + alchemyData.wordsList, function(error, response, body) {
                    var object = JSON.parse(body);
                                    sails.log("result WIKIPEDIA");
                                    sails.log(error);
                                    sails.log(alchemyData.wordsList);
                                    sails.log(wikiapiUrl + alchemyData.wordsList);
                                    sails.log(JSON.stringify(object));

                    if (error==null && object.hasOwnProperty("query") && object.query.hasOwnProperty("pages") 
                        && Object.keys(object.query.pages).length > 0 
                        && object.query.pages[Object.keys(object.query.pages)[0]].hasOwnProperty("extract")) {

                        var descrWiki = object.query.pages[Object.keys(object.query.pages)[0]].extract;
                                                                        sails.log("response wiki good");

                        return callback(null, RetrieveNRankService.cleanText(descrWiki.split(".")[0]));
                    } else {
                                                        sails.log("response wiki not found");


                        return callback("response wiki not found", "");
                    }
                });
            } else {
                //sails.log("worldslist:");
                    //sails.log();

                            sails.log("condition wikipedia1 :" + alchemyData.taxonomy + " " + taxonomyRegex.test(alchemyData.taxonomy));
                            sails.log( whRegex.test(question.toLowerCase()) );
                            sails.log((alchemyData != null)  );
                            sails.log( alchemyData.wordsList != null );
                            sails.log( alchemyData.wordsList != undefined );
                            sails.log( alchemyData.wordsList.length < 3 );

                callback("condition wikipedia :"+ taxonomyRegex.test(alchemyData.taxonomy), "wikipedia false");
            //desolé je ne traite pas cette reponse

            }
        },
        containsKeywordOnScope(entities) {
            sails.log("containsKeywordOnScope")
            sails.log(entities)
            var findK = false
            for (var numkeyw in entities) {
                if (entities[numkeyw].entity=="useCaseKeyword") {
                    findK = true;
                    return findK;
                }
            }
            return findK;
        },

        cleanText(text) {
            if (text.length > 1) {
                //text = text.replace(/ *\([^)]*\) */g, " ");
               // text = text.replace(/[^A-Za-z0-9\s!?]/g, ' ');
                //text = text.replace(/../g, '.');
                return text;
            } else {
                return "";
            }
        }
    }