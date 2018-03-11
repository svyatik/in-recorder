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
            maxWidth: 1920,
            minHeight: 720,
            maxHeight: 1080
          }
        }
      }).then((stream) => handleStream(stream))
      .catch((e) => handleError(e))
      return
    }
  }
})
}

let global_data = {};
// let global_left = 0;

/*function handleStream (stream) {
    console.log("Stream: "+URL.createObjectURL(stream))
  document.querySelector('video').src = URL.createObjectURL(stream)
}*/

var video = document.createElement('video')

function handleStream(stream) {

    console.log('stream!!!');
    

    video.src = URL.createObjectURL(stream)

    video.addEventListener('timeupdate', drawFrame, false);

    video.autoplay = true;

    var canvas = document.createElement('canvas');

    console.log("GLOBAL" +global_data.width);
/*    global_data = {
        width: 1200,
        height: 480,
        x: 0,
        y: 0
    };
*/
    canvas.width = global_data.width;
    canvas.height = global_data.height;

    var ctx = canvas.getContext('2d');

    // document.body.appendChild(canvas);

    // recorder = new MediaRecorder(stream)
    var array = [];
    blobs = []

    var new_stream = canvas.captureStream(60);

    var video_new = document.createElement('video')
    video_new.srcObject = new_stream;
    video_new.autoplay = true;

    recorder = new MediaRecorder(new_stream);

    // document.body.appendChild(video_new);

    console.log('ready...!!!');
    recorder.ondataavailable = function(event) {
        blobs.push(event.data);



        console.log("There " + blobs[0]);

        // console.log(blobs);
    };


    function drawFrame(e) {
        this.pause();

        ctx.drawImage(this, -global_data.x, -global_data.y);
        // ctx.fillRect(20,20,150,100);
        // canvas.toBlob(saveFrame, 'image/jpeg');
        this.play();

        


    }

/*    function saveFrame(blobe) {
        console.log('blob: '+blobe);
        blobs.push(blobe);
    }*/

    video.addEventListener('ended', function() {
        console.log('ended video finally!!!!!!!');
    }, false);

    recorder.onstop = function(e) {
        // video.stop();
        console.log('on stop was here');
        // URL.revokeObjectURL(stream);
        video.src = "";
            // video.pause();
            console.log('on stop: '+blobs.length);
            const blob = new Blob(blobs, {type: 'video/webm'});
             
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
                        createAnotherWindow();
                    }
                });
            })



            var arrayBuffer;
            var fileReader = new FileReader();
            fileReader.onload = function(event) {
                arrayBuffer = event.target.result;

                // console.log(arrayBuffer);

                // createAnotherWindow();
            };
            fileReader.readAsArrayBuffer(blob);

            
            

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

    // setTimeout(minimize, 1000);

    // return false;

    // document.getElementsByClassName('wrapper2')[0].classList.add('active')


    if (!record_process) {
        const $timer_id = document.getElementById('timer')

        // var window_overflow = remote.getGlobal();
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('record-message', 'record');

        // console.log('overflow', window_overflow);

        // window_overflow.setIgnoreMouseEvents(true);


        startRecording()
        record_process = true
        console.log('start recording...')

        let seconds = 0,
            minutes = 0

        timer = setInterval(function() {
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


            $timer_id.innerHTML = minutes_str + ':' + seconds_str;
        }, 1000)
    } else {
        // document.getElementsByClassName('wrapper2')[0].classList.remove('active')

        stopRecording()
        record_process = false
        console.log('stop recording')
        clearInterval(timer)

        // minimize()
    }
})

function minimize() {
    var window = remote.getCurrentWindow()
    window.minimize()
}


const ipcRenderer = require('electron').ipcRenderer

// ipcRenderer.send('record-message', 'start_recording');

ipcRenderer.on('info', (event, data) => {
  // console.log("left: ", data);
  global_data = data;
  console.log(global_data);
  // ipcMain.send('asynchronous-message', data);
});

ipcRenderer.on('request', (event, data) => {
    console.log('request: '+data);
  // console.log("left: ", data);
  if(data === 'stop') {
    console.log('yes, we stop it!');
    stopRecording();
  }
  // ipcMain.send('asynchronous-message', data);
});

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

// createScreenOverflow();



// var global_ = 5;


/*function createScreenOverflow() {
    console.log('screen overflow')
    const mainWindow = remote.getCurrentWindow()

  // Create the browser window.
  overflowWindow = new BrowserWindow({skipTaskbar: true, frame: true, transparent: true, focusable: false, minimizable: false})
  overflowWindow.setMenu(null)
  overflowWindow.setAlwaysOnTop(true);
  overflowWindow.setResizable(false);
  // overflowWindow.setFullScreen(true);

  // setTimeout(function() {


  overflowWindow.setIgnoreMouseEvents(true);
    // }, 5000);

  overflowWindow.show()

  // and load the index.html of the app.
  overflowWindow.loadURL(url.format({
    pathname: path.join(__dirname, './screen-overflow.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  overflowWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  overflowWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    overflowWindow = null
  })
}*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

