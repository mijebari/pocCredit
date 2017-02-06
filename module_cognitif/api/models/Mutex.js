/**
 * Created by rlespagnol on 14/10/2016.
 */
/**
 * Created by rlespagnol on 22/08/2016.
 */
module.exports = {
    schema: true,

    attributes: {
        unit_test_mutex: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        toJSON() {
            return this.toObject();
        }
    },

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next(),

    mutexState(property,cb){
        Mutex.find({}).limit(1).exec(function(err, result){
            if (err || result.length === 0) return cb(e,null);
            var obj = result[0];

            return cb(null,obj[property]);
        });
    },

    activateMutex(property, cb){
        var obj ={};
        obj[property] = true;

        Mutex.update({}, obj).exec(function(err, result){
            if (err || result.length === 0) return cb(e,null);
            return cb(null,null);
        });
    },

    deactivateMutex(property, cb){
        var obj ={};
        obj[property] = false;
        Mutex.update({}, obj).exec(function(err, result){
            if (err || result.length === 0) return cb(e,null);
            return cb(null,null);
        });
    },
    deactivateAllMutext(cb) {
        var obj = {
            unit_test_mutex : false
        }
        Mutex.update({}, obj).exec(function(err, result){
            if (err || result.length === 0) return cb(e,null);
            return cb(null,null);
        });
    }
};
