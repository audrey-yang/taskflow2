import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { api } from "./backend/api";
import { Priority, Status, Task } from "../renderer/src/types";

const createWindow = (): void => {
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
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.webContents.openDevTools();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
};

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
  ipcMain.handle("createTask", async (_, task: Task) => {
    return await api.createTask(task);
  });
  ipcMain.handle("getAllTasks", async (_) => {
    return await api.getAllTasks();
  });
  ipcMain.handle("getChildTasks", async (_, parentId: string) => {
    return await api.getChildTasks(parentId);
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

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
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
