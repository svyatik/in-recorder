// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs')
const {desktopCapturer} = require('electron')
const toBuffer = require('blob-to-buffer')
const remote = require('electron').remote;

var recorder;
var blobs = [];

function startRecording() {
desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {

  if (error) throw error
  for (let i = 0; i < sources.length; ++i) {
    console.log(sources[i].name);
    if (sources[i].name === 'Entire screen') {
        console.log(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
        },
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720
          }
        }
      }).then((stream) => handleStream(stream))
      .catch((e) => handleError(e))
      return
    }
  }
})
}

/*function handleStream (stream) {
    console.log("Stream: "+URL.createObjectURL(stream))
  document.querySelector('video').src = URL.createObjectURL(stream)
}*/

function handleStream(stream) {
    // document.querySelector('video').src = URL.createObjectURL(stream)
    recorder = new MediaRecorder(stream);
    blobs = [];
    recorder.ondataavailable = function(event) {
        blobs.push(event.data);

        console.log("There " + blobs[0]);

        // console.log(blobs);
    };

    recorder.onstop = function(e) {

            var blob = new Blob(blobs, {type: 'video/webm'});
             
            var buffer = toBuffer(blob, function (err, buffer) {
              if (err) throw err
             
              buffer[0] // => 1 
              buffer.readUInt8(1) // => 2 

                var file = './tmp/video.webm';
                fs.writeFile(file, buffer, function(err) {
                    if (err) {
                        console.error('Failed to save video ' + err);
                    } else {
                        console.log('Saved video: ' + file);
                    }
                });
            })



            var arrayBuffer;
            var fileReader = new FileReader();
            fileReader.onload = function(event) {
                arrayBuffer = event.target.result;

                // console.log(arrayBuffer);

                
            };
            fileReader.readAsArrayBuffer(blob);

            
            createAnotherWindow();

    }

    recorder.start();


}


function handleError (e) {
  console.log(e)
}

function stopRecording() {
    recorder.stop();
    // console.log('stopped');
    // console.log('blobs: '+blobs.length);

    // Get a Blob somehow... 
    


    /*toArrayBuffer(new Blob(blobs, {type: 'video/mpeg'}), function(ab) {
        var buffer = toBuffer(ab);
        console.log("buffer: "+typeof buffer);
        console.log(ab);
        var file = './tmp/example.mpeg';
        fs.writeFile(file, buffer, function(err) {
            if (err) {
                console.error('Failed to save video ' + err);
            } else {
                console.log('Saved video: ' + file);
            }
        });
    });*/
}

/*function toArrayBuffer(blob, cb) {
    let fileReader = new FileReader();
    fileReader.onload = function() {
        console.log('two');
        let arrayBuffer = this.result;
        cb(arrayBuffer);
    };
    console.log('one');
    fileReader.readAsArrayBuffer(blob);
}

function toBuffer(ab) {
    let buffer = new Buffer(ab.byteLength);
    let arr = new Uint8Array(ab);
    for (let i = 0; i < arr.byteLength; i++) {
        buffer[i] = arr[i];
    }
    return buffer;
}*/

// Record for 7 seconds and save to disk
// startRecording();
// setTimeout(function() { stopRecording() }, 20000)

/*document.getElementById('close').addEventListener('click', function(e) {
    var window = remote.getCurrentWindow()
    window.close()
})*/

var record_process = false;
let timer;
document.getElementById('button_recorder').addEventListener('click', function(e) {
    // createAnotherWindow();
    console.log('test')

    // document.getElementsByClassName('wrapper2')[0].classList.add('active')


    if (!record_process) {
        const $timer_id = document.getElementById('timer')

        startRecording()
        minimize()
        record_process = true
        console.log('start recording...')

        let seconds = 0,
            minutes = 0

        timer = setInterval(function() {
            // console.log(seconds.toString().length)

            seconds++

            if(seconds >= 60) {
                minutes++
                seconds = 0
            }

            let seconds_str = seconds,
                minutes_str = minutes;

            if(seconds.toString().length === 1) {
                seconds_str = '0' + seconds
                console.log();
            }

            if(minutes.toString().length === 1)
                minutes_str = '0' + minutes;

            // console.log('0' + seconds);

            $timer_id.innerHTML = minutes_str + ':' + seconds_str;
            /*else
                $timer_id.innerHTML = minutes + ':'+ seconds*/

        }, 1000)
    } else {
        // document.getElementsByClassName('wrapper2')[0].classList.remove('active')

        stopRecording()
        record_process = false
        console.log('stop recording')
        clearInterval(timer)

        minimize()
    }
})

function minimize() {
    var window = remote.getCurrentWindow()
    window.minimize()
}

/*document.getElementById('stop').addEventListener('click', function(e) {
    console.log('test');
    document.getElementsByClassName('wrapper2')[0].classList.remove('active')

        stopRecording()
        record_process = false
        console.log('stop recording')
})*/


// const remote = require('electron').remote;

// window.onload = function() {
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
// }

/*document.getElementById('test_open').addEventListener('click', function(e) {
    createAnotherWindow()
});*/

const electron = require('electron')
const BrowserWindow = electron.remote.BrowserWindow

const path = require('path')
const url = require('url')

function createAnotherWindow() {
    console.log('create another window')
  // Create the browser window.
  videoWindow = new BrowserWindow({width: 980, height: 638, frame: true})
  videoWindow.setMenu(null)
  videoWindow.show()

  // and load the index.html of the app.
  videoWindow.loadURL(url.format({
    pathname: path.join(__dirname, './result.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // videoWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  videoWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    videoWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

