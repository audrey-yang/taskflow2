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
  getAllTasks: async () => {
    return await db.allDocs({ include_docs: true }).then((res) => {
      return res.rows.map((row) => row.doc);
    });
  },
  getChildTasks: async (parentId: string) => {
    return await db
      .find({
        selector: {
          parentId,
        },
      })
      .then((res) => {
        return res.docs;
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
  deleteTask: async (id: string) => {
    const deleteDescendants = async (parentId: string) => {
      const result = await db.find({
        selector: {
          parentId: parentId,
        },
      });
      const children = result.docs;
      await Promise.all(
        children.map((child) => {
          deleteDescendants(child._id);
          db.remove(children);
        }),
      );
    };

    // Recursively delete descendants
    deleteDescendants(id);

    // Delete the task
    db.get("mydoc").then(function (doc) {
      return db.remove(doc);
    });
  },
};
