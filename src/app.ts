import { Express, Request, Response } from 'express';
import express from 'express';
import ICache from './cache/i-cache';
import ITibber, { TibberResponse } from './tibber/i-tibber';
import IGetTibberPriceLevel from './use-case/i-get-tibber-price-level';
import GetTibberPriceLevel from './use-case/get-tibber-price-level';

export default (cache: ICache<TibberResponse>, tibber: ITibber): Express => {
  const app: Express = express();
  
  app.get('/', async (req: Request, res: Response) => {
    const useCase: IGetTibberPriceLevel = new GetTibberPriceLevel(tibber, cache);
    const dto = await useCase.get(new Date());
    res.json(dto);
  });

  return app;
};
