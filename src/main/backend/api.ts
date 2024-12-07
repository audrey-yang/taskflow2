import { Priority, STATUS, Status, Task } from "../../renderer/types";
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
    return await db.allDocs({ include_docs: true }).then((res: { rows: any[] }) => {
      return res.rows.map((row: { doc: any }) => row.doc);
    });
  },
  getChildTasks: async (parentId: string) => {
    return await db
      .find({
        selector: {
          parentId,
        },
        sort: [{ priority: "desc" }, { status: "desc" }],
      })
      .then((res: { docs: any }) => {
        return res.docs;
      });
  },
  getChildTasksIncomplete: async (parentId: string) => {
    return await db
      .find({
        selector: {
          parentId,
          priority: { $exists: true },
          status: { $gte: STATUS.IN_PROGRESS },
        },
        sort: [{ priority: "desc" }, { status: "desc" }],
      })
      .then((res: { docs: any }) => {
        return res.docs;
      });
  },
  getChildTasksComplete: async (parentId: string) => {
    return await db
      .find({
        selector: {
          parentId,
          status: STATUS.COMPLETED,
        },
      })
      .then((res: { docs: any }) => {
        return res.docs;
      });
  },
  countChildTasksByStatus: async (parentId: string, status: Status) => {
    return await db
      .find({
        selector: {
          parentId,
          status,
        },
        fields: ["_id"], // Only select the _id field to reduce data transfer
      })
      .then((res: { docs: string | any[] }) => {
        return res.docs.length;
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
    const recursiveDelete = async (parentId: string) => {
      // Find and delete descendants
      const result = await db.find({
        selector: {
          parentId,
        },
      });

      const children = result.docs;
      await Promise.all(
        children.map((child: { _id: string }) => {
          recursiveDelete(child._id);
        }),
      );

      // Delete self
      await db.get(parentId).then((doc: any) => {
        db.remove(doc);
      });
    };

    // Recursively delete descendants
    await recursiveDelete(id);
  },
  checkPassword: (password: string) => {
    return password === import.meta.env.VITE_APP_PASSWORD;
  },
};
