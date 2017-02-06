var websocket = null;
var textDisplay = "";

function startWebSocketWithFile(file) {
    startDemo();
    /// TODO: Hack to get around restrictions of Akamai on websocket.
    var hostString = "cog-web-wu.azurewebsites.net";
    // if (window.location.port != "80" && window.location.port != "")
    // {
    //     hostString=hostString.concat(":").concat(window.location.port);
    // }

    var uri = 'wss://' + hostString + '/cognitive-services/ws/speechtotextdemo?file=' + file + '&language=en-US&g_Recaptcha_Response=null&isNeedVerify=false';
    websocket = getWebSocket(uri);
}

function startWebSocketForMic() {
    startDemo();
    /// TODO: Hack to get around restrictions of Akamai on websocket.
    var hostString = "cog-web-wu.azurewebsites.net";
    // if (window.location.port != "80" && window.location.port != "") {
    //     hostString = hostString.concat(":").concat(window.location.port);
    // }
    var uri = 'wss://' + hostString + '/cognitive-services/ws/speechtotextdemo?language=en-US&g_Recaptcha_Response=null&isNeedVerify=false';
    websocket = getWebSocket(uri);
    websocket.onopen = function () {
        audioRecorder.sendHeader(websocket);
        audioRecorder.record(websocket);

        $('.mic.demo_btn').addClass("listening");
        $('#microphoneText').text("Please speak. Click on the microphone again to stop listening.");
    };
}

function getWebSocket(uri) {
    websocket = new WebSocket(uri);
    websocket.onerror = function (event) {
        stopRecording();
        websocket.close();
    };

    websocket.onmessage = function (event) {

        var data = event.data.toString();

        if (data == null || data.length <= 0) {
            return;
        }
        else if (data == "Throttled" || data == "Captcha Fail") {
            $('#question').val(data).focus();
            //reCaptchaSdk.ProcessReCaptchaStateCode(data, 'reCaptcha-Speech2Text-demo');
            //stopSounds();
            return;
        }
        else {
            //reCaptchaSdk.RemoveReCaptcha();
        }
        if (data == null || data.length <= 0) {
            return;
        }

        var ch = data.charAt(0);
        var message = data.substring(1);
        if (ch == 'e') {
            stopRecording();
        }
        else {
            var text = textDisplay + message;
            if (ch == 'f') {
                textDisplay = text + " ";
            }
            $('#question').val(text).focus();

            if(text.indexOf('.') > -1){
                $('#send').click();
            }
        }
    };

    websocket.onclose = function (event) {
        stopRecording();
    };

    return websocket;
}
