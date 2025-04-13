import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png";
import { api } from "./backend/api";
import { Priority, Status, Task } from "../renderer/types";
import * as authService from "./auth/auth-service";
import { createAuthWindow, createLogoutWindow } from "./auth/auth-process";
import { getPrivateData } from "./auth/get-auth";

export const createMainWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    // mainWindow.webContents.openDevTools();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  // if (is.dev && process.env["MAIN_WINDOW_VITE_DEV_SERVER_URL"]) {
  //   mainWindow.loadURL(process.env["MAIN_WINDOW_VITE_DEV_SERVER_URL"]);
  // } else {
  //   mainWindow.loadFile(join(__dirname, `../../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  // }
  mainWindow.loadFile(join(__dirname, `../../../src/renderer/home.html`));
};

async function showWindow() {
  try {
    await authService.refreshTokens();
    createMainWindow();
  } catch (err) {
    createAuthWindow();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Set IPC handlers
  ipcMain.handle("initDbs", async (_, user: string) => {
    return await api.initDbs(user);
  });
  ipcMain.handle("createTask", async (_, task: Task) => {
    return await api.createTask(task);
  });
  ipcMain.handle("getChildTasksIncomplete", async (_, parentId: string) => {
    return await api.getChildTasksIncomplete(parentId);
  });
  ipcMain.handle("getChildTasksComplete", async (_, parentId: string, pageNumber: number) => {
    return await api.getChildTasksComplete(parentId, pageNumber);
  });
  ipcMain.handle("countChildTasksByStatus", async (_, parentId: string, status: Status) => {
    return await api.countChildTasksByStatus(parentId, status);
  });
  ipcMain.handle("changeTaskPriority", async (_, id: string, priority: Priority) => {
    return await api.changeTaskPriority(id, priority);
  });
  ipcMain.handle("changeTaskStatus", async (_, id: string, status: Status) => {
    return await api.changeTaskStatus(id, status);
  });
  ipcMain.handle("changeTaskTitle", async (_, id: string, title: string) => {
    return await api.changeTaskTitle(id, title);
  });
  ipcMain.handle("changeTaskNote", async (_, id: string, note: string) => {
    return await api.changeTaskNote(id, note);
  });
  ipcMain.handle("deleteTask", async (_, id: string) => {
    return await api.deleteTask(id);
  });
  ipcMain.handle("checkPassword", async (_, password) => {
    return api.checkPassword(password);
  });
  ipcMain.handle("createNote", async (_, note) => {
    return api.createNote(note);
  });
  ipcMain.handle("getNoteById", async (_, id) => {
    return api.getNoteById(id);
  });
  ipcMain.handle("getAllNotes", async (_, note) => {
    return api.getAllNotes();
  });
  ipcMain.handle("changeNoteTitle", async (_, id, title) => {
    return api.changeNoteTitle(id, title);
  });
  ipcMain.handle("changeNoteContent", async (_, id, content) => {
    return api.changeNoteContent(id, content);
  });
  ipcMain.handle("deleteNote", async (_, id) => {
    return api.deleteNote(id);
  });

  ipcMain.handle("auth:get-profile", authService.getProfile);
  ipcMain.handle("auth:get-private-data", getPrivateData);
  ipcMain.on("auth:log-out", () => {
    BrowserWindow.getAllWindows().forEach((window) => window.close());
    createLogoutWindow();
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) showWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
