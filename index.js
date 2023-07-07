const app = require("./app");
const { MONGODB_URI, PORT } = require("./config/config");
const connectToMongoDB = require("./database/db");
const Cache = require("./cache/redis");
const logger = require("./logging/winston-logger");

// start the server
const start = async () => {
  try {
    Cache.connect();
    await connectToMongoDB(MONGODB_URI);
    app.listen(PORT, () => {
      logger.info(`server is listening on http://localhost:${PORT}`);
      // console.log(`server is listening on https://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    // console.log(error);
  }
};

start();
