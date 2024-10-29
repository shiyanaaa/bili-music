import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      webSecurity: false
    },
    frame: false
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.setMenu(null);
  win.webContents.openDevTools();
  ipcMain.on("window-max", () => {
    if (win == null ? void 0 : win.isMaximized()) {
      win == null ? void 0 : win.restore();
    } else {
      win == null ? void 0 : win.maximize();
    }
  });
  ipcMain.on("close", () => {
    win == null ? void 0 : win.close();
  });
  ipcMain.on("window-min", () => {
    win == null ? void 0 : win.minimize();
  });
  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({ requestHeaders: { ...details.requestHeaders, cookies: details.requestHeaders.authorization, referer: "http://www.bilibili.com/" } });
    }
  );
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    let cookies = "";
    if (details.responseHeaders && details.responseHeaders["set-cookie"]) {
      details.responseHeaders["set-cookie"].map((item) => {
        cookies += item.split(";")[0] + ";";
      });
    }
    callback({
      responseHeaders: {
        "Access-Control-Allow-Origin": ["*"],
        "Access-Control-Allow-Headers": "authorization",
        "Access-Control-Expose-Headers": "Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
        ...details.responseHeaders,
        Authorization: cookies
      }
    });
  });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
