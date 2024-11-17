import PouchDB from "pouchdb";

export const db: PouchDB = new PouchDB("http://127.0.0.1:5984/tasks");
PouchDB.plugin(require("pouchdb-find"));
db.info()
  .then((_) => {
    console.log("Hello, PouchDB!");
  })
  .catch((err: any) => {
    console.error(err);
  });

// Create indexes for Mango
db.createIndex({
  index: { fields: ["parentId"] },
});
db.createIndex({
  index: { fields: ["_id"] },
});
db.createIndex({
  index: { fields: ["status"] },
});
db.createIndex({
  index: { fields: ["priority", "status"] },
});
