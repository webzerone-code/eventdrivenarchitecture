import { registerAs } from '@nestjs/config';

export default registerAs('elastic-config', () => ({
  elasticConnection: {
    url:
      process.env.ELASTIC_CONNECTION ??
      (() => {
        throw new Error('Elastic url not found');
      })(),
    username: process.env.ELASTIC_USER,
    password: process.env.ELASTIC_PASSWORD,
  },
}));
