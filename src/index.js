const { spawn } = require("child_process");
const path = require("path");
const cron = require("node-cron");
const fs = require("fs");
const EventEmitter = require("events");
const { program } = require("commander");

const getOptionsFromCommand = () => {
  program
    .description("Backup MongoDB")
    .option("-u, --uri <uri>", "MongoDB URI", "mongodb://localhost:27017")
    .option("-d, --db <db>", "MongoDB database name")
    .option("-p, --path <path>", "Backup path")
    .option("-c, --cron <cron>", "Cron expression")
    .parse();

  const { uri, db, path, cron } = program.opts();
  return { uri, dbName: db, backupPath: path, cronExpression: cron };
};

function backupMongoDB({ uri = "mongodb://localhost:27017/", dbName, backupPath }) {
  if(!dbName ) throw new Error("dbName is not set") 
  if(!backupPath ) throw new Error("backupPath is not set") 
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
}

// function create backups directory if it doesn't exist
function createBackupDirectory(backupPath) {
  const backupDirectory = path.dirname(backupPath);
  if (!fs.existsSync(backupDirectory)) {
    fs.mkdirSync(backupDirectory);
  }
}

// opts: { uri, cronExpression, dbName, backupPath }
function autoBackupMongoDB(opts) {
  const { uri, cronExpression, dbName, backupPath } =
    opts || getOptionsFromCommand();
  const eventEmitter = new EventEmitter();
  
  const task = cron.schedule(cronExpression, (now) => {
    backupMongoDB({ uri, dbName, backupPath });
    eventEmitter.emit("backup", now);
  });

  return { ...eventEmitter, task };
}

exports.autoBackupMongoDB = autoBackupMongoDB;
exports.backupMongoDB = backupMongoDB;

exports = autoBackupMongoDB;
