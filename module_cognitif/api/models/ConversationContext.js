/**
 * Created by rlespagnol on 03/08/2016.
 */


module.exports = {
    schema: true,

    attributes: {
        conversation_id: {
            type: 'string',
            required: true,
            unique : true,
            primaryKey : true
        },

        workspace_id: {
            type: 'string',
        },
        context: {
            type: 'json',
            defaultsTo: {}
        },
        toJSON() {
            return this.toObject();
        }
    },

    saveConversation(conversation_id, workspace_id, context, cb){
            ConversationContext.update({conversation_id : conversation_id}, {workspace_id : workspace_id, context : context}).exec(function(e, updated){
             //   sails.log('Update : ' + JSON.stringify(updated))

                if(e){
                    cb(e, null);
                    return;
                }
                cb(null, updated);
            })
    },

    findOrCreateUser(conversation_id, workspace_id, cb){
        ConversationContext.findOrCreate({conversation_id : conversation_id}, {conversation_id : conversation_id, workspace_id : workspace_id, context : {} }).exec(function(err, theUser){
            if(err){
                cb(err, null);
                return;
            }
            cb(null, theUser);

        });
    },

    beforeUpdate: (values, next) => next(),
    beforeCreate: (values, next) => next()
};