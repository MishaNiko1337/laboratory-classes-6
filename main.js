const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const http = require("http");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
    },
  });

  const serverUrl = "http://localhost:3000";

  const checkServer = () => {
    http.get(serverUrl, (res) => {
      if (res.statusCode === 200) {
        win.loadURL(serverUrl);
      } else {
        setTimeout(checkServer, 500);
      }
    }).on("error", () => {
      setTimeout(checkServer, 500);
    });
  };

  exec("npm start", (err, stdout, stderr) => {
    if (err) {
      console.error("Error to connect", err);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });

  checkServer();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
