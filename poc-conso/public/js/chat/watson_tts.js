/**
 * Created by rlespagnol on 02/09/2016.
 */
var audio = $('.audio').get(0);
var voice = 'en-US_AllisonVoice';

function synthesizeRequest(options, audio) {
    var sessionPermissions = JSON.parse(localStorage.getItem('sessionPermissions')) ? 0 : 1;
    var downloadURL = '/api/synthesize' +
        '?voice=' + options.voice +
        '&text=' + encodeURIComponent(options.text) +
        '&X-WDC-PL-OPT-OUT=' + sessionPermissions;

    if (options.download) {
        downloadURL += '&download=true';
        window.location.href = downloadURL;
        return true;
    }
    audio.pause();
    audio.src = 'https://text-to-speech-demo.mybluemix.net' + downloadURL;
    audio.addEventListener('canplaythrough', onCanplaythrough);
    audio.addEventListener('ended', onEnded);
    audio.muted = true;
    audio.play();
    $('body').css('cursor', 'wait');
    $('.speak-button').css('cursor', 'wait');
    return true;
}

function onEnded() {
    startMicro();
    //micOnClick()
}

function onCanplaythrough() {
    console.log('onCanplaythrough');
    var audio = $('.audio').get(0);
    audio.removeEventListener('canplaythrough', onCanplaythrough);
    try {
        audio.currentTime = 0;
    }
    catch (ex) {
        // ignore. Firefox just freaks out here for no apparent reason.
    }
    audio.controls = true;
    audio.muted = false;
    $('.result').show();
    $('.error-row').css('visibility', 'hidden');
    $('html, body').animate({scrollTop: $('.audio').offset().top}, 500);
    $('body').css('cursor', 'default');
    $('.speak-button').css('cursor', 'pointer');
}

function playText(text) {
    $('.result').hide();

    $('#textArea').focus();

    var utteranceOptions = {
        text: text,
        voice: voice,
        sessionPermissions: JSON.parse(localStorage.getItem('sessionPermissions')) ? 0 : 1
    };

    synthesizeRequest(utteranceOptions, audio);

    return false;
};