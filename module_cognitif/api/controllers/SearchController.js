"use strict";

/**
 * SearchController
 * @description :: Server-side logic for searching within records in database
 */

/**
 * DEPRECATED
 */


const _ = require('lodash');
const Promise = require('bluebird');
const gingerbread = require('gingerbread');
var math = require('mathjs');

const toLowerCase = _.partial(_.result, _, 'toLowerCase');
const parseModels = _.flow(toLowerCase, _.method('split', ','));

module.exports = {
    index(req, res) {
        const q = req.param('q');
        if (!q) return res.badRequest(null, {message: 'You should specify a "q" parameter!'});

        const models = parseModels(req.param('models')) || _.keys(sails.models);

        Promise.reduce(models, (res, modelName) => {
                const model = sails.models[modelName];

                if (!model) return res;

                const where = _.transform(model.definition, (result, val, key) => result.or.push(_.set({}, key, {contains: q})), {or: []});

                return Promise.join(modelName, model.find(where), _.partial(_.set, res));
            }, {})
            .then(res.ok)
            .catch(res.negotiate);
    },
    sandbox(req, res){
        // ScriptService.getScript('withdraw', function(e, r){
        //     return res.json({
        //         error : e,
        //         result : r
        //     })
        // })

        // ScriptService.getBranchesByScript('withdraw', function(err, result){
        //     sails.log(err)
        //     sails.log(result)
        //     return res.json({result : result});
        // })

        // Mailer.sendWelcomeMail({
        //     name : "remy",
        //     email : "remy.lespagnol@soprasteria.com"
        // })

        // gingerbread(req.param('text'), function (error, text, result, corrections) {
        //     // result contains 'The smell of flowers brings back memories.'
        //     res.json({
        //         error,
        //         text,
        //         result,
        //         corrections
        //     })
        // });

        // var _value = math.eval('25 + 5');
        // const _fdf = String(_value);
        //
        // return res.json({_fdf})

        ParserService.parseEval([req.param('text')]);
        return res.json({ok:'ok'});

        //return res.json({ result : SorryService.getRandomSorry()});

        // const array = ["","","Test"];
        // res.json({
        //     array : array.join('\n')
        // })

        // ActionService.executeSetAction(
        //     {
        //         id : "54d4443f-9900-d805-2996-577243af9b76"
        //     },
        //     'secu_key',
        //     '1234',
        //     'card',
        //     function (err, result) {
        //         return res.json({err, result})
        //     }
        // )

        //return res.ok();

        // var credentials = CredentialService.getConversationCredentials();
        // ConversationService.message(credentials, 'Yes', '804755fa-cf35-4a55-ac6d-572b44f44d9c', function(err, result){
        //     return res.json(result);
        // })
        //
        
        // CRMService.getVariableFromCRM({
        //     first_name: 'Rémy',
        //     last_name: 'lespagnol'
        // }, 'first_name', function (err, result) {
        //     return res.json({
        //         err: err,
        //         result: result
        //     });
        // })

        // CRMService.updateProfileFromCRM({
        //     first_name: 'Rémy',
        //     last_name: 'lespagnol'
        // }, [{
        //     field_name: 'payment_ceiling',
        //     value: 100
        // },{
        //     field_name: 'score',
        //     value: 58
        // },{
        //     field_name: 'bank_overdraft_limit',
        //     value: 3200
        // }], function (err, result) {
        //     return res.json({
        //         err: err,
        //         result: result
        //     });
        // })
    }
};

function isEmpty(obj){
    return (Object.getOwnPropertyNames(obj).length === 0);
}