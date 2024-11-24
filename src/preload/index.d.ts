import { ElectronAPI } from "@electron-toolkit/preload";
import { Task } from "@renderer/src/types";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      createTask: (task: Task) => any;
      getAllTasks: () => any;
      getChildTasks: (parentId: string) => any;
      getChildTasksIncomplete: (parentId: string) => any;
      getChildTasksComplete: (parentId: string) => any;
      countChildTasksByStatus: (parentId: string, status: Status) => any;
      changeTaskPriority: (id: string, priority: Priority) => any;
      changeTaskStatus: (id: string, status: Status) => any;
      changeTaskTitle: (id: string, title: string) => any;
      changeTaskNote: (id: string, note: string) => any;
      deleteTask: (id: string) => any;
    };
  }
}
