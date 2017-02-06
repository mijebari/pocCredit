"use strict";

/**
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 * @param {Function} cb This function should always be called, so DON'T REMOVE IT
 */

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(), !mm[1] && '0', mm, !dd[1] && '0', dd].join('-'); // padding
};

module.exports = {
    bootstrap: cb => {
        //cb();

        async.series({
            initMutex: function (callback) {
                Mutex.findOrCreate({}, {unit_test_mutex : false}).exec(function(err, theMutex){
                    if(err){
                        callback(err, null);
                        return;
                    }
                    Mutex.deactivateAllMutext(function(e,r){
                        if(e){
                            callback(e, null);
                            return;
                        }
                        callback(null, null)
                    })
                });
            },
            cb: function (callback) {
                cb()
                callback(null, null)
            }
        })
    }
};
