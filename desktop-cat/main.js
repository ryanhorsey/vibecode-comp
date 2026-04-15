const { app, BrowserWindow, screen } = require("electron");

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // INCREASED: Window now takes up 25% width and 95% height
  const windowWidth = Math.floor(width * 0.25);
  const windowHeight = Math.floor(height * 0.95);

  const win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: width - windowWidth - 20,
    y: height - windowHeight,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
