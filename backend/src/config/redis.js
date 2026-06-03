import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
dotenv.config();

let redisClient = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('Successfully configured Upstash Redis.');
  } catch (err) {
    console.error('Error configuring Upstash Redis:', err);
  }
} else {
  console.warn('WARNING: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not defined in environment variables. Caching will be disabled.');
}

export default redisClient;
