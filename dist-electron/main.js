"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const node_url = require("node:url");
const path = require("node:path");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
const __dirname$1 = path.dirname(node_url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new electron.BrowserWindow({
    minWidth: 375,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs"),
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
  win.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      event.preventDefault();
      if (win == null ? void 0 : win.webContents.isDevToolsOpened()) {
        win == null ? void 0 : win.webContents.closeDevTools();
      } else {
        win == null ? void 0 : win.webContents.openDevTools();
      }
    }
  });
  electron.ipcMain.on("window-max", () => {
    if (win == null ? void 0 : win.isMaximized()) {
      win == null ? void 0 : win.restore();
    } else {
      win == null ? void 0 : win.maximize();
    }
  });
  electron.ipcMain.on("close", () => {
    win == null ? void 0 : win.close();
  });
  electron.ipcMain.on("window-min", () => {
    win == null ? void 0 : win.minimize();
  });
  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      if (details.url.includes("bilibili")) {
        callback({
          requestHeaders: {
            ...details.requestHeaders,
            Cookie: details.requestHeaders.authorization,
            referer: "http://www.bilibili.com/"
          }
        });
      } else if (details.url.includes("hdslb") || details.url.includes(".m4s") || details.url.includes("bili")) {
        callback({
          requestHeaders: {
            referer: "http://www.bilibili.com/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
          }
        });
      } else {
        callback({});
      }
    }
  );
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    let cookies = "";
    if (details.responseHeaders && details.responseHeaders["set-cookie"]) {
      details.responseHeaders["set-cookie"].map((item) => {
        cookies += item.split(";")[0] + ";";
        const [name, value] = item.split(";")[0].split("=");
        console.log(name, value);
        const cookie = { url: "https://api.bilibili.com", name, value };
        electron.session.defaultSession.cookies.set(cookie);
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
        authorization: cookies
      }
    });
  });
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.whenReady().then(createWindow);
exports.MAIN_DIST = MAIN_DIST;
exports.RENDERER_DIST = RENDERER_DIST;
exports.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;
