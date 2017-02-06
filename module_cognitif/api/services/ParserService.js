/**
 * Created by rlespagnol on 04/05/2016.
 */

var _ = require('lodash');
var request = require('request');
var math = require('mathjs');

module.exports = {
    parse(sentences, cb){
        var redirections = [];
        var actions = [];
        var variables = [];

        var regex = /\[(.*?)\]/ig;
        var index = 0;

        _(sentences).forEach(function (sentence) {
            var matches = [];

            while (match = regex.exec(sentence)) {
                matches.push(match[1]);
            }

            _(matches).forEach(function (value) {
                var isVar = true;
                // Action
                var actionRegex = /action->(.*)\((.*)\)/ig;
                var paramRegex = /([^,]+\(.+?\))|([^,]+)/ig;
                while (match = actionRegex.exec(value)) {
                    isVar = false;

                    var name = match[1];
                    var params = [];
                    while (matchParam = paramRegex.exec(match[2])) {
                        var param = matchParam[2];
                        param = param.trim();
                        params.push(param);
                    }

                    actions.push({
                        name: name,
                        params: params
                    })
                }

                // Redirection
                var redirectRegex = /redirect\((.*)\)/ig;
                while (match = redirectRegex.exec(value)) {
                    isVar = false;
                    redirections.push(match[1]);
                }

                //Variable
                if (isVar) {
                    variables.push(value)
                }
            });

            index++;
        });

        return {
            redirections: redirections,
            actions: actions,
            variables: variables
        }

    },
    parseSorry(sentences, cb){
        var result = sentences;

        _(sentences).forEach(function (sentence, index) {
            if(sentence){
                var sorry = SorryService.getRandomSorry();
                result[index] = sentence.replace("[sorry]", sorry);
            }
        });

        cb(null, result);
    },

    parseEval(sentences, cb){
        var regex = /\[eval->(.*)\]/ig;
        var result = sentences;

        _(sentences).forEach(function (sentence, index) {
            if(sentence){
                var match = regex.exec(sentence);
                if(match){
                    var group = match[1];
                    var value = 'NaN'
                    try{
                        value = math.eval(group);
                    }catch(e){
                        sails.log("Can't parse " + group);
                    }
                    result[index] = sentence.replace(match[0], value);
                }
            }
        });

        cb(null, result);
    }
}