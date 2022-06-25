import * as cron from "node-cron";
import EventEmitter from "events";
import backupMongoDB from "./backupMongoDB";

// opts: { uri, cronExpression, dbName, backupPath }
const autoBackupMongoDB = ({uri, cronExpression, dbName, backupPath}) => {
  const eventEmitter = new EventEmitter();

  const task = cron.schedule(cronExpression, (now) => {
    backupMongoDB({uri, dbName, backupPath});
    eventEmitter.emit("backup", now);
  });

  return {...eventEmitter, task};
};

export default autoBackupMongoDB;
