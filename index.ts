import { Express } from 'express';
import dotenv from 'dotenv';

import createApp from './app';

dotenv.config();

const port = process.env.PORT || 5005;
const homeId = process.env.TIBBER_HOME_ID;
const token = process.env.TIBBER_API_TOKEN;

if (!homeId || !token) {
  console.error('Environment variables TIBBER_HOME_ID and TIBBER_API_TOKEN must be set!');
  process.exit(1);
}

const app: Express = createApp(homeId, token);

app.listen(port, () => console.log(`Listening on port ${port}`));
