import { BrowserWindow } from "electron";
import * as authService from "./auth-service";
import { createMainWindow } from "../index";

let window: BrowserWindow = null;

export const createAuthWindow = () => {
  destroyAuthWindow();

  window = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  window.loadURL(authService.getAuthenticationURL());

  const {
    session: { webRequest },
  } = window.webContents;

  const filter = {
    urls: ["http://localhost/callback*"],
  };

  webRequest.onBeforeRequest(filter, async ({ url }) => {
    await authService.loadTokens(url);
    createMainWindow();
    return destroyAuthWindow();
  });

  window.on("authenticated", () => {
    destroyAuthWindow();
  });

  window.on("closed", () => {
    window = null;
  });
};

const destroyAuthWindow = () => {
  if (!window) {
    return;
  }
  window.close();
  window = null;
};

export const createLogoutWindow = () => {
  const logoutWindow = new BrowserWindow({
    show: false,
  });

  logoutWindow.loadURL(authService.getLogOutUrl());

  logoutWindow.on("ready-to-show", async () => {
    await authService.logout();
    logoutWindow.close();
  });
};
