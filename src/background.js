"use strict";

import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  shell,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import Bonjour from "bonjour";
import * as Sentry from "@sentry/electron";

Sentry.init({
  dsn:
    "https://4f64bbf47aef4ebd884e7b92f9af5199@o232050.ingest.sentry.io/5818207",
});

const bonjour = Bonjour();
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let win;
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

const findLocalService = () => {
  return new Promise((resolve, reject) => {
    bonjour.find({ type: "gametxt" }, (service) => {
      resolve(service);
    });
  });
};

const getSourcesWithThumbnails = async () => {
  const sources = await desktopCapturer.getSources({
    types: [
      "window",
      // "screen"
    ],
  });

  for (const source of sources) {
    const thumbnailPNG = await source.thumbnail.toPNG();

    const size = await source.thumbnail.getSize();
    source.thumbnail = { size, thumbnailPNG };
  }
  return sources;
};

// to recieve stuff
ipcMain.on("toMain", async (event, { init, status, openUrl }) => {
  if (init) {
    getSourcesWithThumbnails().then((sources) => {
      win.webContents.send("fromMain", { sources });
    });

    findLocalService().then((service) => {
      win.webContents.send("fromMain", { service });
    });
  }
  if (openUrl) {
    shell.openExternal(openUrl);
  }
});
