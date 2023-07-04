const Redis = require("redis");
const {
  REDIS_USERNAME,
  REDIS_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
} = require("../config/config");

class Cache {
  constructor() {
    this.redis = null;
  }

  async connect() {
    try {
      this.redis = await Redis.createClient({
        url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
      });

      this.redis.connect();

      this.redis.on("connect", () => {
        console.log("Redis connected");
      });

      this.redis.on("error", () => {
        console.log("Redis connection error");
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const instance = new Cache();

module.exports = instance;
