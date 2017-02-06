/**
 * Created by atong on 11/08/2016.
 */

module.exports = {

    schema:true,

    attributes: {
        name: {
            type: 'string'
        },
        values: {
            type:'array',
            required: true
        },
        scenario: {
            model:'script'
        }
    },

    addBranch: function(branch, cb) {
        Branch.create(branch).exec(cb);
    },

    deleteBranch: function(id, cb) {
        Branch.destroy({id: id}).exec(cb);
    },

    destroyAll: function(cb) {
        Branch.destroy().exec(cb);
    }
};

