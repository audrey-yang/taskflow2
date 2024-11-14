import PouchDB from "pouchdb";

export const db: PouchDB = new PouchDB("http://127.0.0.1:5984/tasks");
PouchDB.plugin(require("pouchdb-find"));
db.info().then((info: any) => {
  console.log("Hello, PouchDB!");
  console.log(info);
});

// Create indexes for Mango
db.createIndex({
  index: { fields: ["parentId"] },
});
db.createIndex({
  index: { fields: ["_id"] },
});
db.createIndex({
  index: { fields: ["priority", "status"] },
});
