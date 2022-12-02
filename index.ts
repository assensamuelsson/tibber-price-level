import { Express } from 'express';
import dotenv from 'dotenv';

import createApp from './src/app';
import ITibber, { TibberResponse } from './src/tibber/i-tibber';
import Cache from './src/cache/cache';
import Tibber from './src/tibber/tibber';
import ICache from './src/cache/i-cache';

dotenv.config();

const port = process.env.PORT || 5005;
const homeId = process.env.TIBBER_HOME_ID;
const token = process.env.TIBBER_API_TOKEN;

if (!homeId || !token) {
  console.error('Environment variables TIBBER_HOME_ID and TIBBER_API_TOKEN must be set!');
  process.exit(1);
}

const cache: ICache<TibberResponse> = new Cache<TibberResponse>();
const tibber: ITibber = new Tibber(token, homeId);

const app: Express = createApp(cache, tibber);

app.listen(port, () => console.log(`Listening on port ${port}`));
