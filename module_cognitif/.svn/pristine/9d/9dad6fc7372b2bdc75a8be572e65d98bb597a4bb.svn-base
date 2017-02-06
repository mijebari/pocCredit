/**
 * Created by rlespagnol on 04/10/2016.
 */
const sugar_id = "d8359f88-75cb-77cb-9f94-57d7c6177f10";
const sugar_card_id = "916620ed-a9bc-5d77-ef3b-57d7c61281ce";


module.exports = {
    initContext: function (client_id, context, cb) {
        const _this = this;
        async.series([
            // Set context
            function (callback) {
                // Set card info
                _this.updateContext(context, function (err, results) {
                    sails.log("callback update")
                    callback(err, results);
                });

            }, function (callback) {
                ConversationService.algo(client_id, '', false, sugar_id, function (e, r) {
                    sails.log("callback algo")
                    callback(e, r)
                });
            }
        ], function (err, results) {
            cb(err, results)
        })
    },
    execute: function (client_id, inputs, test_result, name, cb) {
        async.mapSeries(inputs,
            function (input, callback) {
                sails.log("Input => " + input)
                ConversationService.algo(client_id, input, false, sugar_id, function (e, r) {
                    callback(e, r)
                });
            },

            function (err, results) {
                if (results.length === 0) return cb("Empty results");
                var obtained_result = results[results.length - 1].conversation.output.text[results[results.length - 1].conversation.output.text.length - 1].trim();
                var expected_result = test_result.trim();

                var obj = {
                    name: name,
                    passed: false,
                    expected_result: expected_result,
                    obtained_result: obtained_result,
                }

                if (levenshtein(expected_result, obtained_result) <= 10) {
                    obj.passed = true;
                }

                CtuResult.create(obj).exec(function (_e, _r) {
                    return cb(err, obj);
                })
            });

    },
    updateContext: function (context, cb) {
        if (typeof context === "undefined") return cb(null, null);

        // Set card info
        var card_ctx = context.card;
        var client_ctx = context.client;

        console.time("action");

        async.parallel([
            function (callback) {
                if (!card_ctx) return callback(null, null);
                var data = _.map(card_ctx, function (item) {
                    return {
                        field_name: item.field.toLowerCase().trim(),
                        value: item.value.toLowerCase().trim()
                    }
                })

                sails.log(JSON.stringify(data))

                ActionService.executeMultiSetAction(sugar_card_id, data, 'card', function (err, results) {
                    callback(err, results);
                })

                // async.mapSeries(card_ctx, function(info, callback){
                //     ActionService.executeSetAction(sugar_card_id, info.field.toLowerCase(), info.value.toLowerCase(), 'card', false, function(_e, _r){
                //         callback(_e,_r);
                //     })
                // }, function(err, results){
                //     callback(err, results);
                // });
            },
            function (callback) {
                if (!client_ctx) return callback(null, null);

                var data = _.map(client_ctx, function (item) {
                    return {
                        field_name: item.field.toLowerCase().trim(),
                        value: item.value.toLowerCase().trim()
                    }
                })

                ActionService.executeMultiSetAction(sugar_id, data, 'client', function (err, results) {
                    callback(err, results);
                })
                // async.mapSeries(client_ctx, function(info, callback){
                //     ActionService.executeSetAction(sugar_id, info.field.toLowerCase(), info.value.toLowerCase(), 'client', false, function(_e, _r){
                //         callback(_e,_r);
                //     })
                // }, function(err, results){
                //     callback(err, results);
                // });
            }
        ], function (e, r) {

            console.timeEnd("action");

            cb(e, r)
        });

    }
};

function levenshtein(a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    // swap to save some memory O(min(a,b)) instead of O(a)
    if (a.length > b.length) {
        var tmp = a;
        a = b;
        b = tmp;
    }

    var row = [];
    // init the row
    for (var i = 0; i <= a.length; i++) {
        row[i] = i;
    }

    // fill in the rest
    for (var i = 1; i <= b.length; i++) {
        var prev = i;
        for (var j = 1; j <= a.length; j++) {
            var val;
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                val = row[j - 1]; // match
            } else {
                val = Math.min(row[j - 1] + 1, // substitution
                    prev + 1,     // insertion
                    row[j] + 1);  // deletion
            }
            row[j - 1] = prev;
            prev = val;
        }
        row[a.length] = prev;
    }

    return row[a.length];
}