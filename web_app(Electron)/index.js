const { app, BrowserWindow, screen } = require('electron')
const path = require('path')

app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const win = new BrowserWindow({
    width: width,
    height: height,
    kiosk: true,
    fullscreen: false,
    icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  win.setMenu(null)
  win.loadFile(path.join(__dirname, 'index.html'))

  win.webContents.on('did-finish-load', () => {
    const targetResolution = { width: 2560 / 2.085, height: 1440 / 2.085 }
    const screenSize = win.getBounds()
    const zoomFactor = Math.min(
      screenSize.width / targetResolution.width,
      screenSize.height / targetResolution.height
    )
    win.webContents.setZoomFactor(zoomFactor)
    win.webContents.setVisualZoomLevelLimits(1, 1)
  })

  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      win.close()
    }
  })

  win.setResizable(false)

  win.webContents.on('devtools-opened', () => {
    win.webContents.closeDevTools()
  })

  win.webContents.on('context-menu', (e) => {
    e.preventDefault()
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
