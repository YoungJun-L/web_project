import app from './app.js';
import env from './config';
import mysql from 'mysql';

const pool = mysql.createPool({
  connectionLimit: 1000,
  host: env.RDS_HOSTNAME,
  user: env.RDS_USERNAME,
  password: env.RDS_PASSWORD,
  database: env.RDS_DB_NAME,
  multipleStatements: true,
});

app.listen(env.PORT, env.HOST, err => {
  if (err) throw err;
  console.log(`Server is running on ${env.HOST}:${env.PORT}`);
});

export default pool;
