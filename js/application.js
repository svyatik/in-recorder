require('../renderer.js')

const remote = require('electron').remote;

window.onload = function() {
    const $btn_region = document.getElementById('button_region');
    const $btn_full_screen = document.getElementById('button_full_screen');
    const $btn_recorder = document.getElementById('button_recorder');

    $btn_region.onclick = function() {
        $btn_region.classList.add('active');
        $btn_full_screen.classList.remove('active');
    }

    $btn_full_screen.onclick = function() {
        $btn_full_screen.classList.add('active');
        $btn_region.classList.remove('active');
    }

    let recording = false;
    $btn_recorder.onclick = function() {
        if(recording) {
            $btn_recorder.classList.remove('active');
            recording = false;

            document.getElementById('msg_2').classList.remove('active');
            document.getElementById('msg_1').classList.add('active');
        } else {
            $btn_recorder.classList.add('active');
            recording = true;

            document.getElementById('msg_1').classList.remove('active');
            document.getElementById('msg_2').classList.add('active');
        }
    }

    document.getElementById("btn_close").onclick = function() {
        var window = remote.getCurrentWindow();
        window.close();
    };
}
