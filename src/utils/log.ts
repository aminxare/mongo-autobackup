import createLogger from "../models/log";

const log = async (
  name: string,
  text: string,
  collectionName: string = "log"
) => {
  const Logger = createLogger(collectionName);
  return await new Logger({
    text,
    name,
  }).save();
};

export default log;
