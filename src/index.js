"use strict";
const path = require("path");
const mongoose = require("mongoose");
const autoBackupMongoDB = require("./utils/autoBackupMongoDB.js");

require("dotenv").config();

function getBackupPath() {
  const filename = `${new Date().toISOString().split("T")[0]}.archive`;
  return path.extname(process.env.BACKUP_PATH) !== ""
    ? process.env.BACKUP_PATH
    : path.join(process.cwd(), "backups", filename);
}

const mongodbUri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.DATABASE_NAME}`;

mongoose.connect(mongodbUri, (error) => {
  if(error){
    console.log('Cannot connect to MongoDB!')
    console.log(error)
    return;
  }
  autoBackupMongoDB({
    uri: mongodbUri,
    backupPath: getBackupPath(),
    dbName: process.env.DATABASE_NAME,
    cronExpression: process.env.CRONEXPRESSION,
  });
});
