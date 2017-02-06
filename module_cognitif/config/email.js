/**
 * Created by rlespagnol on 12/09/2016.
 */


module.exports.email = {
    service: "Mailgun",
    auth: {
        user: "postmaster@sandboxcc74c0c0919e4be59040d5ca5e783a62.mailgun.org",
        pass: "1f40765dc8c4bf9521e8450e84aa4fe8"
    },
    templateDir: "api/emailTemplates",
    from: "admin@watson.com",
    testMode: false,
    ssl: true
}