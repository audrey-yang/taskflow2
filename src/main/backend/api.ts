import { app } from "electron";
import path from "path";
import PouchDB from "pouchdb";
PouchDB.plugin(require("pouchdb-find"));
import { Note, Priority, STATUS, Status, Task } from "../../renderer/types";

let tasksDb: PouchDB.Database;
let notesDb: PouchDB.Database;

const updateTaskField = async (id: string, field: Partial<Task>) => {
  const task = await tasksDb.get(id);
  return await tasksDb.put({
    ...task,
    ...field,
  });
};

const initDbs = async (user: string) => {
  tasksDb = new PouchDB(path.join(app.getPath("sessionData"), `leveldb_tasks_${user}`));
  const remoteTasksDb = new PouchDB(`${import.meta.env.VITE_CLOUDANT_URL}tasks_${user}`, {
    auth: {
      username: `${import.meta.env.VITE_CLOUDANT_USERNAME}`,
      password: `${import.meta.env.VITE_CLOUDANT_PASSWORD}`,
    },
  });

  remoteTasksDb
    .info()
    .then((_) => {
      console.log("Successfully connected to Cloudant");
    })
    .catch((err: any) => {
      console.error(err);
    });

  tasksDb.sync(remoteTasksDb, {
    live: true,
    retry: true,
  });

  // Create indexes for Mango
  tasksDb.createIndex({
    index: { fields: ["parentId"] },
  });
  tasksDb.createIndex({
    index: { fields: ["status"] },
  });
  tasksDb.createIndex({
    index: { fields: ["parentId", "status"] },
  });
  tasksDb.createIndex({
    index: { fields: ["priority", "status"] },
  });
  tasksDb.createIndex({
    index: { fields: ["parentId", "priority", "status"], ddoc: "parent-status-priority" },
  });

  notesDb = new PouchDB(path.join(app.getPath("sessionData"), `leveldb_notes_${user}`));
  const remoteNotesDb = new PouchDB(`${import.meta.env.VITE_CLOUDANT_URL}notes_${user}`, {
    auth: {
      username: `${import.meta.env.VITE_CLOUDANT_USERNAME}`,
      password: `${import.meta.env.VITE_CLOUDANT_PASSWORD}`,
    },
  });

  remoteNotesDb
    .info()
    .then((_) => {
      console.log("Successfully connected to Cloudant");
    })
    .catch((err: any) => {
      console.error(err);
    });

  notesDb.sync(remoteNotesDb, {
    live: true,
    retry: true,
  });
};

const createTask = async (task: Task) => {
  return await tasksDb.put({
    ...task,
    _id: Date.now().toString(),
  });
};

const getChildTasksIncomplete = async (parentId: string) => {
  return await tasksDb
    .find({
      selector: {
        parentId,
        status: { $gte: STATUS.IN_PROGRESS },
        priority: { $exists: true },
      },
      sort: [{ priority: "desc" }, { status: "desc" }],
    })
    .then((res: { docs: any }) => {
      return res.docs;
    });
};

const getChildTasksComplete = async (parentId: string, pageNumber: number) => {
  return await tasksDb
    .find({
      selector: {
        parentId,
        status: STATUS.COMPLETED,
      },
      skip: 10 * pageNumber,
      limit: 10,
    })
    .then((res: { docs: any }) => {
      return res.docs;
    });
};

const countChildTasksByStatus = async (parentId: string, status: Status) => {
  return await tasksDb
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
};

const changeTaskPriority = async (id: string, priority: Priority) => {
  return await updateTaskField(id, { priority });
};

const changeTaskStatus = async (id: string, status: Status) => {
  return await updateTaskField(id, { status });
};

const changeTaskTitle = async (id: string, title: string) => {
  return await updateTaskField(id, { title });
};

const changeTaskNote = async (id: string, note: string) => {
  return await updateTaskField(id, { note });
};

const deleteTask = async (id: string) => {
  const recursiveDelete = async (parentId: string) => {
    // Find and delete descendants
    const result = await tasksDb.find({
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
    await tasksDb.get(parentId).then((doc: any) => {
      tasksDb.remove(doc);
    });
  };

  // Recursively delete descendants
  await recursiveDelete(id);
};

const checkPassword = (password: string) => {
  return password === import.meta.env.VITE_APP_PASSWORD;
};

const createNote = async (note: Note) => {
  return await notesDb.put({
    ...note,
    _id: Date.now().toString(),
  });
};

const getNoteById = async (id: string) => {
  return await notesDb.get(id);
};

const getAllNotes = async () => {
  return await notesDb.allDocs({ include_docs: true }).then((res: { rows: any }) => {
    return res.rows.map((row: { doc: any }) => row.doc);
  });
};

export const api = {
  initDbs,
  createTask,
  getChildTasksIncomplete,
  getChildTasksComplete,
  countChildTasksByStatus,
  changeTaskPriority,
  changeTaskStatus,
  changeTaskTitle,
  changeTaskNote,
  deleteTask,
  checkPassword,
  createNote,
  getNoteById,
  getAllNotes,
};
