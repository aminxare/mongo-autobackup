import path from "path";
import autoBackupMongoDB from "./utils/autoBackupMongoDB";

require("dotenv").config();

function getBackupPath() {
  const filename = `${new Date().toISOString().split("T")[0]}.archive`;
  return path.extname(process.env.BACKUP_PATH) !== ""
    ? process.env.BACKUP_PATH
    : path.join(process.cwd(), "backups", filename);
}

autoBackupMongoDB({
  uri: process.env.MONGODB_URI || "mongodb://localhost:27017",
  backupPath: getBackupPath(),
  dbName: process.env.DATABASE_NAME,
  cronExpression: process.env.CRONEXPRESSION,
});
