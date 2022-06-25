import {spawn} from "child_process";
import fs from "fs";
import path from "path";

// function create backups directory if it doesn't exist
function createBackupDirectory(backupPath) {
  const backupDirectory = path.dirname(backupPath);
  if (!fs.existsSync(backupDirectory)) {
    fs.mkdirSync(backupDirectory);
  }
}

const backupMongoDB = ({
  uri = "mongodb://localhost:27017/",
  dbName,
  backupPath,
}) => {
  if (!dbName) throw new Error("dbName is not set");
  if (!backupPath) throw new Error("backupPath is not set");
  createBackupDirectory(backupPath);

  const mongodump = spawn("mongodump", [
    `--db=${dbName}`,
    `--uri=${uri}`,
    `--archive=${backupPath}`,
    "--gzip",
  ]);

  mongodump.on("error", (error) => {
    console.log(error);
  });

  mongodump.on("exit", (code, signal) => {
    console.log(`mongodump exited with code ${code}`);
    console.log(`mongodump exited with sginal ${signal}`);
    !code ? console.log("Backup complete") : console.log("Backup failed");
  });

  return mongodump;
};

export default backupMongoDB;
