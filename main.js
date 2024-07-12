// main.js
const { app } = require('electron');
// run this as early in the main process as possible
if (require('electron-squirrel-startup')) {
    app.quit();
    return;
}

// Modules to control application life and create native browser window
const { spawn } = require('child_process');
const { BrowserWindow } = require('electron');
const fs = require('fs');

const path = require("path");
const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'public-pool-ui', 'src', 'assets', 'layout', 'images', 'logo.png'),
    })

    mainWindow.loadFile(path.join(__dirname, 'public-pool-ui', 'dist', 'public-pool-ui', 'index.html'));

    mainWindow.webContents.on('did-fail-load', () => {
        mainWindow.loadFile(path.join(__dirname, 'public-pool-ui', 'dist', 'public-pool-ui', 'index.html'));
    });


    //mainWindow.webContents.openDevTools();
}


app.whenReady().then(() => {
    setTimeout(() => {
        createWindow();
      }, 3000);

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

console.log(process.resourcesPath)

const serverPath = app.isPackaged ?
    path.join(process.resourcesPath, 'dist', 'main.js')
    : path.join(__dirname, 'public-pool', 'dist', 'main.js');

const evnFilePath = app.isPackaged ?
    path.join(process.resourcesPath, 'settings.json')
    : path.join(__dirname, 'settings.json')


var envFile = JSON.parse(fs.readFileSync(evnFilePath, 'utf8'));


// Spawn NestJS server process
const nestProcess = spawn('node', [serverPath], {
    stdio: ['inherit', fs.openSync('server.log', 'a'), fs.openSync('server.log', 'a')],
    detached: true,
    windowsHide: true,
    env: envFile,

});

nestProcess.on('close', (code) => {
    console.log(`NestJS server process exited with code ${code}`);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

app.on('will-quit', () => {
    nestProcess.kill();
});