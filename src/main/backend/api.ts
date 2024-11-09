import { Task } from "../../renderer/src/types";
import { db } from "./db";

export const api = {
  createTask: async (task: Task) => {
    return await db.put({
      _id: Date.now().toString(),
      title: task.title,
      priority: task.priority,
      status: task.status,
    });
  },
  getTasks: async () => {
    return await db.allDocs({ include_docs: true }).then((res) => {
      return res.rows.map((row) => row.doc);
    });
  },
};