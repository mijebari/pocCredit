/**
 * Created by rlespagnol on 24/05/2016.
 */

var watson = require('watson-developer-cloud');
var _ = require('lodash');

module.exports = {
 keywords(text, cb) {
  CredentialService.getAlchemyAPIKey(function(e, credentials) {
   var alchemy = watson.alchemy_language(credentials);
   var params = {
    text: text
   };
   alchemy.keywords(params, function(err, result) {
    var map = [];
    if (err)
     sails.log('error:' + err);
    else {
     map = _.map(result.keywords, 'text');
    }
    //sails.log(JSON.stringify(result, null, 2));
    cb(err, map);
   });
  })
 },

 entities(text, cb) {
  CredentialService.getAlchemyAPIKey(function(e, credentials) {
   sails.log(credentials)
   var alchemy = watson.alchemy_language(credentials);
   var params = {
    text: text
   };
   alchemy.entities(params, function(err, result) {
    var map = [];
    if (err)
     sails.log('error:' + JSON.stringify(err));
    else {
     _.each(result.entities, function(entity) {
      var obj = {
       entity: entity.type,
       value: entity.text
      }
      map.push(obj)
     });
    }
    //sails.log(JSON.stringify(result, null, 2));
    cb(err, map);
   });
  });
 },
 combinedCall(text, cb) {
  CredentialService.getAlchemyAPIKey(function(e, credentials) {
   //  sails.log(credentials)
   var alchemy = watson.alchemy_language(credentials);
   var parameters = {
    extract: 'entities,keywords,concepts,taxonomy',
    text: text
   };
   alchemy.combined(parameters, function(err, response) {
    if (err) {
     sails.log('error:' + JSON.stringify(err));
    }
    var map = [];
    var mapconcepts = [];
    var entities = [];
    var keywords = [];
    var concepts = [];
    var wordsList = [];
    var taxonomy = '';
    sails.log("ALCHEMY RESPONSE")
    sails.log(response)

    if (response != null && response.hasOwnProperty('entities')) {
     _.each(response.entities, function(entity) {
      var obj = {
       entity: entity.type,
       name: entity.type,
       value: entity.text
      }
      if (AlchemyLanguageService.containsKeyword(entity.text, wordsList) == false) {
       //   sails.log("PUSH");
       sails.log(AlchemyLanguageService.containsKeyword(entity.text, wordsList));
       wordsList.push(entity.text);
      }
      if (entity.hasOwnProperty("disambiguated")) {
       if (entity.disambiguated.hasOwnProperty("dbpedia")) {
       // obj["link"] = entity.disambiguated.dbpedia;
       }
      }
      map.push(obj)
     });
     entities = map;
    }
    if (response != null && response.hasOwnProperty('concepts')) {
     sails.log("concepts");
     sails.log(response.concepts);
     _.each(response.concepts, function(concept) {
      if(concept.hasOwnProperty("relevance") && concept.relevance>0.88){
      var obj = {
       text: concept.text,
       name: concept.text,
      }
      if (  AlchemyLanguageService.containsKeyword(concept.text, wordsList) == false) {
       //   sails.log("PUSH");

       sails.log(AlchemyLanguageService.containsKeyword(concept.text, wordsList));
      // wordsList.push(concept.text);
      }
      if (concept.hasOwnProperty("dbpedia")) {
       obj["link"] = concept.dbpedia;
      }
     // mapconcepts.push(obj)
    }
     });
     //concepts = mapconcepts;
concepts=[];

    }
    if (response != null && response.hasOwnProperty('keywords')) {
     keywords = response.keywords;
     _.each(response.keywords, function(keyword) {
      if (AlchemyLanguageService.containsKeyword(keyword.text, wordsList) == false) {
       sails.log(AlchemyLanguageService.containsKeyword(keyword.text, wordsList));
       wordsList.push(keyword.text);
      }
     });
    }
    if (response != null && response.hasOwnProperty('taxonomy')) {

     _.each(response.taxonomy, function(tax) {
      if (tax.hasOwnProperty('label')) {
       taxonomy = taxonomy + tax.label;
      }
     });

    }
    cb(err, {
     entities: entities,
     keywords: keywords,
     concepts: concepts,
     wordsList: wordsList,
     entityAndConcept: entities.concat(concepts),
     taxonomy: taxonomy.replace(/\\|\//g, " ")
    });
   });
  });
 },
 containsKeyword(keyword, listk) {
  var findK = false

  for (var numkeyw in listk) {

   if (listk[numkeyw].toUpperCase().search(keyword.toUpperCase()) != -1) {
    findK = true;

    return findK;

   }
  }
  return findK;
 }

}