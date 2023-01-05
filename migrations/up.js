import fs from 'fs';
import path from 'path';
import { createConnection } from 'mysql2/promise';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const retryLimit = 5;

function connectDb() {
  return createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });
}

function attemptConnection(fn, retries = 3, err = null) {
  if (!retries) {
    return Promise.reject(err);
  }
  return fn().catch(async (err) => {
    console.log(`Retrying connection. Retries left: ${retries}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return attemptConnection(fn, retries - 1, err);
  });
}

const up = async () => {
  const db = await attemptConnection(connectDb, retryLimit);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  var filePath = path.join(__dirname, 'sqls', 'doctors_db_add_tables_up.sql');
  const sqlData = await new Promise(function (resolve, reject) {
    fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
  await db.query(sqlData);
  console.log('Query run successfully');
  db.end();
};

up();