import { registerAs } from '@nestjs/config';

export default registerAs('redis-config', () => ({
  REDIS_HOST: process.env.REDISHOST,
  REDIS_PORT: process.env.REDISPORT,
}));
