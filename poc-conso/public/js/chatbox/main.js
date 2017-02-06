    var $loading = $('.preloader');
    var conversation_id = '';



    var users = [
        // Alain Paul
        {
            client_id: "26196b38-be49-fb8f-0c13-57723fccf91b",
            id_carte: "ed940ce0-dcf9-89b4-b797-57f519f64074",
            name: "Alain Paul"
        },
        // Stéphane berger
        {
            client_id: "e6780606-e902-3d42-d4c8-57c5588813f3",
            id_carte: "81db24a8-7fe1-735c-007b-57c55850ee5b",
            name: "Stéphane berger"

        },
        // Patrick Meyer
        {
            client_id: "59d8f4af-3766-ccdd-e846-57d7c6cdcd91",
            id_carte: "1f6f53f4-71d3-d5f5-e19f-57d7c65b36fe",
            name: "Patrick Meyer"

        },
        // Christophe Husson
        {
            client_id: "5d2f790d-c822-ce3b-c753-57d7c65dd9f4",
            id_carte: "545d2ea1-cd0a-1482-73a2-57d7c6536326",
            name: "Christophe Husson"

        },
        // Rémy Lespagnol
        {
            client_id: "d8359f88-75cb-77cb-9f94-57d7c6177f10",
            id_carte: "916620ed-a9bc-5d77-ef3b-57d7c61281ce",
            name: "Rémy Lespagnol"

        },
        // Salif Gassama
        {
            client_id: "dbc926e0-411f-702e-b0aa-57d7c6b8eee5",
            id_carte: "84c34498-83d8-adea-ef55-57d7c64563eb",
            name: "Salif Gassama"

        },
        // Martin Meffre
        {
            client_id: "b14d280a-ea50-5105-a819-57c5578f8283",
            id_carte: "5bb58147-a317-05ea-808c-57c557299656",
            name: "Martin Meffre"

        },
        // Philippe Serafin
        {
            client_id: "aaabe0bd-c427-5cdb-224a-57d7c681738e",
            id_carte: "3d3ccd7c-33fa-9a70-cc10-57d7c6df7a76",
            name: "Philippe Serafin"

        },
        // Ronan Lucas
        {
            client_id: "77a65abe-5dca-22e7-a1eb-57d7c6d6c082",
            id_carte: "532bf918-5aa2-395e-13cb-57d7c6318cf2",
            name: "Ronan Lucas"

        },
        // René lebrun
        {
            client_id: "a0244afb-dbf9-bb26-02dd-580e345f4598",
            id_carte: "1c41963f-14ee-7976-fdc4-580e34d391a5",
            name: "René lebrun"

        },
        // Suzanne Raymond
        {
            client_id: "42c5e1d0-f83a-8776-4b0f-580e34640728",
            id_carte: "bead5115-6716-17dd-5324-580e34d677a3",
            name: "Suzanne Raymond"

        },
        // Etienne hoarau
        {
            client_id: "dc9e15e5-5fc9-bb55-a6d6-580e34eb8d9c",
            id_carte: "5c5cb3c2-b0d3-a5d7-23e1-580e345805bb",
            name: "Etienne hoarau"

        },
        // Noel samson
        {
            client_id: "3a8eeca6-6b7c-6c11-3369-580e34834f3d",
            id_carte: "b58fb44c-d4e6-b3fc-ed11-580e3489e77c",
            name: "Noel samson"

        },
        // Alain Simon
        {
            client_id: "20c50a25-c495-ce33-8cc6-580e34a0b461",
            id_carte: "7755b843-4c45-a4bd-8c07-580e3472874c",
            name: "Alain Simon"

        },
        // Aurelie lemaitre
        {
            client_id: "d4f90b36-14fa-05ef-9b2f-580e34e31347",
            id_carte: "866b70ad-c8fc-d5c8-e76e-580e3469b6dd",
            name: "Aurelie lemaitre"

        },
        // Lucie Hamon
        {
            client_id: "750cd798-aab8-87fa-8e5d-580e34177316",
            id_carte: "ed1765c8-9e05-0bc1-01bb-580e348e264b",
            name: "Lucie Hamon"

        }, // Pierre Levy
        {
            client_id: "ccdb1a7a-8e80-a8d9-2d34-580e34a357e7",
            id_carte: "4ce825ba-8af8-7e78-41aa-580e3405e1a6",
            name: "Pierre Levy"

        }
    ];
    var client = {};
    var lastClientData = {};
    var lastFormData = {};


    $(document).ready(function() {

                    hideDialog();

        $('#logo-watson').click(function() {
            $('#logo-watson').effect("bounce", {
                distance: 25,
                direction: 'up',
                times: 3
            }, 300);

        });
        $('#demo-chat-body').on('show.bs.collapse', function() {
            // do something…
            $('#logo-watson').effect("bounce", {
                distance: 25,
                direction: 'up',
                times: 3
            }, 300);

        })




        $("#inputFormProjectType").imagepicker();
        $("#inputFormProjectType").change(function() {
            console.log("change picker");
            console.log(this);
                 console.log( $(this).find(":selected")[0].getAttribute("data-img-src"));
                 var src=$(this).find(":selected")[0].getAttribute("data-img-src");
                 var value=$(this).find(":selected")[0].getAttribute("value");
                             console.log(src);
                             console.log(value);
if(value){
$('.result-projectType').attr('src', src);

                 $('#group-result-projectType').show(300);
                 $('#group-inputFormProjectType').hide(300);
            console.log($('.result-projectType'));
}else{
                                 console.log("empty");


}

                 

        });

        $("#inputFormCurrency").change(function() {
            $("#amount-currency").val($("#inputFormCurrency").val());
        });


        $("#amount-currency").change(function() {
            $("#inputFormCurrency").val($("#amount-currency").val());
        });

        $("#inputFormOptionInsurance").change(function() {
            if ($("#inputFormOptionInsurance")[0].checked == true) {
                $("#resultInsurance").show(500);
            } else {
                $("#resultInsurance").hide(500);

            }
        });


        $("#inputFormTime").slider();

        $("#inputFormTime").change(function(slideEvt) {
            console.log("cahnge slide");
            console.log(slideEvt);

            $("#ex6SliderVal").text(slideEvt.value.newValue);
            updateCalculSimulationData(slideEvt.value.newValue);

        });


        $("#inputFormTime").on("slide", function(slideEvt) {
            console.log("cahnge slide2");

        });
        if (getQueryVariable("client_id") && getQueryVariable("name")) {

            console.log("identifié");
            client.client_id = getQueryVariable("client_id");
            client.name = decodeURIComponent(getQueryVariable("name"));
        } else {
            client = users[0];


        }
        console.log($(".user-name-value"));
        $(".user-name-value").text(client.name);


        var formulaire = {};
        if (getQueryVariable("form")) {
            console.log("formulaire");

            console.log(decodeURIComponent(getQueryVariable("form")));
            console.log(JSON.parse(decodeURIComponent(getQueryVariable("form"))));
            updateForm(JSON.parse(decodeURIComponent(getQueryVariable("form"))));
            formulaire = JSON.parse(decodeURIComponent(getQueryVariable("form")));

        } else {
            console.log("no formulaire");

        }


        initPage();


        var creditform = $('#credit-form');
        var lis = creditform.find(".form-data");


        lis.each(function(li) {
            if (lis[li].type == 'checkbox') {
                formulaire[lis[li].id] = lis[li].checked;

            } else {

                formulaire[lis[li].id] = lis[li].value;
            }
        });

              $( "#question" ).prop( "disabled", true );

            $.post('/chatbox/message', {
                     text: 'conversation_start',
                     form:formulaire,
                     action:'',
                     client_id: client.client_id

                 }).done(function onSucess(answers) {
                     var obj = answers;
                     console.log(obj);

                     conversation_id=obj.result.conversation_id;
                    lastClientData=obj.result.context.client;
                    lastFormData=obj.result.context.form;

                     //console.log(obj.result.conversation.output.text.join(' '));
                //     updateLastMessage(obj.wats);
                     addWatsonMessage(obj.result.responseWatson);
                     $( "#question" ).prop( "disabled", false );

        });

    });

    $('#send').click(function() {
        handleUserMessage();
    });

    $('#button-administrator-view').click(function() {
        console.log("button-administrator-view");
        console.log($('#group-application_fees'));
        $('#group-application_fees').show();
        $('#group-AmountByMonthMax').show();
        $('#group-inputFormOptionInsurancePrice').show();
        $('#group-inputFormCurrency').show();
        $('#group-inputFormAnnualRate').show();


    });
    $('#button-user-view').click(function() {
        console.log("button-user-view");
        $('#group-application_fees').hide();
        $('#group-AmountByMonthMax').hide();
        $('#group-inputFormOptionInsurancePrice').hide();
        $('#group-inputFormCurrency').hide();
        $('#group-inputFormAnnualRate').hide();




    });
    $('#button-reset').click(function() {
        console.log("button-reset");

    });

    $('#executeSimulation').click(function() {

        console.log("SISIMULATION");

        handlePingMessage('execute simulation');


    });


    var updateCalculSimulationData = function(slideVal) {
        console.log("calcul");
        var amount = parseInt($('#inputFormAmount').val());
        var month = parseInt($('#inputFormTime').val());
        var taux = $('#inputFormAnnualRate').val();
        var application_fees = parseInt($('#application_fees').val());
        var optionInsurancePrice = parseInt($('#inputFormOptionInsurancePrice').val());
        if (amount != null && amount != undefined && amount != "" && slideVal != null && slideVal != undefined && slideVal != "") {

            var mensualite = (((amount + application_fees + (month * optionInsurancePrice)) * taux / 12 * Math.pow((1 + taux / 12), month)) / (Math.pow(1 + taux / 12, month) - 1)).toFixed(2);


            $('#resultCalcul').text(mensualite + " " + $('#inputFormCurrency').val());
            $('#resultAnnualRate').text(($('#inputFormAnnualRate').val() * 100) + "%");
            $('#resultFees').text($('#application_fees').val() + " " + $('#inputFormCurrency').val());
            $('#resultInsuranceMonthly').text($('#inputFormOptionInsurancePrice').val() + " " + $('#inputFormCurrency').val());

            updateAPR();
        }

    }

    var updateAPR = function() {
        var amount = parseInt($('#inputFormAmount').val());
        var timeMonth = parseInt($('#inputFormTime').val());
        var assurancePrice = parseInt($('#inputFormOptionInsurancePrice').val());
        var taux = parseFloat($('#inputFormAnnualRate').val());
        var frais_de_dossier = parseInt($('#application_fees').val());

        bar.set(0);
        bar.animate(CalculateLoan(amount, taux, timeMonth, assurancePrice * timeMonth, frais_de_dossier));

        console.log("calculAPR");
    }




    var progress = $('#progressbar');

    var bar = new ProgressBar.Circle(progress[0], {
        color: '#aaa',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 1,
        trailWidth: 14,
        easing: 'easeInOut',
        duration: 2000,
        text: {
            autoStyleContainer: false
        },
        from: {
            color: '#337ab7',
            width: 7
        },
        to: {
            color: '#337ab7',
            width: 7
        },
        // Set default step function for all animate calls
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = Math.round(circle.value() * 100);
            if (value === 0) {
                circle.setText('');
            } else {
                circle.setText('APR<br/> ' + value + '%');
            }

        }
    });
    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.fontSize = '2rem';


    $("#title-credit").click(function(event, param) {
        $('#demo-chat-body').collapse("show");


        $('.nano-content').animate({
            scrollTop: $('.nano-content').prop("scrollHeight")
        }, 800);



    });




    $("#btn-download-fees").click(function(event, param) {
        generatePDF();
    });

    $('#inputFormAmount').on('input', function() {
        updateCalculSimulationData($('#inputFormTime').val());

    });

    var handleUserMessage = function(message) {


        var question = $('#question').val();
        var creditform = $('#credit-form');
        var lis = creditform.find(".form-data");

        var formulaire = {};
        lis.each(function(li) {
            if (lis[li].type == 'checkbox') {
                formulaire[lis[li].id] = lis[li].checked;

            } else {

                formulaire[lis[li].id] = lis[li].value;
            }
        });


        if (message)
            question = message;

        if (question.length !== 0) {

            console.log("contenue requete");
            console.log({
                text: question,
                form: formulaire,
                action: '',
                conversation_id: conversation_id
            });

            addUserMessage(question);
            $("#question").prop("disabled", true);

            $.post('/chatbox/message', {
                text: question,
                form: formulaire,
                action: '',
                conversation_id: conversation_id,
                client_id: client.client_id

            }).done(function onSucess(answers) {
                var obj = answers;
                console.log(obj);

                addWatsonMessage(obj.result.responseWatson);
                updateForm(obj.result.context.form);
                lastClientData = obj.result.context.client;
                lastFormData = obj.result.context.form;

                if (obj.result.hasOwnProperty("conversation") && obj.result.conversation.hasOwnProperty("output") && obj.result.conversation.output.hasOwnProperty("action")) {
                    goAction(obj.result.conversation.output.action);

                }

                $("#question").prop("disabled", false);

            });
        }
        $('#question').val('').focus();


    };




    var handlePingMessage = function(message) {


        var question = $('#question').val();
        var creditform = $('#credit-form');
        var lis = creditform.find(".form-data");

        var formulaire = {};
        lis.each(function(li) {
            if (lis[li].type == 'checkbox') {
                formulaire[lis[li].id] = lis[li].checked;

            } else {

                formulaire[lis[li].id] = lis[li].value;
            }
        });


        if (message)
            question = message;

        if (question.length !== 0) {

            console.log("contenue requete");
            console.log({
                text: question,
                form: formulaire,
                action: '',
                conversation_id: conversation_id
            });


            $("#question").prop("disabled", true);

            $.post('/chatbox/message', {
                text: question,
                form: formulaire,
                action: '',
                conversation_id: conversation_id,
                client_id: client.client_id

            }).done(function onSucess(answers) {
                var obj = answers;
                console.log(obj);

                addWatsonMessage(obj.result.responseWatson);
                updateForm(obj.result.context.form);
                lastClientData = obj.result.context.client;
                lastFormData = obj.result.context.form;

                if (obj.result.hasOwnProperty("conversation") && obj.result.conversation.hasOwnProperty("output") && obj.result.conversation.output.hasOwnProperty("action")) {
                    goAction(obj.result.conversation.output.action);

                }

                $("#question").prop("disabled", false);

            });
        }
        $('#question').val('').focus();


    };


    var goAction = function(actions) {
        if (actions.hasOwnProperty("show")) {
            actions.show.forEach(function(arrayItem) {
                console.log("action show :" + arrayItem);
                if (arrayItem == 'chat') {
                    showDialog();
                } else {
                                           if(arrayItem.indexOf("reglementation")>-1){
                            console.log("reglementation");
                            console.log(arrayItem);
                       console.log( $("div[id^='group-reglementation']"));
$("div[id^='group-reglementation']").hide();
                        }
                    $("#group-" + arrayItem).show(1500, function() {
                        if (arrayItem == "resultData") {

                            updateCalculSimulationData($('#inputFormTime').val());

                        }
 

                    });
                }
            });
        }
        if (actions.hasOwnProperty("hide")) {
            actions.hide.forEach(function(arrayItem) {
                console.log("action hide :" + arrayItem);
                $("#group-" + arrayItem).hide(5500);

            });
        }

    }

    var updateForm = function(form) {
        console.log("FORM : " + form.inputFormProjectType);

        var creditform = $('#credit-form');
        var lis = $(".form-data");

        lis.each(function(li) {
            console.log("TYPE : " + lis.eq(li).attr('id'));
         


            if (form.hasOwnProperty(lis.eq(li).attr('id'))  ) {
                if (lis.eq(li).attr('id') == 'inputFormTime') {
                    $('#inputFormTime').slider('setValue', form[lis.eq(li).attr('id')]);
                    $("#ex6SliderVal").text(form[lis.eq(li).attr('id')]);
                } else if (lis.eq(li).attr('type') == 'checkbox') {
                    console.log(form[lis.eq(li).attr('id')]);
                    console.log((form[lis.eq(li).attr('id')] === true || form[lis.eq(li).attr('id')] === 'true'));
                    lis.eq(li).prop('checked', (form[lis.eq(li).attr('id')] === true || form[lis.eq(li).attr('id')] === 'true'));
                    console.log("new CHECKBOX");
                    console.log(lis.eq(li).attr('checked'));
                    lis.eq(li).trigger("change");

                } else {

                    lis.eq(li).val(form[lis.eq(li).attr('id')]);
                    lis.eq(li).trigger("change");


                }

            }

            console.log(lis.eq(li).val());
        });
       // $("#inputFormProjectType").imagepicker();


    }

    var addUserMessage = function(message) {

        var blockdialog = $('.media-block');


        blockdialog.append('<li class="mar-btm"><div class="media-right"><img class="img-circle img-sm" src="http://bootdey.com/img/Content/avatar/avatar2.png"/>  </div><div class="media-body pad-hor speech-right"><div class="speech"><a class="media-heading" href="#"> ' + client.name + '</a><p>' + message + '</p></div></div></li>')
        $('.nano-content').animate({
            scrollTop: $('.nano-content').prop("scrollHeight")
        }, 800);

 

    };

    var addWatsonMessage = function(message) {

        var blockdialog = $('.media-block');


        blockdialog.append('<li class="mar-btm"><div class="media-left"><img class="img-circle img-sm" src="http://watson500.mybluemix.net/img/help/icon2.png"/>  </div><div class="media-body pad-hor speech-left"><div class="speech"><a class="media-heading" href="#"> Alicia</a><p>' + message + '</p></div></div></li>')
        $('.nano-content').animate({
            scrollTop: $('.nano-content').prop("scrollHeight")
        }, 800);
    };

    $('#send').click(function() {
        handleUserMessage();
    });


    

    $("#question").keyup(function(e) {
        //console.log(",,,,")
        if (e.keyCode == 13) {
            handleUserMessage();
        }
    });

    $(".question").click(function() {
        handleUserMessage($(this).text());
    })



    var initPage = function() {

        var usersMenu = $('#dropdown-menu-users');
        var li, textnode, a, nb = 0;
        users.forEach(function(arrayItem) {

            li = document.createElement("li");
            a = document.createElement("a");
            a.href = "./conso?client_id=" + arrayItem.client_id + "&name=" + arrayItem.name;

            textnode = document.createTextNode("" + arrayItem.name + " "); // Create a text node
            a.appendChild(textnode);
            li.appendChild(a);
            usersMenu.append(li);
            nb = nb + 1;
        });

    };

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    };



    function generatePDF() {
        console.log("genere pdf2");
        console.log(lastClientData);
        console.log(lastFormData);
        $.post('/chatbox/generatePDF', {
            client: lastClientData,
            form: lastFormData

        }).done(function onSucess(answers) {
            var obj = answers;
            var doc2 = new jsPDF();

            var specialElementHandlers = {
                '#editor': function(element, renderer) {
                    return true;
                }
            };

            doc2.fromHTML(obj, 15, 15, {
                'width': 180,
                'elementHandlers': specialElementHandlers
            }, function(dispose) {
                console.log("3clear joo fjrom html");

                doc2.save('credit2.pdf');


            });

        });




    }

    function calculateAPR(loanamount, numpayments, baseannualrate, costs) {
        /* 
        By Paul Cormier - Sep 10, 2010 - http://webmasterymadesimple.com
        loanamount  = the amount borrowed
        numpayments = number of monthly payments e.g. 30 years = 360
        baserate  = the base percentage rate of the loan. A 5.25% Annual Rate should be passed in as 0.0525 NOT 5.25
        costs   = the loan closing costs e.g. origination fee, broker fees, etc.
        */
        var rate = baseannualrate / 12;
        var totalmonthlypayment = ((loanamount + costs) * rate * Math.pow(1 + rate, numpayments)) / (Math.pow(1 + rate, numpayments) - 1);
        var testrate = rate;
        var iteration = 1;
        var testresult = 0;
        //iterate until result = 0
        var testdiff = testrate;
        while (iteration <= 100) {
            testresult = ((testrate * Math.pow(1 + testrate, numpayments)) / (Math.pow(1 + testrate, numpayments) - 1)) - (totalmonthlypayment / loanamount);
            if (Math.abs(testresult) < 0.0000001) break;
            if (testresult < 0) testrate += testdiff;
            else testrate -= testdiff;
            testdiff = testdiff / 2;
            iteration++;
        }
        testrate = testrate * 12;

        return testrate.toFixed(6);
    }

    function CalculateLoan(montant, taux, duree, prixAssurance, frais_de_dossier) {



        var mensualite_sans_frais = ((montant * taux / 12 * Math.pow((1 + taux / 12), duree)) / (Math.pow(1 + taux / 12, duree) - 1)).toFixed(2);
        var montantTotal = (mensualite_sans_frais * duree) + (prixAssurance * duree);
        var cout = (montantTotal - montant).toFixed(2);
        var mensualite = montantTotal / 12;
        var taeg2 = (((((montantTotal + frais_de_dossier) - montant) / montant) * 12) / duree);


        return taeg2;
    }