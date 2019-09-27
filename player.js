const { app, BrowserWindow } = require('electron')
let win

function createWindow () {
	win = new BrowserWindow({
		width: 1400, 
		height: 800,

		minWidth: 800, 
		minHeight: 600,

		frame: false, 
		icon:'app/img/elduende-64.png',
		webPreferences:{
			backgroundThrottling:false,
			contextIsolation: false,
			nodeIntegration: true
		},
	})
	win.loadFile('./app/index.html')

	// Open the DevTools.
	win.webContents.openDevTools()

	win.on('closed', () => {
		win = null
	})
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
})
