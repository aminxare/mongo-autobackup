import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import EventEmitter from "events";
import fs from "fs";
import path from "path";

interface options {
  uri: string;
  dbName: string;
  backupPath: string;
}

// function create backups directory if it doesn't exist
function createBackupDirectory(backupPath: string) {
  const backupDirectory = path.dirname(backupPath);
  if (!fs.existsSync(backupDirectory)) {
    fs.mkdirSync(backupDirectory);
  }
}

const backupMongoDBFn = function (
  this: EventEmitter & {
    backup: ({
      uri,
      dbName,
      backupPath,
    }: options) => ChildProcessWithoutNullStreams;
  },
  { uri = "mongodb://localhost:27017/", dbName, backupPath }: options
) {
  if (!dbName) throw new Error("dbName is not set");
  if (!backupPath) throw new Error("backupPath is not set");
  createBackupDirectory(backupPath);

  const mongodump = spawn("mongodump", [
    `--db=${dbName}`,
    // `--uri=${uri}`,
    `--archive=${backupPath}`,
    "--gzip",
  ]);

  mongodump.on("exit", (code, signal) => {
    try {
      this.emit("backupend", { date: new Date(), code, signal });
    } catch (err) {
      console.log(err);
    }
  });

  return mongodump;
};

const backuper = {
  backup: backupMongoDBFn,
};

export default Object.assign(new EventEmitter(), backuper);
