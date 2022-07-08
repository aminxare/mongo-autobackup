const createLogger =require("../models/log.js");

const log = async (
  name,
  text,
  collectionName = "log"
) => {
  const Logger = createLogger(collectionName);
  return await new Logger({
    text,
    name,
  }).save();
};

module.exports = log;
