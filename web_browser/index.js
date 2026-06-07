const { app, BrowserWindow, globalShortcut } = require('electron');

let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        fullscreen: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
        },
    });

    win.loadFile('index.html');

    win.webContents.on('did-finish-load', () => {
        const targetResolution = { width: 2560/2.085, height: 1440/2.085 };
        const screenSize = win.getBounds();
        const zoomFactor = Math.min(
            screenSize.width / targetResolution.width,
            screenSize.height / targetResolution.height
        );
        win.webContents.setZoomFactor(zoomFactor);
        win.webContents.setVisualZoomLevelLimits(1, 1);
        console.log(zoomFactor)
    });
    win.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'Escape') {
            win.close();
        }
    });
    win.setResizable(false);
};

app.whenReady().then(() => {
    createWindow();
    globalShortcut.register('Control+Shift+I', () => {
        if (win) {
            win.webContents.toggleDevTools();
        }
    });
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});