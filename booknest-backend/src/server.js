import http from 'http';
import { app } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSockets } from './sockets/index.js';

const httpServer = http.createServer(app);
initSockets(httpServer); // shares the same server/port as Express, per Phase 6

async function start() {
  await connectDB();
  httpServer.listen(env.PORT, () => {
    console.log(`BookNest API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

start();