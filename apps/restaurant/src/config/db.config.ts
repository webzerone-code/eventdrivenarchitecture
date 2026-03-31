import { registerAs } from '@nestjs/config';

export default registerAs('db-config', () => ({
  mongoUrlConnection: {
    uri:
      process.env.MONGO_DB_URL ??
      (() => {
        throw new Error('MONGO_URI not found');
      })(),
  },
}));
