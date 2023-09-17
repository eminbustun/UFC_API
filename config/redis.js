/*
//* Bu kisim deployda calisiyor ama developmentta calismiyor.

//? works in deploy but not in local

const client = redis.createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
}); // şu url vs redisle verebiliriz.

client.connect().then(console.log("Redis is connected")).catch("error");

exports.setRedis = async (key, value) => {
  return await client.set(key, value);
};

exports.getRedis = async key => {
  return await client.get(key);
};

exports.removeRedis = async key => {
  return await client.del(key);
};

*/

const { createClient } = require("redis");

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
redisClient.on("error", err => console.log("Redis Client Error", err));

const connectToRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis.");
  } catch (err) {
    console.log("Could not connected to Redis", err);
  }
};

const setRedis = async (key, value) => {
  return await redisClient.set(key, value);
};

const getRedis = async key => {
  return await redisClient.get(key);
};

const removeRedis = async key => {
  return await redisClient.del(key);
};

module.exports = {
  redisClient,
  connectToRedis,
  getRedis,
  setRedis,
  removeRedis,
};
