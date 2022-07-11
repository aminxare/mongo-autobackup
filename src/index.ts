"use strict";
import path from "path";
import mongoose from "mongoose";
import autoBackupMongoDB from "./utils/autoBackupMongoDB.js";

require("dotenv").config();

function getBackupPath():string {
  const filename = `${new Date().toISOString().split("T")[0]}.archive`;
  const backupPath = process.env.BACKUP_PATH!;

  return path.extname(backupPath) !== ""
    ? backupPath
    : path.join(backupPath || process.cwd() +"backups", filename);
}

const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost'
const CRONEXPRESSION = process.env.CRONEXPRESSION!;

const mongodbUri = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${process.env.DATABASE_NAME}`;

mongoose.connect(mongodbUri, (error) => {
  if(error){
    console.log('Cannot connect to MongoDB!')
    console.log(error)
    return;
  }
  autoBackupMongoDB({
    uri: mongodbUri,
    backupPath: getBackupPath(),
    dbName: process.env.DATABASE_NAME!,
    cronExpression: CRONEXPRESSION,
  });
});
