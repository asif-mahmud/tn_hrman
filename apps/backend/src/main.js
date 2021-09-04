/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';

import { InitDB } from './app/models/db';
import AddEmployeeRoutes from './app/routes/employees';

const app = express();

/**
 * Middleware setup
 */
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
); // enable http loggin
app.use(cors()); // enable CORS for all routes
app.use(express.json());

const port = process.env.port || 3333;
const server = app.listen(port, async () => {
  console.log(`Listening at http://localhost:${port}`);

  // initialize database, this may fail if database
  // connection could not be established
  await InitDB();

  // add employee routes
  AddEmployeeRoutes(app);
});
server.on('error', console.error);
