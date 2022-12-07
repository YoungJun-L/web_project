import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'dev';

if (NODE_ENV === 'prod') dotenv.config({ path: `${__dirname}/../../.env.prod` });
else if (NODE_ENV === 'dev') dotenv.config({ path: `${__dirname}/../../.env.dev` });
else if (NODE_ENV === 'test') dotenv.config({ path: `${__dirname}/../../.env.test` });

const env = process.env;

export default {
  NODE_ENV: env.NODE_ENV,
  HOST: env.HOST,
  PORT: Number(env.PORT),
  RDS_HOSTNAME: env.RDS_HOSTNAME,
  RDS_USERNAME: env.RDS_USERNAME,
  RDS_PASSWORD: env.RDS_PASSWORD,
  RDS_DB_NAME: env.RDS_DB_NAME,
};
