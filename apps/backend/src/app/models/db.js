import Sequelize from 'sequelize';

/**
 * Sequelize instance
 */
const db = new Sequelize({
  dialect: 'mysql',
  database: process.env.NX_DB_NAME || 'hrman_db',
  username: process.env.NX_DB_USER || 'hrman',
  password: process.env.NX_DB_PASS || '1234',
  host: process.env.NX_DB_HOST || 'localhost',
  port: process.env.NX_DB_PORT || '3306',
});
export default db;

/**
 * Import model initializers
 */
import { init as employeeInit } from './employees';

/**
 * List of model initializers
 */
const modelInits = [employeeInit];

/**
 * Connect to database and sync table definitions.
 */
export async function InitDB() {
  try {
    // check database connetion
    await db.authenticate();
    // initialize model mapping
    modelInits.map((init) => {
      init(db);
    });
    // sync database
    await db.sync();
  } catch (err) {
    console.error('Could not connect to database:', err);
  }
}
