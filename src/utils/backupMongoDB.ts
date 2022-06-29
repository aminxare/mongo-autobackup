import {spawn} from "child_process";
import fs from "fs";
import path from "path";

interface BackupArgs {
  uri: string;
  dbName: string;
  backupPath: string;
  options?: {
    onError?: (error: Error) => void;
    onExit?: (code: number, signal: NodeJS.Signals) => void;
  };
}

// function create backups directory if it doesn't exist
function createBackupDirectory(backupPath: string) {
  const backupDirectory = path.dirname(backupPath);
  if (!fs.existsSync(backupDirectory)) {
    fs.mkdirSync(backupDirectory);
  }
}

const backupMongoDB = ({
  uri = "mongodb://localhost:27017/",
  dbName,
  backupPath,
  options: {onError, onExit},
}: BackupArgs) => {
  if (!dbName) throw new Error("dbName is not set");
  if (!backupPath) throw new Error("backupPath is not set");
  createBackupDirectory(backupPath);

  const mongodump = spawn("mongodump", [
    `--db=${dbName}`,
    `--uri=${uri}`,
    `--archive=${backupPath}`,
    "--gzip",
  ]);

  mongodump.on("error", (error) => onError && onError(error));
  mongodump.on("exit", (code, signal) => onExit && onExit(code, signal));

  return mongodump;
};

export default backupMongoDB;
