import { Priority, STATUS, Status, Task } from "../../renderer/src/types";
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
        sort: [{ priority: "desc" }, { status: "desc" }],
      })
      .then((res) => {
        return res.docs;
      });
  },
  getChildTasksIncomplete: async (parentId: string) => {
    return await db
      .find({
        selector: {
          parentId,
          status: { $gte: STATUS.IN_PROGRESS },
        },
        sort: [{ priority: "desc" }, { status: "desc" }],
      })
      .then((res) => {
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
    const recursiveDelete = async (parentId: string) => {
      // Find and delete descendants
      const result = await db.find({
        selector: {
          parentId: parentId,
        },
      });

      const children = result.docs;
      await Promise.all(
        children.map((child) => {
          recursiveDelete(child._id);
        }),
      );

      // Delete self
      await db.get(parentId).then((doc) => {
        db.remove(doc);
      });
    };

    // Recursively delete descendants
    await recursiveDelete(id);
  },
};
