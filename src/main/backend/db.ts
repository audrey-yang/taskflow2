import { app } from "electron";
import { IamAuthenticator } from "ibm-cloud-sdk-core";
import path from "path";
import PouchDB from "pouchdb";
PouchDB.plugin(require("pouchdb-find"));

export const db = new PouchDB(path.join(app.getPath("sessionData"), "leveldb"));

// Get Cloudant auth credentials
const authenticator = new IamAuthenticator({
  apikey: import.meta.env.VITE_CLOUDANT_API_KEY,
});

// Create DB and sync with remote DB
const remoteDb = new PouchDB(`${import.meta.env.VITE_CLOUDANT_URL}`, {
  fetch: async (url: any, opts: any) => {
    const bearerOpts: { headers: { [key: string]: string } } = { headers: {} };
    await authenticator.authenticate(bearerOpts);
    opts.headers.set("Authorization", bearerOpts["headers"]["Authorization"]);
    return PouchDB.fetch(url, opts);
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
