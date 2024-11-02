import { app, BrowserWindow, ipcMain, session } from "electron";
// import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
// const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    minWidth:375,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      webSecurity: false,
    },
    frame: false,
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.setMenu(null);
  win.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      event.preventDefault();
      // 判断控制台是否已经开启
      if (win?.webContents.isDevToolsOpened()) {
        win?.webContents.closeDevTools();
      } else {
        win?.webContents.openDevTools();
      }
    }
    // win.webContents.openDevTools();
  });

  ipcMain.on("window-max", () => {
    if (win?.isMaximized()) {
      win?.restore();
    } else {
      win?.maximize();
    }
  });
  ipcMain.on("close", () => {
    win?.close();
  });
  ipcMain.on("window-min", () => {
    win?.minimize();
  });
  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      if (details.url.includes("bilibili")) {
        const cookie=details.requestHeaders.authorization;
        delete details.requestHeaders.authorization;
        callback({
          requestHeaders: {
            ...details.requestHeaders,
            Cookie:cookie,
            referer: "http://www.bilibili.com/",
          },
        });
      } else if (
        details.url.includes("hdslb") ||
        details.url.includes(".m4s") ||
        details.url.includes("bili")
      ) {
        callback({
          requestHeaders: {
            referer: "http://www.bilibili.com/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
          },
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
        session.defaultSession.cookies.set(cookie);
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
        authorization: cookies,
      },
    });
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
