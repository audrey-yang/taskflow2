interface Window {
  api: {
    initDbs: (user: string) => Promise<any>;
    createTask: (task: Task) => Promise<any>;
    getChildTasksIncomplete: (parentId: string) => Promise<Task[]>;
    getChildTasksComplete: (parentId: string, pageNumber: number) => Promise<Task[]>;
    countChildTasksByStatus: (parentId: string, status: Status) => Promise<number>;
    changeTaskPriority: (id: string, priority: Priority) => Promise<any>;
    changeTaskStatus: (id: string, status: Status) => Promise<any>;
    changeTaskTitle: (id: string, title: string) => Promise<any>;
    changeTaskNote: (id: string, note: string) => Promise<any>;
    deleteTask: (id: string) => Promise<void>;
    checkPassword: (password: string) => Promise<boolean>;
    createNote: (note: Note) => Promise<void>;
    getNoteById: (id: string) => Promise<Note>;
    getAllNotes: () => Promise<Note[]>;
    changeNoteTitle: (id: string, title: string) => Promise<void>;
    changeNoteContent: (id: string, content: string) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    getProfile: () => Promise<JwtPayload>;
    logOut: () => Promise<void>;
  };
}
