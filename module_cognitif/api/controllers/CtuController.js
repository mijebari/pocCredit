/**
 * Created by rlespagnol on 30/09/2016.
 */
const shortid = require('shortid');
const fs = require('fs');

module.exports = {
    /**
     * Don't use it ! Or update the code with the executeUnitTest function
     */
    execute(req, res){
        req.file('test_cases').upload({maxBytes: Number.MAX_VALUE}, function (err, uploadedFiles) {
            if (err) return res.send(500, err);
            if (uploadedFiles.length === 0) return res.badRequest(null, {message: 'You should send a json file with parameter test_cases    '});
            if (uploadedFiles[0] != null && uploadedFiles[0] != undefined) {
                var filePath = uploadedFiles[0].fd;
                fs.readFile(filePath, 'utf8', function (err, contents) {
                    if (err) throw err;
                    var test_cases = JSON.parse(contents);
                    var clients = [];

                    /**
                     * For each test cases, create a context and execute scenario
                     */
                    async.series([
                        // function (callback) {
                        //     CtuService.updateContext(test_cases.default_context, function (err, result) {
                        //         callback(err, null);
                        //     })
                        // },
                        function (callback) {
                            async.mapSeries(test_cases.tests, function (test, _callback) {
                                    /**
                                     * Save the client_id to save the context
                                     * Because, all test_cases can have different scenario
                                     */
                                    const client_id = shortid.generate();
                                    clients.push(client_id);

                                    /**
                                     * Init the client's context with the test cases context
                                     */
                                    CtuService.initContext(client_id, test.context, function (err, result) {
                                        _callback(err, null)
                                    })
                                },
                                /**
                                 *  When all context are ok, execute the scenario.
                                 */
                                function (err, results) {
                                    if (err) return res.json(err);
                                    callback(err, null)
                                });
                        },
                        function (callback) {
                            var wrapper = test_cases.tests.map(function (value, index) {
                                return {index: index, value: value};
                            })

                            // Launch all tests cases
                            async.map(wrapper, function (item, _callback) {
                                var id = clients[item.index];
                                var test = item.value;

                                CtuService.execute(id, test.inputs, test.result, test.name, function (err, result) {
                                    _callback(err, result)
                                })
                            }, function (err, results) {
                                if (err) return res.json(err);
                                callback(err, results)
                            });
                        }
                    ], function (__e, __r) {
                        return res.json(__r[__r.length - 1]);
                    });

                });
            }
        });
    },
    executeUnitTest(req, res){
        var error = null;

        sails.log('============= Call Webservice - ' + new Date().toISOString().substring(0, 20) + ' ==============')
        /**
         * Get the list of units test
         */
        Ctu.find({}).limit(1).exec(function (e, r) {

            if (e || r.length === 0) return res.json(e);

            var test_cases = r[0];
            var clients = [];

            /**
             * Delete all undefined values
             * @type {Array}
             */
            test_cases.tests = _.reject(test_cases.tests, function (value) {
                return value.name === '' || value.result === ''
                    || typeof value.inputs === 'undefined';
            })

            /**
             * For each test cases, create a context and execute scenario
             */
            async.series([
                /**
                 * Check the state of the mutex.
                 * If a run is currently executed don't do a
                 * @param callback
                 */
                function (callback) {
                    Mutex.mutexState("unit_test_mutex", function (e, r) {
                        if (r) {
                            error = 'Mutex already use';
                            // return true to break the series
                            callback(true)
                        } else {
                            callback(e, r)
                        }
                    })
                },
                function (callback) {
                    /**
                     * Active the mutex to launch the run
                     */
                    Mutex.activateMutex('unit_test_mutex', function (e, r) {
                        callback(e, r);
                    })
                },
                function (callback) {
                    /**
                     * Destroy all ctuResult
                     */
                    CtuResult.destroy({}).exec(function (err, result) {
                        callback(err, null);
                    })
                },
                function (callback) {
                    async.mapSeries(test_cases.tests, function (test, _callback) {

                            /**
                             * Save the client_id to save the context
                             * Because, all test_cases can have different scenario
                             */
                            const client_id = shortid.generate();
                            clients.push(client_id);

                            /**
                             * Init the client's context with the test cases context
                             */

                            var nextContext = {
                                card: test_cases.default_context.card,
                                client: test_cases.default_context.client
                            };

                            if (test.context && test.context.card) {
                                for (var i = 0; i < test.context.card.length; i++) {
                                    var item = test.context.card[i];
                                    sails.log(item);
                                    // Override the previous value
                                    nextContext.card = nextContext.card.filter(function (obj) {
                                        return obj.field.toLowerCase().trim() !== item.field.toLowerCase().trim();
                                    });
                                    nextContext.card.push(item);
                                }
                            }

                            if (test.context && test.context.client) {
                                for (var i = 0; i < test.context.client.length; i++) {
                                    var item = test.context.client[i];
                                    sails.log(item);
                                    // Override the previous value
                                    nextContext.card = nextContext.client.filter(function (obj) {
                                        return obj.field.toLowerCase().trim() !== item.field.toLowerCase().trim();
                                    });
                                    nextContext.client.push(item);
                                }
                            }

                            /**
                             * Init the client's context.
                             */
                            CtuService.initContext(client_id, nextContext, function (err, result) {
                                _callback(err, null)
                            })
                        },
                        /**
                         *  When all context are ok, execute the scenario.
                         */
                        function (err, results) {
                            if (err) return res.json(err);
                            callback(err, null)
                        });
                },
                function (callback) {
                    /**
                     * Map the test_cases to return the index
                     * @type {Array}
                     */
                    var wrapper = test_cases.tests.map(function (value, index) {
                        return {index: index, value: value};
                    })

                    /**
                     * Launch all tests cases
                     */
                    async.map(wrapper, function (item, _callback) {
                        var id = clients[item.index];
                        var test = item.value;

                        /**
                         * Execute the test
                         */
                        CtuService.execute(id, test.inputs, test.result, test.name, function (err, result) {
                            _callback(err, result)
                        })

                    }, function (err, results) {
                        if (err) return res.json(err);
                        callback(err, results)
                    });
                },
                function (callback) {
                    /**
                     * Deactivate the mutex to allow another run
                     */
                    Mutex.deactivateMutex('unit_test_mutex', function (e, r) {
                        callback(e, r);
                    })
                }
            ], function (__e, __r) {
                sails.log('============= End Webservice - ' + new Date().toISOString().substring(0, 20) + ' ==============')

                /**
                 * If error (i.e. mutex already used) send error.
                 */
                if (error) {
                    return res.json({err: error})
                }

                // sails.log(JSON.stringify(__r[__r.length - 2]));

                return res.json(__r[__r.length - 2]);
            });
        })


    },
    getTest(req, res){

        Ctu.find({}).limit(1).exec(function (err, result) {
            if (err) return res.json(err);
            if (result.length > 0) {
                const test = result[0];
                return res.json(test);
            }
            return res.json({err: 'Error, result has not results'})
        })
    },

    saveTest(req, res){
        const unit_tests = req.param('unit_tests');
        if (!unit_tests) return res.badRequest(null, {message: 'You should specify a "unit_tests" parameter!'});

        /**
         * Destroy the previous CTU and create the new CTU.
         */

        Ctu.destroy({}).exec(function (err, result) {
            if (err) return res.json(err);
            Ctu.create(unit_tests).exec(function (err, result) {
                if (err) return res.json(err);
                return res.ok();
            })
        })
    }
}