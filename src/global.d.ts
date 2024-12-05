interface Window {
  api: {
    createTask: (task: Task) => Promise<any>;
    getAllTasks: () => Promise<Task[]>;
    getChildTasks: (parentId: string) => Promise<Task[]>;
    getChildTasksIncomplete: (parentId: string) => Promise<Task[]>;
    getChildTasksComplete: (parentId: string) => Promise<Task[]>;
    countChildTasksByStatus: (parentId: string, status: Status) => Promise<number>;
    changeTaskPriority: (id: string, priority: Priority) => Promise<any>;
    changeTaskStatus: (id: string, status: Status) => Promise<any>;
    changeTaskTitle: (id: string, title: string) => Promise<any>;
    changeTaskNote: (id: string, note: string) => Promise<any>;
    deleteTask: (id: string) => Promise<void>;
  };
}
