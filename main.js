const {app, BrowserWindow, webFrame} = require('electron')
const path = require('path')
const url = require('url')

// require('electron-reload')(__dirname)

var win

function createWindow () {
  win = new BrowserWindow({width: 300, height: 500, backgroundColor: '#f8f8f8', resizable:true, autoHideMenuBar: true, frame: false})

  win.loadURL(`file://${__dirname}/index.html`)

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (win === null) createWindow()
})
