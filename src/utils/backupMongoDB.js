const { spawn } = require("child_process");
const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

// function create backups directory if it doesn't exist
function createBackupDirectory(backupPath) {
  const backupDirectory = path.dirname(backupPath);
  if (!fs.existsSync(backupDirectory)) {
    fs.mkdirSync(backupDirectory);
  }
}

const backupMongoDBFn = function ({
  uri = "mongodb://localhost:27017/",
  dbName,
  backupPath,
}) {
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

module.exports = Object.assign(new EventEmitter(), backuper);
