/**
 * Created by atong on 04/07/2016.
 */
var request = require('request');
var _ = require('lodash');
var math = require('mathjs');
var phone = require('phone');
var chrono = require('chrono-node');

Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
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

module.exports = {

    //send the query object to Sugar CRM
    querySCRM(requestObj, cb) {
        console.log("RequestObj : " + JSON.stringify(requestObj));
        request({
            //url: sails.config.webservice.crm_host + '/VocalBridge/sugarcrm/action',
            url: 'http://watson-vm.cloudapp.net:8081/VocalBridge/sugarcrm/action',
            method: 'POST',
            //qs: requestObj
            form: JSON.stringify(requestObj)
        }, function (err, response, body) {
            if (err) {
                sails.log(err);
                cb(err, null);
            }
            if (response.statusCode == 200) {
                var obj = JSON.parse(body);

                console.log("Response from Salif in Request function : " + JSON.stringify(obj));
                cb(null, obj);
            }
            else {
                return cb("SCRM server is down", null);
            }
        })
    },

    executeCleanAction(branches, value, context){
        var result = _.cloneDeep(context);

        if (!branches) return result;

        var branchesToClean = [];

        /**
         * Find all branches to clean
         */
        _.forEach(branches, function (branch) {
            _.forEach(branch, function (variable, index) {
                if (variable.toUpperCase() === value.toUpperCase()) {
                    branchesToClean.push({
                        branch,
                        id: index
                    });
                }
            });
        });

        /**
         * Clean the context
         */
        _.forEach(branchesToClean, function (branch) {
            var _branch = _.slice(branch.branch, branch.id);
            _.forEach(_branch, function (variable) {
                delete result[variable];
            })
        });

        return result;
    },

    /**
     * Execute a check function
     * @param client, the user information
     * @param leftOperand, the value to check
     * @param rightOperand, the value to compare with the left value
     * @param typeOfOperation the type of the operation
     * GREATER_THAN, LESS_THAN, EQUALS
     */
    executeCheckAction(client, leftOperand, rightOperand, typeOfOperation, eval){
        /**
         * Find user information
         */
        try{
            sails.log("Action Check : " + leftOperand + " with  " + rightOperand);
            if (!leftOperand || !rightOperand) return null;

            if(!eval){
                var leftValue = Object.byString(client, leftOperand);
                var rightValue = Object.byString(client, rightOperand);
            }

            leftValue = typeof leftValue !== 'undefined' ? leftValue : leftOperand;
            rightValue = typeof rightValue !== 'undefined' ? rightValue : rightOperand;

            sails.log("Action Check value : " + leftValue + " with  " + rightValue);

            if (!leftValue || !rightValue) return null;


            switch (typeOfOperation.toUpperCase()) {
                case 'GREATER_THAN' :
                    if(eval){
                        leftValue = math.eval(leftValue);
                        rightValue = math.eval(rightValue);
                    }

                    leftValue = parseFloat(leftValue);
                    rightValue = parseFloat(rightValue);

                    sails.log(leftValue)

                    return leftValue >= rightValue;

                    break;
                case 'LESS_THAN':
                    if(eval){
                        leftValue = math.eval(leftValue);
                        rightValue = math.eval(rightValue);
                    }

                    leftValue = parseFloat(leftValue);
                    rightValue = parseFloat(rightValue);

                    return leftValue <= rightValue;

                    break;
                case 'EQUALS':
                    if(eval){
                        leftValue = math.eval(leftValue);
                        rightValue = math.eval(rightValue);
                    }

                    leftValue = parseFloat(leftValue);
                    rightValue = parseFloat(rightValue);

                    return leftValue === rightValue;
                    break;
                default:
                    return null;
                    break;
            }
        }
        catch (err){
            return null;
        }

        return null;
    },
    /**
     * Data need to be [{ field_name, value },{...}]
     * @param id
     * @param data
     * @param table
     * @param eval
     * @param cb
     * @returns {*}
     */
    executeMultiSetAction(id, data, table, cb) {
        if (!data || !table) return cb(null);

        var postData = {
            type_request: 'set',
            id: id,
            table: table,
            data: data
        }
        
        _.forEach(data, function (value) {
            sails.log('Action set with value : ' + value.value);
        })

        var url = "http://watson-vm.cloudapp.net:8081/VocalBridge/sugarcrm/actions";

        var options = {
            url: url,
            method: 'POST',
            form: JSON.stringify(postData)
        }

        request(options, function (err, res, body) {
            if (err) return cb(err, null);

            return cb(null, body)
        })
    },

    executeSetAction(id, propertyToUpdate, valueToUpdate, table, eval, cb){
        if (!propertyToUpdate || !table) return cb(null);

        var postData = {
            type_request: 'set',
            id: id,
            table: table,
            field_name: propertyToUpdate,
            value: valueToUpdate
        };

        // Eval the code (+,-,*,/,cos,sin,inch to cm...)
        var _value = eval ? math.eval(postData.value) : postData.value;
        postData.value = String(_value);

        sails.log('Action set with value : ' + _value)

        var url = "http://watson-vm.cloudapp.net:8081/VocalBridge/sugarcrm/action";

        var options = {
            url: url,
            method: 'POST',
            form: JSON.stringify(postData)
        }
        request(options, function (err, res, body) {
            if (err) return cb(err, null);
            //sails.log(err);
            //sails.log(body)
            return cb(null, body)
        })

    },

    executeVerifyAction(value_type, input, cb){
        const type = value_type.toUpperCase();
        var value = '';

        var result = false;

        switch (type) {
            case 'PHONENUMBER':
                // Regex
                const phone_regex = /0[1-68]([-.\/ ]?[0-9]{2}){4}$/;
                var match = input.match(phone_regex);
                value = match ? match[0] : '';
                value = value.replace(/[-.\/ ]/g, '');

                result = phone(value, 'FR').length > 0 || phone(value).length > 0;

                if(result) {
                    result = value;
                }
                break;
            default:
                sails.log('This type is unknown : ' + type);
        }

        return result;
    }
};

