var ua = navigator.userAgent.toLowerCase();
var check = function (r) {
    return r.test(ua);
};
var isOpera = check(/opera/);
var isChrome = check(/chrome/);
var isFF = check(/firefox/);
var isIE11 = !(window.ActiveXObject) && "ActiveXObject" in window;
var isIE = !isOpera && (isIE11 || check(/msie/));
var canWork = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

$(document).ready(function () {
    if (!canWork || (!isChrome && !isFF && !isOpera)) {
        $('.mic').hide();
        $('#microphoneText').hide();
        $('.warnInfo').show();
        $('.firstRow').css("backgroundColor", "white");
    }

    $('.samplelink1').click(function () {
        if ($(this).hasClass('playing')) {
            resetSound();
        } else {
            startDemo();
            startWebSocketWithFile('1');
            websocket.onopen = function (event) {
                playSound($('.sample1').get(0));

                //call telemetry for speech demo.
                //window.telemetry.trackDemo("Speech", "Speech to Text", "PlaySample", { index: "1" });
            }
        }
    });

    $('.samplelink2').click(function () {
        if ($(this).hasClass('playing')) {
            resetSound();
        } else {
            startDemo();
            startWebSocketWithFile('2');
            websocket.onopen = function (event) {
                playSound($('.sample2').get(0));

                //call telemetry for speech demo.
                //window.telemetry.trackDemo("Speech", "Speech to Text", "PlaySample", { index: "2" });
            }
        }
    });

    $('.sample').bind('play', function () {
        audioStatusChanged(this, true);
    }).bind('ended', function () {
        audioStatusChanged(this, false);
    }).bind('pause', function () {
        audioStatusChanged(this, false);
    });

    $('.mic.demo_btn').click(function () {
        //micOnClick(true);
        toggleMicro();
    });

    $('#languageoptions').change(function () {
        stopRecording();
        var lang = $('#languageoptions').val();

        // fr-fr only have one good sample for now
        if (lang == 'fr-FR') {
            $('#speech_sample_2').hide();
        } else {
            $('#speech_sample_2').show();
        }
        $('#hidden').html("<audio preload=\"auto\" autobuffer controls src=\"" + window.applicationRoot + "/Modules/Microsoft.ProjectOxford.Website.Demos/Audios/" + lang.toLowerCase() + "-1.mp3\" class=\"sample1\"></audio><audio preload=\"auto\" autobuffer controls src=\"" + window.applicationRoot + "/Modules/Microsoft.ProjectOxford.Website.Demos/Audios/" + lang.toLowerCase() + "-2.mp3\" class=\"sample2\"></audio>");
    });
});

function startDemo() {
    resetSound();
    stopRecording();
    $('#question').empty();
    textDisplay = "";
}

function audioStatusChanged(audio, isPlay) {
    var index = parseInt($(audio).data("index"));
    var btn = $(".samplelink".concat(index));

    if (isPlay) {
        btn.addClass("playing");
    } else {
        btn.removeClass("playing");
    }
};

function resetSound() {
    stopWebSocket();
    //stopSounds();
    $(".samplelink1").removeClass("playing");
    $(".samplelink2").removeClass("playing");
}

$("#micro").click(function () {
    //micOnClick(false);
    toggleMicro();
});

$("#tts").click(function () {
    needTTS = $("#tts").is(':checked');
});