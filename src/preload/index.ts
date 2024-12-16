import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { Priority, Status, Task } from "../renderer/types";

// Custom APIs for renderer
const api = {
  initDb: (user: string) => ipcRenderer.invoke("initDb", user),
  createTask: (task: Task) => ipcRenderer.invoke("createTask", task),
  getChildTasksIncomplete: (parentId: string) =>
    ipcRenderer.invoke("getChildTasksIncomplete", parentId),
  getChildTasksComplete: (parentId: string, pageNumber: number) =>
    ipcRenderer.invoke("getChildTasksComplete", parentId, pageNumber),
  countChildTasksByStatus: (parentId: string, status: Status) =>
    ipcRenderer.invoke("countChildTasksByStatus", parentId, status),
  changeTaskPriority: (id: string, priority: Priority) =>
    ipcRenderer.invoke("changeTaskPriority", id, priority),
  changeTaskStatus: (id: string, status: Status) =>
    ipcRenderer.invoke("changeTaskStatus", id, status),
  changeTaskTitle: (id: string, title: string) => ipcRenderer.invoke("changeTaskTitle", id, title),
  changeTaskNote: (id: string, note: string) => ipcRenderer.invoke("changeTaskNote", id, note),
  deleteTask: (id: string) => ipcRenderer.invoke("deleteTask", id),
  checkPassword: (password: string) => ipcRenderer.invoke("checkPassword", password),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
