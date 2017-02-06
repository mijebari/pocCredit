
const request = require('request');
const cheminPrincipal='http://localhost:3001';
//const cheminPrincipal='http://module-poc-credit.eu-gb.mybluemix.net';

const conversationServer = cheminPrincipal + '/v1/conversation';

exports.conso = (req, res) => {
        var theme = req.query.theme;
    if (theme == null || theme == undefined || theme == "") {
        theme = "all";
    }
    res.render('credit_conso/index', {
        title: 'conso',
        theme:theme
    });
};



exports.generatePDF = (req, res) => {
        var form1 = req.body.form;
        var client1 = req.body.client;
        console.log("req.query2");
        console.log(req.body);
                var form = {};
        var client = {};
        var account = {};
    if (form1 != null && form1 != undefined ) {
form=form1;
    }
         

    if (client1 != null && client1 != undefined ) {
client=client1;
if(client1.hasOwnProperty("accounts") && client1.accounts.length>0){
    account=client1.accounts[0];
    }
         }


var fields ={
first_name:(client.hasOwnProperty("first_name"))? client.first_name : "_________________",
last_name:(client.hasOwnProperty("last_name")) ? client.last_name : "_________________",
address:(client.hasOwnProperty("address")) ? client.address : "_________________",
city:(client.hasOwnProperty("city")) ? client.city : "_________________",
department:(client.hasOwnProperty("city")) ? client.city : "_________________",
country:(client.hasOwnProperty("department")) ? client.department : "_________________",
birth_date:(client.hasOwnProperty("birth_date")) ? client.birth_date : "_________________",
mail:(client.hasOwnProperty("mail")) ? client.mail : "_________________",
phone:(client.hasOwnProperty("phone")) ? client.phone : "_________________",
cell_phone:(client.hasOwnProperty("cell_phone")) ? client.cell_phone : "_________________",
acc_name:(account.hasOwnProperty("acc_name")) ? account.acc_name : "_________________",
acc_number:(account.hasOwnProperty("acc_number")) ? account.acc_number : "_________________",
code_branch:(account.hasOwnProperty("code_branch")) ? account.code_branch : "_________________",
rib:(account.hasOwnProperty("rib")) ? account.rib : "_________________",
iban:(account.hasOwnProperty("iban")) ? account.iban : "_________________",
project_type:(form.hasOwnProperty("inputFormProjectType")) ? form.inputFormProjectType : "_________________",
application_fees:(form.hasOwnProperty("application_fees")) ? form.application_fees : "_________________",
amount:(form.hasOwnProperty("inputFormAmount")) ? form.inputFormAmount : "_________________",
currency:(form.hasOwnProperty("inputFormCurrency")) ? form.inputFormCurrency : "_________________",
insurance:(form.hasOwnProperty("inputFormOptionInsurance")) ? (form.inputFormOptionInsurance=="true") : false,
time:(form.hasOwnProperty("inputFormTime")) ? form.inputFormTime : "_________________",
};
    res.render('credit_conso/pdf', {
        title: 'pdf',
        form:form,
        client:{first_name:"____________"
        ,last_name:"GASSAMA",
        adress:"5 place de l'iris",
        city:"Paris",
        data_birth:"21/03",
        },
        fields:fields,
        data:"ok"
    });
};

exports.message = (req, res) => {
    console.log('post message');
    request({
        url: conversationServer + '/',
        qs: {
            text: req.body.text,
            action:req.body.action,
            form:req.body.form,
            conversation_id:req.body.conversation_id,
            client_id:req.body.client_id

        }
    }, function(e, r, body) {

        if (!e && r.statusCode == 200) {
            var object = JSON.parse(body);
            console.log(object)
            return res.json(object);
        }
        else{
            return res.json({err:e,
                r:r});
        }
    })
};