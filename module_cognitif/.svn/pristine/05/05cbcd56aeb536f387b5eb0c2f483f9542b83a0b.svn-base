/**
 * Created by rlespagnol on 12/09/2016.
 */
module.exports = {
    sendWelcomeMail: function (obj) {
        sails.hooks.email.send(
            "welcomeEmail",
            {
                Name: obj.name
            },
            {
                to: obj.email,
                subject: "Welcome Email"
            },
            function (err) {
                console.log(err || "Mail Sent!");
            }
        )
    },
    sendFeedBackMail(obj) {
        sails.hooks.email.send(
            "feedback",
            {
                Client_id : obj.client_id || 'None',
                Email: obj.email || 'None',
                Expectation : obj.expect || 'None',
                Comment: obj.comment || 'None',
                Inputs : obj.inputs || [],
                Outputs : obj.outputs || []
            },
            {
                to: "remy.lespagnol@soprasteria.com",
                subject: "[POC WATSON] Feedback"
            },
            function (err) {
                console.log(err || "Mail Sent!");
            }
        )
    }
}