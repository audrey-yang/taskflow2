import PouchDB from "pouchdb";

export const db: PouchDB = new PouchDB("http://127.0.0.1:5984/tasks");
db.info().then((info: any) => {
  console.log("Hello, PouchDB!");
  console.log(info);
});
