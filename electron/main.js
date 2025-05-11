
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280, // Default width
    height: 800, // Default height
    webPreferences: {
      nodeIntegration: false, // Disable Node.js integration in renderer process for security
      contextIsolation: true, // Enable context isolation for security
      // preload: path.join(__dirname, 'preload.js'), // Optional: use for IPC
    },
  });

  if (isDev) {
    // In development, load the Next.js dev server URL
    mainWindow.loadURL('http://localhost:9002'); // Ensure this port matches your Next.js dev server
    mainWindow.webContents.openDevTools(); // Open DevTools automatically in development
  } else {
    // In production, you need to serve your Next.js application.
    // This typically involves packaging the output of `next build` (e.g., the `.next/standalone` directory)
    // and starting the Next.js server from this Electron main process. Then load `http://localhost:<production_port>`.
    // The `loadFile` approach is generally for static sites (from `next export`), which is not the default for App Router.

    // THIS IS A PLACEHOLDER AND WILL LIKELY NOT WORK FOR A DYNAMIC NEXT.JS APP WITHOUT FURTHER CONFIGURATION.
    // You should replace this with a robust solution for serving your Next.js app in production.
    // For example, start the packaged Next.js server and load its URL (e.g., http://localhost:3000).
    // mainWindow.loadURL(`file://${path.join(__dirname, '../.next/server/app/index.html')}`); // This is a guess and might not render a dynamic app correctly.
    
    // As a temporary measure for the build to "run", it will load the same URL as dev.
    // THIS MUST BE CHANGED FOR A REAL PRODUCTION BUILD.
    // The `electron-builder` configuration in `package.json` will need to be set up
    // to correctly package and potentially run the Next.js server.
    mainWindow.loadURL('http://localhost:9002'); 
    // A more correct approach in production would be to:
    // 1. Ensure `next build` creates a standalone server (e.g., in `.next/standalone`).
    // 2. `electron-builder` packages this standalone server.
    // 3. This `main.js` script, when `!isDev`, starts that server (e.g., using `child_process.fork`).
    // 4. Then `mainWindow.loadURL('http://localhost:PORT_OF_STANDALONE_SERVER');`
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // On macOS, applications and their menu bar stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create a window in the app when the dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
