const { spawn } = require("child_process");
const path = require("path");
const cron = require("node-cron");
const fs = require('fs')

function backupMongoDB({ dbName, backupPath }) {
  const mongodump = spawn("mongodump", [
    `--db=${dbName}`,
    `--archive=${backupPath}`,
    "--gzip",
  ]);

  mongodump.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  mongodump.stderr.on("data", (data) => {
    // console.log(`stderr: ${Buffer.from(data).toString()}`);
  });

  mongodump.on("error", (error) => {
    console.log(error);
  });

  mongodump.on("exit", (code) => {
    console.log(`mongodump exited with code ${code}`);
    console.log("Backup complete");
  });

  mongodump.on("close", (code) => {
    console.log(`mongodump exited with code ${code}`);
  });

  return mongodump;
}

// function create backups directory if it doesn't exist
function createBackupDirectory(backupPath) {
  const backupDirectory = path.dirname(backupPath);
  if (!fs.existsSync(backupDirectory)) {
    fs.mkdirSync(backupDirectory);
    return true
  }
  return false
}

function autoBackupMongoDB({ cronExpression, dbName, backupPath }) {
  createBackupDirectory(backupPath);
  return cron.schedule(cronExpression, () => backupMongoDB({ dbName, backupPath }));
}

module.exports = autoBackupMongoDB;