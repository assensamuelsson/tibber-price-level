import ITibber, { TibberResponse } from "../tibber/i-tibber";
import ICache from '../cache/i-cache';
import IGetTibberPriceLevel, { TibberPriceLevelDTO } from "./i-get-tibber-price-level";

export default class GetTibberPriceLevel implements IGetTibberPriceLevel {

  tibber: ITibber;
  cache: ICache<TibberResponse>;

  constructor(tibber: ITibber, cache: ICache<TibberResponse>) {
    this.tibber = tibber;
    this.cache = cache;
  }

  async get(now: Date): Promise<TibberPriceLevelDTO> {
    const cached = this.cache.get(now);

    let response: TibberResponse;
    if (!cached) {
      console.log(now, " - TibberResponse not in cache or expired - Fetching...");

      response = await this.tibber.get();

      const expireAt = new Date(response.data.viewer.home.currentSubscription.priceInfo.today[14].startsAt);
      expireAt.setDate(expireAt.getDate() + 1);

      console.log(now, " - Setting cache value with expireAt: " + expireAt);
      this.cache.put(response, expireAt);
    } else {
      response = cached;
    }

    const prices = [
      ...response.data.viewer.home.currentSubscription.priceInfo.today,
      ...(response.data.viewer.home.currentSubscription.priceInfo.tomorrow || []),
    ]

    const current = prices.find((price) => {
      const priceDate = new Date(price.startsAt);
      return (
        priceDate.getFullYear() === now.getFullYear()
        && priceDate.getMonth() === now.getMonth()
        && priceDate.getDate() === now.getDate()
        && priceDate.getHours() === now.getHours()
      );
    });

    if (!current) {
      return {
        level: 'UNDEFINED',
      };
    } else {
      const costs = prices.map((price) => price.total);

      const q20 = quantile(costs, 0.2);
      const q40 = quantile(costs, 0.4);
      const q60 = quantile(costs, 0.6);
      const q80 = quantile(costs, 0.8);

      let level;
      if (current.total < q20) {
        level = 'VERY_CHEAP';
      } else if (current.total < q40) {
        level = 'CHEAP';
      } else if (current.total < q60) {
        level = 'MEDIUM';
      } else if (current.total < q80) {
        level = 'EXPENSIVE';
      } else {
        level = 'VERY_EXPENSIVE'
      }

      if (current.total < 0.4) {
        level = 'VERY_CHEAP';
      } else if (current.total < 0.6) {
        level = 'CHEAP';
      }

      return {
        level,
        current: current.total,
        q20,
        q40,
        q60,
        q80,
      };
    }
  }
};

const quantile = (arr: number[], q: number): number => {
  const sorted = arr.sort();
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
      return sorted[base];
  }
};