import cron from "node-cron";
import backupMongoDB from "./backupMongoDB";
import log from "./log";

interface options {
  uri: string;
  cronExpression: string;
  dbName: string;
  backupPath: string;
}

const autoBackupMongoDB = ({ uri, cronExpression, dbName, backupPath }:options) => {
  backupMongoDB.on("backupend", ({ date, code, signal }) => {
    const dateISO = date.toISOString();
    const text = `date: ${dateISO}, Code: ${code}, signal: ${signal}`;

    log("backup", text);
  });

  const task = cron.schedule(cronExpression, (now) => {
    backupMongoDB.backup({
      uri,
      dbName,
      backupPath,
    });
  });

  return { task };
};

export default autoBackupMongoDB;
