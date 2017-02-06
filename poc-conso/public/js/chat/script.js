var $loading = $('.preloader');

const users = [
    // Alain Paul
    {
        id_client: "26196b38-be49-fb8f-0c13-57723fccf91b",
        id_carte: "ed940ce0-dcf9-89b4-b797-57f519f64074"
    },
    // Stéphane berger
    {
        id_client: "e6780606-e902-3d42-d4c8-57c5588813f3",
        id_carte: "81db24a8-7fe1-735c-007b-57c55850ee5b"
    },
    // Patrick Meyer
    {
        id_client: "59d8f4af-3766-ccdd-e846-57d7c6cdcd91",
        id_carte: "1f6f53f4-71d3-d5f5-e19f-57d7c65b36fe"
    },
    // Christophe Husson
    {
        id_client: "5d2f790d-c822-ce3b-c753-57d7c65dd9f4",
        id_carte: "545d2ea1-cd0a-1482-73a2-57d7c6536326"
    },
    // Rémy Lespagnol
    {
        id_client: "d8359f88-75cb-77cb-9f94-57d7c6177f10",
        id_carte: "916620ed-a9bc-5d77-ef3b-57d7c61281ce"
    },
    // Salif Gassama
    {
        id_client: "dbc926e0-411f-702e-b0aa-57d7c6b8eee5",
        id_carte: "84c34498-83d8-adea-ef55-57d7c64563eb"
    },
    // Martin Meffre
    {
        id_client: "b14d280a-ea50-5105-a819-57c5578f8283",
        id_carte: "5bb58147-a317-05ea-808c-57c557299656"
    },
    // Philippe Serafin
    {
        id_client: "aaabe0bd-c427-5cdb-224a-57d7c681738e",
        id_carte: "3d3ccd7c-33fa-9a70-cc10-57d7c6df7a76"
    },
    // Ronan Lucas
    {
        id_client: "77a65abe-5dca-22e7-a1eb-57d7c6d6c082",
        id_carte: "532bf918-5aa2-395e-13cb-57d7c6318cf2"
    },
];
var user_index = 0;
var warning_message = false;

jQuery.fn.extend({
    disable: function (state) {
        return this.each(function () {
            this.disabled = state;
        });
    }
})

$('document').ready(function () {
    $loading.hide();
    $('#send').disable(true);
    init_crm();
});

var handleUserMessage = function (message) {
    //micOnClick(false)
    stopMicro();

    var question = $('#question').val()

    if (message)
        question = message;

    if (question.length !== 0) {

        $loading.show();
        addUserMessage(question);

        $.post('/chat/message', {
            text: question,
            ginger: $('#ginger').is(':checked')
        }).done(function onSucess(answers) {
            var obj = answers;
            updateLastMessage(obj.input);
            addWatsonMessage(obj.response);
            if (obj.update) {
                init_crm();
            }
        }).fail(function onError(error) {
            alert(JSON.stringify(error));
        }).always(function always() {
            $loading.hide();
        });
    }
    $('#question').val('').focus();

    //if(!needTTS) micOnClick(false)
    if (!needTTS) startMicro();
};

var addUserMessage = function (message) {
    var commentArea = $('.commentArea');
    commentArea.append('<div class="bubbledRight">' + message + '</div>');
    $(".commentArea").animate({
        scrollTop: $('.commentArea').prop("scrollHeight")
    }, 800);
};

var updateLastMessage = function (message) {
    if ($("#ginger").is(':checked')) {
        $('.commentArea .bubbledRight:last').html(message);
    }
}

var addWatsonMessage = function (messages) {
    // message is an array

    addWatsonMessRec(messages, 0);

    var allText = messages.join('');
    var messageWithoutHTML = allText.replace(/<(?:.|\n)*?>/gm, '')
    messageWithoutHTML = messageWithoutHTML.replace(';', '; ')
        .replace('.', '. ').replace('<br />', ' ');

    if (needTTS) playText(messageWithoutHTML)
};

function addWatsonMessRec(messages, i) {

    if (i >= messages.length) return;

    var message = messages[i];
    var commentArea = $('.commentArea');

    commentArea.append('<div class="bubbledLeft">' + message + '</div>');
    $(".commentArea").animate({
        scrollTop: $('.commentArea').prop("scrollHeight")
    }, 800);

    setTimeout(function () {
        addWatsonMessRec(messages, i + 1)
    }, 500);


}

$('#send').click(function () {
    handleUserMessage();
});
$('#resetCookies').click(function () {
    reinit(function () {
        $('#start').hide();
        $('#send').disable(false);
        $loading.show();
        init();
    });
});
$("#question").keyup(function (e) {
    if (e.keyCode == 13) {
        handleUserMessage();
    }
});
$(".question").click(function () {
    handleUserMessage($(this).text());
})

var init = function () {
    $.post('/chat/message', {
        text: 'conversation_start',
        id_client: users[user_index].id_client
    }).done(function onSucess(answers) {
        var obj = answers;
        addWatsonMessage(obj.response);
    }).fail(function onError(error) {
        //alert(JSON.stringify(error));
    }).always(function always() {
        $loading.hide();
    });
};
var reinit = function (cb) {
    $('.commentArea').empty();
    $.post('/chat/removeCookies', {})
        .done(function onSucess(answers) {
            warning_message = false;
            updateWarning();
            cb();
        }).fail(function onError(error) {
        alert(JSON.stringify(error));
    })
}
function updateWarning() {
    $('.warning-message').toggleClass('hidden', !warning_message)
}


$('#start').click(function (e) {
    reinit(function () {
        $('#start').hide();
        $('#send').disable(false);
        $loading.show();
        init();
    });
})

var init_crm = function () {
    $.post('/chat/getClientInfo', {
        id_client: users[user_index].id_client
    }).done(function onSucess(result) {
        if(result){
            var client = result;
            var account = result.accounts[0];
            var card = result.accounts[0].cards[0];


            $("#name").html(client['full_name']);
            $("#address").html(client['address']);
            $("#phone").html(client['phone']);
            $("#birth").html(client['birth']);
            $("#current_location_city").html(client['birth_place']);

            $("#balance").html('$' + account['balance']);

            $("#int_option").prop('checked', card['int_option'] == '1');
            $("#web_option").prop('checked', card['web_option'] == '1');

            $("#status").val(card['status']);

            $("#field_out_dom_with").val(card['out_dom_with']);
            $("#field_lim_dom_with").val(card['lim_dom_with']);
            $("#field_out_int_with").val(card['out_int_with']);
            $("#field_lim_int_with").val(card['lim_int_with']);
            $("#field_out_dom_pay").val(card['out_dom_pay']);
            $("#field_lim_dom_pay").val(card['lim_dom_pay']);
            $("#field_out_int_pay").val(card['out_int_pay']);
            $("#field_lim_int_pay").val(card['lim_int_pay']);
        }

    }).fail(function onError(error) {
        swal(JSON.stringify(error));
    }).always(function always() {
        // do sth
    });
}

$("#int_option").click(function () {
    //var xmlhttp = new XMLHttpRequest();
    var int_option = 1;
    if ($("#int_option").is(':checked')) {
        int_option = 1;
    }
    else {
        int_option = 0;
    }

    requestToggle('int_option', int_option, "International option")
});
$("#web_option").click(function () {
    //var web_option = 1;
    if ($("#web_option").is(':checked')) {
        web_option = 1;
    }
    else {
        web_option = 0;
    }
    requestToggle('web_option', web_option, "Web option")
});
$("#button_out_dom_with").click(function () {
    request('out_dom_with', 'Domestic sold')
});
$("#button_lim_int_with").click(function () {
    request('lim_int_with', 'International limit')
});
$("#button_out_int_with").click(function () {
    request('out_int_with', 'International sold')
});
$("#button_lim_dom_with").click(function () {
    request('lim_dom_with', 'Domestic limit')
});

$("#button_out_dom_pay").click(function () {
    request('out_dom_pay', 'Domestic sold')
});
$("#button_lim_int_pay").click(function () {
    request('lim_int_pay', 'International limit')
});
$("#button_out_int_pay").click(function () {
    request('out_int_pay', 'International sold')
});
$("#button_lim_dom_pay").click(function () {
    request('lim_dom_pay', 'Domestic limit')
});

$('#users-select').change(function () {
    user_index = parseInt($('#users-select').val());
    reinit(function () {
        $('#start').show();
        $('#send').disable(true);
        init_crm();
    })

})
$('#status').change(function () {
    const status = $('#status').val();
    requestToggle('status', status, 'Card status')
})

$(document).on('submit', '.feedback', function (e) {
    var $btn = $('.send');
    $btn.button('loading');
    $.ajax({
        url: '/chat/sendEmail',
        type: 'post',
        data: $(this).serialize(),
        success: function (html) {
            setTimeout(function () {
                $btn.button('reset');
                $('#feedbackModal').modal('hide')
            }, 1000);
        }
    });

    e.preventDefault();
});

$('#ginger').prop('checked', true);

var request = function (id, text) {
    var item = $("#field_" + id).val();

    $.post('/chat/updateField', {
        id: users[user_index].id_carte,
        field: id,
        value: item
    }).done(function onSucess(result) {
        //swal(text + ' set to ' + item + '$');
        warning_message = true;
        updateWarning();
    }).fail(function onError(error) {
        swal(JSON.stringify(error));
    }).always(function always() {
        // do sth
    });
}
var requestToggle = function (id, value, text) {

    $.post('/chat/updateField', {
        id: users[user_index].id_carte,
        field: id,
        value: value
    }).done(function onSucess(result) {
        //swal(text + ' set to ' + value );
        warning_message = true;
        updateWarning();
    }).fail(function onError(error) {
        swal(JSON.stringify(error));
    }).always(function always() {
        // do sth
    });
}
