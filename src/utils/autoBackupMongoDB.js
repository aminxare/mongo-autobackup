const cron = require("node-cron");
const backupMongoDB = require("./backupMongoDB.js");
const log = require("./log.js");

const autoBackupMongoDB = ({ uri, cronExpression, dbName, backupPath }) => {
  backupMongoDB.on("backupend", ({date, code, signal}) => {
    const dateISO = date.toISOString();
    const text = `date: ${dateISO}, Code: ${code}, signal: ${signal}`;

    log("backup", text);
  });
  
  const task = cron.schedule(cronExpression, (now) => {
    backupMongoDB.backup({
      uri,
      dbName,
      backupPath
    });
  });

  return { task };
};

module.exports = autoBackupMongoDB;
