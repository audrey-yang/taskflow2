import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { Priority, Status, Task } from "../renderer/src/types";

// Custom APIs for renderer
const api = {
  createTask: (task: Task) => ipcRenderer.invoke("createTask", task),
  getAllTasks: () => ipcRenderer.invoke("getTasks"),
  getChildTasks: (parentId: string) => ipcRenderer.invoke("getChildTasks", parentId),
  getChildTasksIncomplete: (parentId: string) =>
    ipcRenderer.invoke("getChildTasksIncomplete", parentId),
  getChildTasksComplete: (parentId: string) =>
    ipcRenderer.invoke("getChildTasksComplete", parentId),
  changeTaskPriority: (id: string, priority: Priority) =>
    ipcRenderer.invoke("changeTaskPriority", id, priority),
  changeTaskStatus: (id: string, status: Status) =>
    ipcRenderer.invoke("changeTaskStatus", id, status),
  changeTaskTitle: (id: string, title: string) => ipcRenderer.invoke("changeTaskTitle", id, title),
  changeTaskNote: (id: string, note: string) => ipcRenderer.invoke("changeTaskNote", id, note),
  deleteTask: (id: string) => ipcRenderer.invoke("deleteTask", id),
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
