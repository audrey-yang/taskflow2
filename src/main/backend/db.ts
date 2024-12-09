import { app } from "electron";
import path from "path";
import PouchDB from "pouchdb";
PouchDB.plugin(require("pouchdb-find"));

export const db = new PouchDB(path.join(app.getPath("sessionData"), "leveldb"));

// Create DB and sync with remote DB
const remoteDb = new PouchDB(`${import.meta.env.VITE_CLOUDANT_URL}`, {
  auth: {
    username: `${import.meta.env.VITE_CLOUDANT_USERNAME}`,
    password: `${import.meta.env.VITE_CLOUDANT_PASSWORD}`,
  },
});

remoteDb
  .info()
  .then((_) => {
    console.log("Successfully connected to Cloudant");
  })
  .catch((err: any) => {
    console.error(err);
  });

db.sync(remoteDb, {
  live: true,
  retry: true,
});

// Create indexes for Mango
db.createIndex({
  index: { fields: ["parentId"] },
});
db.createIndex({
  index: { fields: ["status"] },
});
db.createIndex({
  index: { fields: ["parentId", "status"] },
});
db.createIndex({
  index: { fields: ["parentId", "priority", "status"], ddoc: "parent-status-priority" },
});
