const { app, BrowserWindow } = require("electron");

/*
  Debe ejecutarse antes de app.whenReady().
  Usa renderizado por software para evitar bloqueos
  en controladores gráficos antiguos de Windows 7.
*/
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-gpu");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        minWidth: 360,
        minHeight: 600,
        autoHideMenuBar: true,
        backgroundColor: "#061b10",
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true
        }
    });

    mainWindow.loadFile("index.html");

    mainWindow.once("ready-to-show", function () {
        mainWindow.show();
        mainWindow.maximize();
    });

    mainWindow.webContents.setWindowOpenHandler(function () {
        return { action: "deny" };
    });

    mainWindow.webContents.on(
        "will-navigate",
        function (event, url) {
            if (!url.startsWith("file:")) {
                event.preventDefault();
            }
        }
    );
}

app.whenReady().then(function () {
    createWindow();

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});