const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoDb = MongoMemoryServer;

const connect = async () => {
  mongoDb = await MongoMemoryServer.create();
  const uri = mongoDb.getUri();
  await mongoose.connect(uri);
};

const cleanup = async () => {
  await mongoose.connection.dropDatabase();
};

const disconnect = async () => {
  await mongoose.disconnect();
  await mongoDb.stop();
};

module.exports = {
  connect,
  cleanup,
  disconnect,
};

