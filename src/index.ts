import path from "path";
import autoBackupMongoDB from "./utils/autoBackupMongoDB";
import mongoose from "mongoose";

require("dotenv").config();

function getBackupPath() {
  const filename = `${new Date().toISOString().split("T")[0]}.archive`;
  return path.extname(process.env.BACKUP_PATH) !== ""
    ? process.env.BACKUP_PATH
    : path.join(process.cwd(), "backups", filename);
}

const mongodbUri = `mongodb://localhost:27017/${process.env.DATABASE_NAME}`;

mongoose.connect(mongodbUri, (error) => {
  autoBackupMongoDB({
    uri: process.env.MONGODB_URI || mongodbUri,
    backupPath: getBackupPath(),
    dbName: process.env.DATABASE_NAME,
    cronExpression: process.env.CRONEXPRESSION,
  });
});
