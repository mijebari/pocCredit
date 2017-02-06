"use strict";

/**
 * Conversation Controller
 */

const _ = require('lodash');
const shortid = require('shortid');

const sugar_id = "26196b38-be49-fb8f-0c13-57723fccf91b";
const workspace_id = '8dc29014-0ffd-4ec9-98a8-fccbc942d155';
const PGworkspace_id = '43a5bffd-b457-4021-a5ff-beca3c11a14b';

module.exports = {
    /**
     * Call the conversation service with all middleware.
     * If user doesn't exist, the service create him.
     * @param req
     * @param res
     */
test(req, res) {
const whRegex = /(^(what|who|whom|when|where|why|how|how|which|whose))|(\?)/gi;
const r=/(^(who|what|whom|when|where|why|how|how|which|whose))|\?/;
    var question  = req.param('question'); 

sails.log(whRegex.test(question));
return res.json({res:whRegex.test(question),sentence:question,test2:r.test(question)})
},
         index(req, res) {
    var input;
    var conversation_id='' ;

    var client_id  = req.param('client_id'); 

        if (!client_id) return res.badRequest(null, {message: 'You should specify a "client_id" parameter!'});

    if(!req.param('conversation_id') || req.param('conversation_id') === ''){
console.log("create conversation id");
console.log(req.param('conversation_id'));

         conversation_id = shortid.generate();
         input='conversation_start'
     }
     else { 

        conversation_id=req.param('conversation_id');
          input = !req.param('text') ? 'none' : req.param('text');

     }
     var action = req.param('action') ? req.param('action') : '';
     var form = req.param('form') ? req.param('form') : {};
     var inputConversation={text: input,
                            action:action};
  sails.log("request");
  sails.log({conversation_id:conversation_id,inputConversation:inputConversation,form:form});

        ConversationService.algo(workspace_id,conversation_id,client_id,inputConversation,form, function(err, result){
             sails.log('============= End Call Webservice - ' + new Date().toISOString().substring(0, 20) + ' ==============')
                          sails.log("RESULT");

             sails.log(result);
             if(err){ return res.json(err);
             }
             else {return res.json({result});
             }
         });

        
    },
             plugin(req, res) {
    var input;
    var conversation_id='' ;

    var client_id  = req.param('client_id'); 

        if (!client_id) return res.badRequest(null, {message: 'You should specify a "client_id" parameter!'});

    if(!req.param('conversation_id') || req.param('conversation_id') === ''){
console.log("create conversation id");
console.log(req.param('conversation_id'));

         conversation_id = shortid.generate();
         input='conversation_start'
     }
     else { 

        conversation_id=req.param('conversation_id');
          input = !req.param('text') ? 'none' : req.param('text');

     }
     var action = req.param('action') ? req.param('action') : '';
     var form = req.param('form') ? req.param('form') : {};
     var inputConversation={text: input,
                            action:action};
  sails.log("request");
  sails.log({conversation_id:conversation_id,inputConversation:inputConversation,form:form});

        ConversationService.algo(PGworkspace_id,conversation_id,client_id,inputConversation,form, function(err, result){
             sails.log('============= End Call Webservice - ' + new Date().toISOString().substring(0, 20) + ' ==============')
                          sails.log("RESULT");

             sails.log(JSON.stringify(result));
             if(err){ return res.json(err);
             }
             else {return res.json({result});
             }
         });

        
    },
    sendFeedback(req, res){
        sails.log("------- Send mail--------------")

        const client_id = req.param('client_id');
        const email = req.param('email');
        const expect = req.param('expect');
        const comment = req.param('comment');

        Logs.find({client_id: client_id}).exec(function (error, result) {
            if (error) {
                sails.log(error)
                res.json(error);
            }

            sails.log("=> Get Logs : " + result)

            if (result.length > 0) {
                const inputs = _.map(result, _.property('user_input'));
                const outputs = _.map(result, _.property('output'));

                Mailer.sendFeedBackMail({
                    client_id, email, expect, comment, inputs, outputs
                })

                res.json({result: 'OK'});
            }
            else {
                res.json({error: 'No conversation found.'});
            }
        })
    }
};

