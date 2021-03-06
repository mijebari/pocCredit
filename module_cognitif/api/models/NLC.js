/**
 * Created by rlespagnol on 27/09/2016.
 */

module.exports = {
    schema: true,

    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },

        type: {
            type: 'string',
            required: true,
            enum: ['faq', 'intent'],
            defaultsTo: 'faq'
        },
        response: {
            type: 'string',
            defaultsTo: ''
        },
        toJSON() {
            return this.toObject();
        }
    },

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next(),

    getTypeOfNLC(class_name, cb) {

        NLC.find({
            name: class_name
        }).exec(function (err, res) {
            if (err) {
                cb(err, null);
                return;
            }
            if (typeof res !== 'undefined' && res.length > 0) {
                cb(null, res[0].type);


            } else {
                cb('no NLC with name ' + class_name, null);
                return;

            }
        })
    },
    findAllType(cb) {
        NLC.find().exec(function (err, res) {
            if (err) {
                cb(err, null);
                return;
            }
            cb(null, res);
        })
    },

    newCategory(name, type, response) {
        if (!response || response == undefined) {
            response = '';
        }
        if (!type || !name) {
            sails.log("erreur nlc newdata ");
            sails.log(type);
            sails.log(name);
            sails.log(response);

            return;
        } else {


            var name2 = name.replace(/'/g, "").replace(/"/g, "");
            var response2 = response.replace(/'/g, "").replace(/"/g, "");
            var type2 = type.replace(/'/g, "").replace(/"/g, "");
            NLC.create({
                name: name2,
                response: response2,
                type: type2,

            }).exec(function (err, results) {
                if (err) {
                    sails.log(err)
                    sails.log('failed to add NLC :' + name + ' = ' + response);

                    return;
                }
                return;
            });

        }
    }
};