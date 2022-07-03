import * as cron from "node-cron";
import EventEmitter from "events";
import backupMongoDB from "./backupMongoDB";
import logger from "./logger";

const autoBackupMongoDB = ({ uri, cronExpression, dbName, backupPath }) => {
  const eventEmitter = new EventEmitter();

  const task = cron.schedule(cronExpression, (now) => {
    backupMongoDB({
      uri,
      dbName,
      backupPath,
      options: {
        onError: (err) => console.log(err),
        onExit: (code, signal) => {
          const date = new Date().toISOString();
          const text = `date: ${date}, Code: ${code}, signal: ${signal}`;
          new logger({
            name: "backup",
            text,
          })
            .save()
            .catch(console.log);

          console.log(text);
        },
      },
    });
  });

  return { ...eventEmitter, task };
};

export default autoBackupMongoDB;
