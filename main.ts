const { app, BrowserWindow, Tray, nativeImage, Menu } = require('electron');
const path = require('path');
const url = require('url');


let mainWindow: typeof BrowserWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
          },
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL(`http://localhost:3000`);
      } else {
        mainWindow.loadURL(
          url.format({
              pathname: path.join(__dirname, './renderer/index.html'),
              protocol: 'file:',
              slashes: true
          })
        );
      }

      mainWindow.on('closed', () => {
        mainWindow = null;
      });


    mainWindow.webContents.on('context-menu', (e: any, props: any) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(mainWindow);
    });

    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.devToolsWebContents.executeJavaScript(`
              window.addEventListener('keydown', function (e) {
                if (e.keyCode === 88 && e.metaKey) {
                  document.execCommand('cut');
                }
                else if (e.keyCode === 67 && e.metaKey) {
                  document.execCommand('copy');
                }
                else if (e.keyCode === 86 && e.metaKey) {
                  document.execCommand('paste');
                }
                else if (e.keyCode === 65 && e.metaKey) {
                  document.execCommand('selectAll');
                }
                else if (e.keyCode === 90 && e.metaKey) {
                  document.execCommand('undo');
                }
                else if (e.keyCode === 89 && e.metaKey) {
                  document.execCommand('redo');
                }
              });
          `);
    });

});

app.on('window-all-closed', app.quit);
app.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
});