require('dotenv').config();
const Queue = require('bull');
const redisConfig = { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT };

const imageProcessingQueue = new Queue('imageProcessing', { redis: redisConfig });

module.exports = imageProcessingQueue;