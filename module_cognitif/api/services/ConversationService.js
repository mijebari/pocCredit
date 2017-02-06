/**
 * Created by rlespagnol on 01/08/2016.
 */
var watson = require('watson-developer-cloud');
const _ = require('lodash');
const shortid = require('shortid');
const gingerbread = require('gingerbread');
const sugar_id = "26196b38-be49-fb8f-0c13-57723fccf91b";
//const classifier_id = "e82f62x108-nlc-3417";
const classifier_id = "8aff06x106-nlc-7752";

const faq_confidence = 0.97;
var alchemyData={};
const whRegex = /(^(who|what|whom|when|where|why|how|how|which|whose))|\?/;

module.exports = {
    message(credentials, input, workspace_id, context, cb) {
        var conversation = watson.conversation(credentials);
        sails.log("message conversation service ");
        sails.log({
            input: input,
            workspace_id: workspace_id,
            context: context
        });
        conversation.message({
            input: input,
            workspace_id: workspace_id,
            context: context
        }, function(err, response) {
            if (err) {
                sails.log(err)
                cb(err, null)
            } else {
                cb(null, response)
            }
        });
    },

    algo(workspace_id,conversation_id,client_id, inputConversation, form, cb) {
        /**
         * Execute some action in async.waterfall
         */



        async.waterfall(
            [
                /**
                 * Find the current user for this session **or create the user if he doesn't exist
                 * @param callback
                 */
                function(callback) {

                    ConversationContext.findOrCreateUser(conversation_id, workspace_id, function(err, contextConversation) {
                        if (err)
                            callback(err, null);
                        contextConversation.context['form'] = form;
                        callback(null, contextConversation.context)
                    });

                },
                function(context, callback) {

                     sails.log("etape get client data");
                     sails.log(client_id);

                    if (context != null && (context.client == undefined || context.client == null)) {

                             CRMService.getClientByID(client_id, function (err, clientProfil) {
                                if (err) callback(err, client);
                                if (clientProfil === null) return callback({error: 'SugarCRM is down'}, client)

                                context['client'] = clientProfil;
                            callback(null, context);
                             });
                         } else {
                             callback(null, context);
                         }
                             //callback(null, context);


                },
                /**
                 * Call alchemy and find entities
                 * Execute the script configuration
                 * And add the variable to the current user context
                 * @param client
                 * @param callback
                 */
                function(context, callback) {

                    sails.log("etape get script data");
                     ScenarioDataService.getScenarioData('scenario_credit_conso', function (error, script) {
                         if (error) return res.json(error);
                        if (script == null || script == undefined) {
                        callback("Error : script is null or undefined!", context, script);
                         } else {
                                                        sails.log("SCRIPT DATA");

                            sails.log(script);
                             callback(null, context, script);
                         }

                     });
                   // callback(null, context, {}); //context +script

                },
                function(context, script, callback) {
                    sails.log("etape get entity data");



                    if (inputConversation.text === '' || inputConversation.text === 'conversation_start') return callback(null, context, script,[]);
                    /**
                     * Call the alchemy service
                     */
                     AlchemyLanguageService.combinedCall(inputConversation.text, function (allErr, allres) {

                           sails.log(' ALCHEMY:');
                           sails.log(allres);
                            alchemyData=allres;
                           var entities=allres.entities;


                    getEntitiesFromConversation(CredentialService.getConversationCredentials(), workspace_id,inputConversation.text,function(err,entitiesFromConversation){
                           

                            entities=entitiesFromConversation.concat(entities);
                            alchemyData.entities=entities;
                           context['form']= updateForm(inputConversation.text,null,entities,context.form,script);
                           sails.log('ENTITIIES:')
                            sails.log(entities);
                         callback(null, context, script, entities);
                     });
             });

                    //callback(null, context, script);
                },
                function(context, script,entities, callback) { //FAQ
                    sails.log("etape get nlc data");

                    if (inputConversation.text === '' || inputConversation.text === 'conversation_start') return callback(null, context, script, null);

                    const credentialsNLC = CredentialService.getNLCCredentials('en');

                    /**
                     * Classify the intent of the user
                     */

                    NLCService.classify(credentialsNLC, inputConversation.text, classifier_id, function(err_nlc, res_nlc) {
                        if (err_nlc) {
                            sails.log("erreur nlc service");

                            sails.log(err_nlc);
                            callback(err_nlc, context, script, faqData);
                        }
                        var faqData = {};

                        faqData['class'] = res_nlc.classes[0];
                        sails.log("NLC  " + JSON.stringify(faqData));

                        sails.log("NLC Confidence ==> " + faqData.class.confidence)
                        sails.log("NLC Class ==> " + faqData.class.class_name);

               //         if (faqData.class.confidence >= faq_confidence) {

                            NLC.find({
                                name: faqData.class.class_name,
                                type: 'faq'
                            }).exec(function(err_crm, res_crm) {

                                if (err_crm) {
                                    sails.log(err_crm);
                                    callback(err_crm, context, script, faqData)
                                }
                               else {
                                if (res_crm.length && res_crm.length > 0) {
                                    var nlc_response = res_crm[0].response;

                                     const vars = nlc_response.match(/%_[^\s]+_%/g);
                                    if (vars) {
                                        _.forEach(vars, function(_var) {

                                            const __var = _var.replace('%_', '').replace('_%', '');
                                            const _value = Object.byString({context:context}, __var);
                                            nlc_response = nlc_response.replace(_var, _value);
                                        });
                                    }
                                }
                                faqData['faq_response'] = nlc_response

                                sails.log('NLC Response ==> ' + nlc_response);

                                callback(null, context, script, faqData)
                                }
                            });


                    });
                    //  callback(null, context, faqData);
                },
                /**
                 * Call the conversation service with the client context
                 * @param client
                 * @param callback
                 */
                function(context, script, faqData, callback) {
                    sails.log("etape get faqdata 2 data");

                    /**
                     * Get the conversation's credentials
                     */
                    const credentials = CredentialService.getConversationCredentials();

                    var _ctx = _.cloneDeep(context);
                    delete _ctx.client;
                    delete _ctx.system;
                    //sails.log('Context => ' + JSON.stringify(_ctx));

                    /**
                     * Call the conversation service with the client's context
                     */

                    if (faqData != null && faqData.class.confidence == 1) {
                                sails.log("REPONSE FAQ==> 1");

                        callback(null, {
                            context: context,
                            responseWatson: faqData.faq_response,
                            faq: true,
                            faqData: faqData,
                            conversation: {},
                            script: script
                        });


                    } else {
                        ConversationService.message(credentials, inputConversation, workspace_id, context, function(e, conversation) {
                            if (e) {
                                sails.log("erreur conversation service");
                                sails.log(e);
                                callback(e, null)
                            }

                            /**
                             * Add training data
                             * @type {Array|*}
                             */
                            if (typeof(conversation.output) !== "undefined" && typeof(conversation.output.text) !== "undefined" && conversation.output.text.length > 0 && conversation.output.hasOwnProperty("misunderstood") ){


                                conversation.context['lastOutput'] = conversation.output.text;


                                if (faqData != null && faqData.class.confidence >= faq_confidence) {
                                    sails.log("REPONSE FAQ ==> 2");

                                    callback(null, { conversation_id: conversation_id,
                                        context: conversation.context,
                                        responseWatson: faqData.faq_response,
                                        faq: true,
                                        faqData: faqData,
                                        conversation: conversation,
                                        script: script,
                                        wiki:""

                                    });


                                }
                                else{
                                    var trainingData={  class_suggestion_faq:faqData.class.class_name,
                                                        confidence_class_suggestion_faq: String(faqData.class.confidence),
                                                        class_suggestion_intent:typeof conversation.intents !== 'undefined' ? conversation.intents[0].intent : 'N/A',
                                                        confidence_class_suggestion_intent: typeof conversation.intents !== 'undefined' ? String(conversation.intents[0].confidence) : 'N/A'};
sails.log("alchmy DATA:");
sails.log(alchemyData);
                                    RetrieveNRankService.getExterneCorpus2(inputConversation.text,alchemyData,trainingData,function(errwiki,responsewiki){
                                        var responseWatsonInt=conversation.output.text.join(' ');
                                        if(responsewiki!=null && responsewiki!=""){
                                            responseWatsonInt=responsewiki
                                            if(conversation.context.lastOutput!=null && conversation.context.lastOutput!=undefined && conversation.context.lastOutput!=""  && conversation.context.lastOutput.length!=0){
                                               responseWatsonInt=responseWatsonInt+" "+ (conversation.context.lastOutput.join(' '));

                                                }
                                            }
                                        sails.log("REPONSE getExterneCorpus ==> ");
                                        sails.log(responsewiki);
                                        callback(null, {
                                            conversation_id: conversation_id,
                                            context: conversation.context,
                                            responseWatson: responseWatsonInt,
                                            faq: true,
                                            faqData: faqData,
                                            conversation: conversation,
                                            script: script,
                                            wiki:responsewiki});

                                    })
                                }

                            } 
                            else {


                                conversation.context['lastOutput'] = conversation.output.text;
                                sails.log("REPONSE CONVERSATION ==> ");

                                callback(null, {
                                    conversation_id: conversation_id,
                                    context: conversation.context,
                                    responseWatson: conversation.output.text.join(' '),
                                    faq: false,
                                    faqData: faqData,
                                    conversation: conversation,
                                    script: script,
                                    wiki:{}});
                            

                            }
                        });
                    }

                },

            ],
            /**
             * Send the result
             * @param err
             * @param result
             */
            function(err, result) {
                if (err) {
                    cb(err, null);
                    // sails.log('LastOuput => ' + result.conversation.context['lastOutput'].join(' '))
                } else {

                    ConversationContext.saveConversation(conversation_id, workspace_id, result.context, function() {
                        sails.log("sauvegarde CONTEXT")
                    });

                    cb(null, result);
                }
                //return cb(null, {ok:result} );
            }
        );
    }

};

function executeFAQ(input, client, script, conversation, callback) {
    const credentialsNLC = CredentialService.getNLCCredentials('en');

    /**
     * Classify the intent of the user
     */

    NLCService.classify(credentialsNLC, input, classifier_id, function(err_nlc, res_nlc) {
        if (err_nlc) {
            sails.log(err_nlc);
            callback(err_nlc, null);
        }
        const first_class = res_nlc.classes[0];

        sails.log("NLC Confidence ==> " + first_class.confidence)
        sails.log("NLC Class ==> " + first_class.class_name);

        if (first_class.confidence >= faq_confidence) {

            NLC.find({
                name: first_class.class_name,
                type: 'faq'
            }, function(err_crm, res_crm) {
                if (err_crm) {
                    sails.log(err_crm);
                    callback(err_crm, client, client, script)
                }
                if (res_crm.length && res_crm.length > 0) {
                    var nlc_response = res_crm[0].response;

                    const vars = nlc_response.match(/%_[^\s]+_%/g);
                    if (vars) {
                        _.forEach(vars, function(_var) {
                            const __var = _var.replace('%_', '').replace('_%', '');
                            const _value = Object.byString(client, __var);
                            nlc_response = nlc_response.replace(_var, _value);
                        });
                    }
                }

                client.output = {
                    text: [nlc_response]
                }
                sails.log('NLC Response ==> ' + nlc_response);

                if (typeof client.context.lastOutput !== 'undefined') {
                    client.output.text = client.output.text.concat(client.context.lastOutput[client.context.lastOutput.length - 1]);
                }

                callback(null, client, {
                    context: client.context,
                    output: {
                        text: client.output.text
                    },
                    input: {
                        text: input
                    }
                }, script)
            })
        } else {
            //callback(null, client, script, first_class, false)
            TrainingData.newTraining(input,
                first_class.class_name,
                String(first_class.confidence),
                typeof conversation.intents !== 'undefined' ? conversation.intents[0].intent : 'N/A',
                typeof conversation.intents !== 'undefined' ? String(conversation.intents[0].confidence) : 'N/A',
                function(err, training) {
                    if (err)
                        sails.log("new training error : " + err);
                });
            callback(null, client, conversation, script)
        }
    });

};

/**
 * Execute the action and recall this function if an another action come
 * @param client
 * @param action
 * @param script
 * @param input
 * @param previousText
 * @param cb
 */
function actionReCall(client, action, script, input, previousText, cb) {
    const credentials = CredentialService.getConversationCredentials();
    var needToSendUpdate = false;
    var ctxToUpdate = action.hasOwnProperty('var') ? action.var : [];

    // Concat the previous text
    var _output = previousText;

    /**
     * Make the call to the action service
     * @type {boolean}
     */
    sails.log("Action : " + JSON.stringify(action))

    async.series([
        function(callback) {
            switch (action.type.toUpperCase()) {
                case 'CHECK':
                    var resultAction = ActionService.executeCheckAction(client.context.client, action.left, action.right, action.operand_type, action.eval);
                    client.context[ctxToUpdate] = resultAction;
                    callback(null, null);
                    break;
                case 'SET':
                    ActionService.executeSetAction(
                        action.id,
                        action.field,
                        action.value,
                        action.table,
                        action.eval,
                        function(err, result) {
                            needToSendUpdate = true;
                            callback(null, null);
                        }
                    )
                    break;
                case 'VERIFY':
                    var resultAction = ActionService.executeVerifyAction(action.value_type, input);
                    client.context[ctxToUpdate] = resultAction;
                    callback(null, null);
                    break;
                case 'CLEAN':
                    client.context = ActionService.executeCleanAction(script.branches, action.value, client.context);
                    callback(null, null);
                    break;
                default:
                    sails.log('Error, this action is not define : ' + action.type.toUpperCase());
                    callback(null, null);
                    break;
            }
        }
    ], function(err, result) {
        /**
         * Delete the action in the client's context
         */
        delete client.context.action;

        /**
         * Recall conversation
         */
        ConversationService.message(credentials, '', client.workspace_id, client.context, function(e, conversation) {
            if (e) {
                cb(e, null)
            }

            conversation.context['lastOutput'] = conversation.output.text;

            /**
             * Save the conversation in the db.
             */
            ConversationClient.saveConversation(client.client_id, client.workspace_id, conversation.context, function(err, updated) {
                var obj = {
                    conversation: conversation,
                    client: updated[0]
                }

                /**
                 * If a new action is present, recall recursively this function
                 */
                if (conversation.context.hasOwnProperty('action')) {
                    actionReCall(obj.client, conversation.context.action, script, input, _output, function(e, r) {
                        cb(null, r);
                    });
                    /**
                     * Send the callback to the client
                     */
                } else {
                    obj['update'] = needToSendUpdate;
                    _output = _output.concat(obj.conversation.output.text);
                    obj.conversation.output.text = _output;
                    cb(null, obj);
                }
            });
        });
    });
}

/**
 * Find all entities in the user input
 * @param entities
 * @param script
 * @returns {Array}
 */
function findEntityToUpdate(entities, script) {
    var result = [];

    /**
     * Select all objects that have an entity
     * @type {Object}
     */
    var script = _.pickBy(script, function(value) {
        return value.hasOwnProperty('entities');
    });

    for (var i in entities) {
        var entity = entities[i];
        /**
         * Select all objects that have the current entity
         * @type {Object}
         */
        var scriptEntity = _.pickBy(script, function(value) {
            var _res = false;
            for (var i = 0; i < value.entities.length; i++) {
                if (value.entities[i].toUpperCase() === entity.type.toUpperCase()) {
                    _res = true;
                }
            }
            return _res;
        });

        /**
         * Get the first entity
         */
        var first;
        for (first in scriptEntity) break;
        var currentVariable = first;

        scriptEntity = _.toArray(scriptEntity);
        scriptEntity = _.head(scriptEntity);


        if (typeof scriptEntity === 'undefined' || scriptEntity.length === 0) continue;

        if (scriptEntity.type === 'BOOL') {
            var isSetted = false;
            for (var j in scriptEntity.keys) {
                var key = scriptEntity.keys[j];
                for (var k in key.values) {
                    var value = key.values[k];
                    if (value.toUpperCase() === entity.text.toUpperCase()) {
                        result.push({
                            name: currentVariable,
                            value: true
                        })
                        isSetted = true;
                    }
                }
            }
            if (!isSetted) {
                result.push({
                    name: currentVariable,
                    value: false
                })
            }
        } else if (scriptEntity.type == 'AMOUNT') {
            var _entity = entity.text;
            if (_entity.indexOf('$') > -1 || _entity.indexOf('dollars') > -1 || _entity.indexOf('euros') > -1 || _entity.indexOf('€') > -1)
                var amount = Number(_entity.replace(/[^0-9\.]+/g, ""));
            result.push({
                name: currentVariable,
                value: amount
            })
        }

    }
    result = _.uniqBy(result, 'name');
    return result;
}

/**
 * Find all variables in the user input
 * @param user_input
 * @param script
 * @returns {Array}
 */
function findVariableToUpdate(user_input, script) {
    var result = [];

    var script = _.pickBy(script, function(value) {
        return !value.hasOwnProperty('entity');
    })

    for (var variable in script) {
        if (script.hasOwnProperty(variable) && script[variable].hasOwnProperty('keys')) {
            var keys = script[variable].keys;
            for (var i in keys) {
                for (var j in keys[i].values) {
                    var value = keys[i].values[j];
                    if (user_input.toUpperCase().indexOf(value.toUpperCase()) > -1) {
                        //sails.log("Update variable " + variable.toUpperCase() + ' with value ' + value.toUpperCase());

                        var key = keys[i].key;
                        if (script[variable].type == 'BOOL') {
                            key = 'true'
                        }

                        var res = {
                            name: variable,
                            value: keys[i].key
                        };
                        result.push(res);
                    }
                }
            }
        }
    }
    result = _.uniqBy(result, 'name');

    return result;
}

function getEntitiesFromConversation(credentials, workspace_id,text,cb) {

    ConversationService.message(credentials, {text:text}, workspace_id, {}, function(e, conversationr) {

        sails.log(" DEBUG ENTITIES CONVERSATION");
        sails.log(e);
        sails.log(conversationr);
        if (e) {
             cb(e,null);
        }

 cb(null,conversationr.entities)
    });

}

function updateForm(sentence,relation,entities,form,script){
    if(sentence!=null && (whRegex.test(sentence.toLowerCase()))){
return form;
    sails.log("no updateForm");

    }
    sails.log("updateForm");
sails.log(entities);
var data={};
for (var numElem in entities) {
 // console.log(entities[numElem]);
 if (script.vars.hasOwnProperty(entities[numElem].entity)) {


sails.log("script contain entity");
sails.log(entities[numElem].entity);

sails.log(script.vars[entities[numElem].entity]);
data=script.vars[entities[numElem].entity];
  if(data.type=='KEYWORDS' || data.type=='AMOUNT'){
form[data.fieldForm]=entities[numElem][data.value];

  }
  else if(data.type=='BOOL' ){
    sails.log("script contain entity BOOL");
sails.log(data);
sails.log(entities[numElem]);
   if( data.hasOwnProperty(entities[numElem].value)){
        sails.log("ok");

form[data.fieldForm]=data[entities[numElem].value];
}
  }
 }

 }

return form;
}

Object.byString = function(o, s) {
sails.log("objectbystring");
sails.log(o);

    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
    var a = s.split('.');
    sails.log("split");
    sails.log(a);

    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}