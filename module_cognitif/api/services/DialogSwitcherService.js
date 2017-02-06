/**
 * Created by rlespagnol on 02/05/2016.
 */

module.exports = {
    welcomeDialogId: function (lang, cb) {
        Dialog.find({name: 'welcome', lang: lang}).exec(function (err, result) {
            if (err)
                sails.log(err);
            if (typeof result === 'undefined')
                return cb(err, null);

            cb(null, result[0].dialog_id);
        });
    },
    switchDialog(dialog_name, lang, cb){
        Dialog.find({name: dialog_name, lang: lang}).exec(function (err, result) {
            if (err)
                sails.log(err);
            if (typeof result === 'undefined')
                return cb(err, null);

            cb(null, result[0].dialog_id);
        });
    }
}