async function main() {
  // /////////////////////////////
  // Start silex server
  process.env.SILEX_CLIENT_CONFIG = 'client-config.js';
  process.env.CONFIG = __dirname + '/.silex.js';
  const INDEX_HTML_PATH = '/index.html';
  const silex = require('@silexlabs/silex').default;
  await silex()
  console.log('> Silex server started');

  // /////////////////////////////
  // Start electron
  console.log('> Electron starting, please wait...')
  const { app, BrowserWindow, protocol } = require('electron')
  if (app) {
    const Path = require('path')
    const Url = require('url')

    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    let win;

    function createWindow() {
      setTimeout(() => {
        // Create the browser window.
        // 950x630
        win = new BrowserWindow({
          width: 1200,
          height: 800,
          minWidth: 950,
          minHeight: 630,
          icon: Path.join(__dirname, 'node_modules/@silexlabs/silex/public/assets/logo-silex-small.png'),
          // titleBarStyle: 'hidden',
          frame: true,
          webPreferences: {
            nodeIntegration: false,
            // Needed by CE callback
            // Could be remove with next version
            sandbox: true,
          },

        });

        // and load the index.html of the app.
        const url = 'http://localhost:' + (process.env.PORT || 6805) + INDEX_HTML_PATH;
        console.log('Loading ' + url);
        win.loadURL(url);

        // Open the DevTools.
        // win.webContents.openDevTools();

        // Emitted when the window is closed.
        win.on('closed', () => {
          // Dereference the window object, usually you would store windows
          // in an array if your app supports multi windows, this is the time
          // when you should delete the corresponding element.
          win = null;
        });
      }, 10000)
    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (win === null) {
        createWindow();
      }
    });

    // protocol.registerStandardSchemes(['silex']);
    app.on('ready', () => {
      protocol.registerFileProtocol('silex', (request, callback) => {
        // TODO Remove this hack
        const pathname = Url.parse(request.url).pathname.replace('home/home', 'home');
        callback(pathname);
      }, (error) => {
        if (error) { console.error('Failed to register protocol'); }
      });
    });

    // Remove menu bar
    app.on('browser-window-created', (e, window) => {
      window.setMenu(null);
    });
  } else {
    console.log('> Electron is not available');
  }
}
main();