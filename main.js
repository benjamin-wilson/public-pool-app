// main.js
const { app } = require('electron');
// run this as early in the main process as possible
if (require('electron-squirrel-startup')) {
    app.quit();
    return;
}

// Modules to control application life and create native browser window
const { fork } = require('child_process');
const { BrowserWindow } = require('electron');
const fs = require('fs');
const settings = require('electron-settings');



const path = require("path");
const { electron } = require('process');
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


const serverPath = app.isPackaged ?
    path.join(process.resourcesPath, 'dist', 'main.js')
    : path.join(__dirname, 'public-pool', 'dist', 'main.js');

// const evnFilePath = app.isPackaged ?
//     path.join(process.resourcesPath, 'settings.json')
//     : path.join(__dirname, 'settings.json')


// var envFile = JSON.parse(fs.readFileSync(evnFilePath, 'utf8'));

const loadSettings = async () => {
    settings.configure({ prettify: true });
    console.log(app.getPath('userData'));
    try {
        const envFile = await settings.get('env');
        if (envFile == null) {
            const defaultEnv = {
                BITCOIN_RPC_URL: 'http://192.168.1.49',
                BITCOIN_RPC_USER: '',
                BITCOIN_RPC_PASSWORD: '',
                BITCOIN_RPC_PORT: '8332',
                BITCOIN_RPC_TIMEOUT: '10000',
                BITCOIN_RPC_COOKIEFILE: '',

                API_PORT: '3334',
                STRATUM_PORT: '3333',

                NETWORK: 'mainnet',
                'API_SECURE': false
            };
            await settings.set('env', defaultEnv);
            return defaultEnv;
        }
        return envFile;
    } catch (err) {
        console.error('Failed to load settings:', err);
        return {};
    }
}


loadSettings().then((env) => {

    // Spawn NestJS server process
    const nestProcess = fork(serverPath, ['child'], { env });

    // Handle errors from the child process
    nestProcess.on('error', (err) => {
        console.error('Failed to start NestJS server process:', err);
    });

    // Handle exit of the child process
    nestProcess.on('exit', (code, signal) => {
        console.log(`NestJS server process exited with code ${code} and signal ${signal}`);
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

});