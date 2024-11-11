import { Priority, Status, Task } from "../../renderer/src/types";
import { db } from "./db";

const updateTaskField = async (id: string, field: Partial<Task>) => {
  const task = await db.get(id);
  return await db.put({
    ...task,
    ...field,
  });
};

export const api = {
  createTask: async (task: Task) => {
    return await db.put({
      ...task,
      _id: Date.now().toString(),
    });
  },
  getTasks: async () => {
    return await db.allDocs({ include_docs: true }).then((res) => {
      return res.rows.map((row) => row.doc);
    });
  },
  changeTaskPriority: async (id: string, priority: Priority) => {
    return await updateTaskField(id, { priority });
  },
  changeTaskStatus: async (id: string, status: Status) => {
    return await updateTaskField(id, { status });
  },
  changeTaskTitle: async (id: string, title: string) => {
    return await updateTaskField(id, { title });
  },
  changeTaskNote: async (id: string, note: string) => {
    return await updateTaskField(id, { note });
  },
};
