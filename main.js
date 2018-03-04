const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow


const ioHook = require('iohook');


// 29 - CTRL,
// 68 - F10

/*let id = ioHook.registerShortcut([29, 65], (keys) => {
  console.log('Shortcut called with keys:', keys)
});*/

ioHook.on("keydown", function(evt) {
  if(evt.keycode === 68) {
    console.log('--- stop recording ---');

    mainWindow.webContents.send('request' , 'stop');
  }
});

// ioHook.on("keydown",function(msg){console.log(msg);});

ioHook.start();


const ipcMain = require('electron').ipcMain
// const ipcRenderer = require('electron').ipcRenderer

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let overflowWindow

function createWindow () {
  // Create the browser window.
  // mainWindow = new BrowserWindow({/*width: 490, height: 372,*/ useContentSize: true, frame: true, resizable: false, transparent: true})
  // mainWindow = new BrowserWindow({width: 592, height: 64, /*left: 0, top: 0,*/ transparent: true, frame: true})

  mainWindow = new BrowserWindow({width: 592, height: 64, transparent: false, frame: false, focusable: true})
  // mainWindow = new BrowserWindow({width: 1000, height: 450, transparent: true, frame: true, focusable: true})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'application.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.setMenu(null);
  // mainWindow.setIgnoreMouseEvents(true);
  mainWindow.setAlwaysOnTop(true, 2);
  // mainWindow.setResizable(true);
  // mainWindow.setFullScreen(true);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    app.quit()
    // videoWindow = null
  })
}


function createOverflow() {
  // const mainWindow = remote.getCurrentWindow()


  // Production:
/*  overflowWindow = new BrowserWindow({parent: mainWindow, skipTaskbar: true, frame: false, transparent: true, focusable: false, minimizable: false})
  overflowWindow.setMenu(null)
  overflowWindow.setAlwaysOnTop(true);
  overflowWindow.setResizable(false);
  overflowWindow.setFullScreen(true);
  overflowWindow.setVisibleOnAllWorkspaces(true)
  overflowWindow.setContentProtection(true);*/

  // Development:
  overflowWindow = new BrowserWindow({parent: mainWindow, skipTaskbar: true, frame: true, transparent: false, focusable: true, minimizable: false})
  overflowWindow.setMenu(null)
  overflowWindow.setAlwaysOnTop(true);
  overflowWindow.webContents.openDevTools()



  overflowWindow.show()

  // and load the index.html of the app.
  overflowWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/screen-overflow.html'),
    protocol: 'file:',
    slashes: true
  }))


  // Emitted when the window is closed.
  overflowWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    overflowWindow = null
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createOverflow)
app.on('ready', createWindow)



ipcMain.on('asynchronous-message', (event, data) => {
  // console.log(data);
  // ipcMain.send('asynchronous-message_info', data);
  mainWindow.webContents.send('info' , data);
});

ipcMain.on('record-message', (event, data) => {
  // console.log(data);
  // ipcMain.send('asynchronous-message_info', data);
  if(data === 'record')
    overflowWindow.setIgnoreMouseEvents(true);
});


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
